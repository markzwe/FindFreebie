import { Account, Client, OAuthProvider, Databases, Avatars, ID, TablesDB, Query, Locale } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    projectKey: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_KEY,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    imagesTableId: process.env.EXPO_PUBLIC_APPWRITE_IMAGES_TABLE_ID,
    userTableId: process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID,
    itemsTableId: process.env.EXPO_PUBLIC_APPWRITE_ITEMS_TABLE_ID,
};
export const client = new Client();
client.setEndpoint(appwriteConfig.endpoint!);
client.setProject(appwriteConfig.projectId!);
client.setPlatform(appwriteConfig.platform!);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatar = new Avatars(client);
export const tablesDB = new TablesDB(client);
const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
const scheme = `${deepLink.protocol}//`;

export async function login() {
    try {
        const redirectUri = Linking.createURL("/");
        const response = account.createOAuth2Token(
            {
                provider: OAuthProvider.Google,
                success: `${deepLink}`,
                failure: `${deepLink}`,
            }
        )

        if (!response) {
            throw new Error("Failed to create OAuth2 token");
        }

        const browserResult  = await WebBrowser.openAuthSessionAsync(`${response}`, scheme);

        if (browserResult.type !== "success") {
            throw new Error("Failed to login");            
        }
        const url = new URL((browserResult as any).url);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();
        if (!secret || !userId) {
            throw new Error("Failed to login");
        }
        const session = await account.createSession({ userId, secret });
        const user = await account.get();
        const dbUser = await createUser(user.name, user.email);
        console.log("Login successful, user data:", dbUser);
        return session;

    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getLocation() {

const locale = new Locale(client);

const result = await locale.get();

console.log(result);
}
export async function logout() {
    try {
        await account.deleteSession({
            sessionId: "current"
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export async function getCurrentUser() {
    try {
        const user = await account.get();
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getUserFromDatabase() {
    try {
        // First check if user has an active session
        const accountUser = await getCurrentUser();
        if (!accountUser) return null;
        
        const userQuery = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.userTableId!,
            queries: [Query.equal("accountId", accountUser.$id)]
        });
        
        if (userQuery.rows.length > 0) {
            return userQuery.rows[0];
        }
        
        return null;
    } catch (error) {
        console.log("Error getting user from database:", error);
        return null;
    }
}

export const createUser = async (name: string, email: string) => {
    try {
        const user = await getCurrentUser();
        if (!user) {
            console.log("No authenticated user found");
            return null;
        }
        
        // Check if user already exists in database
        try {
            const existingUser = await tablesDB.listRows({
                databaseId: appwriteConfig.databaseId!,
                tableId: appwriteConfig.userTableId!,
                queries: [Query.equal("accountId", user.$id)]
            });
            
            if (existingUser.rows.length > 0) {
                console.log("User already exists in database");
                return existingUser.rows[0];
            }
        } catch (error) {
            console.log("Error checking existing user:", error);
        }
        
        // Create new user if doesn't exist
        // const avatarUrl = avatar.getInitials({name});
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;
        const newUser = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.userTableId!,
            rowId: ID.unique(),
            data: {
                accountId: user.$id,
                name,
                email,
                avatar: avatarUrl.toString(),
            }
        });
        
        console.log("New user created in database:", newUser);
        return newUser;
    } catch (error) {
        console.log("Error creating user:", error);
        return null;
    }
}

export async function getItems({category, query}: {category?: string, query?: string}) {
    try {
        const queries: string[] = [];
        if (category) queries.push(Query.equal("categories", category));
        if (query) queries.push(Query.search("name", query));

        const items = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.itemsTableId!,
            queries
        });

        return items.rows;
       
    } catch (error) {
        console.log("Error getting items:", error);
    }
}