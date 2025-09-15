import { Account, Client, OAuthProvider, Databases, Avatars, ID, TablesDB, Query, Locale, Storage, Models } from "react-native-appwrite";

import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser';
import { Item, CoordinatesType, Message, Chatroom, ChatroomResponse, MessageResponse } from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    projectKey: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_KEY,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    imagesTableId: process.env.EXPO_PUBLIC_APPWRITE_IMAGES_TABLE_ID,
    userTableId: process.env.EXPO_PUBLIC_APPWRITE_USER_TABLE_ID,
    itemsTableId: process.env.EXPO_PUBLIC_APPWRITE_ITEMS_TABLE_ID,
    chatRoomTableId: process.env.EXPO_PUBLIC_APPWRITE_CHAT_ROOM_TABLE_ID,
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    messagesTableId: process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_TABLE_ID,
};
export const client = new Client();
client.setEndpoint(appwriteConfig.endpoint!);
client.setProject(appwriteConfig.projectId!);
client.setPlatform(appwriteConfig.platform!);
export const storage = new Storage(client);      // For file storage
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

export async function getUserFromDatabase(userId?: string) {
    try {
        // First check if user has an active session
        const accountUser = await getCurrentUser();
        if (!accountUser) return null;

        
        const userQuery = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.userTableId!,
            queries: userId ? [Query.equal("$id", userId)] : [Query.equal("accountId", accountUser.$id)]
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
                avatar: avatarUrl,
            }
        });
        
        console.log("New user created in database:", newUser);
        return newUser;
    } catch (error) {
        console.log("Error creating user:", error);
        return null;
    }
}// Fixed uploadImageToStorage function
async function uploadImageToStorage(imageUrl: string) {
    try {
        // Download the image from the URL
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        // Prepare the file object for upload
        const fileObj = {
            name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
            type: blob.type,
            size: blob.size,
            uri: imageUrl,
        };

        // Upload the file to Appwrite storage
        const file = await storage.createFile({
            bucketId: appwriteConfig.bucketId!,
            fileId: ID.unique(),
            file: fileObj
        });

        // Fixed: Use bucketId instead of imagesTableId for getFileViewURL
        return storage.getFileViewURL(appwriteConfig.bucketId!, file.$id);
    } catch (error) {
        console.log("Error uploading image to storage:", error);
        throw error;
    }
}

// Fixed addItems function
export async function addItems({
    title,
    description,
    latitude,
    longitude,
    category,
    image,
    eventDate,
    startTime,
    endTime,
    address
}: Item) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        console.log("User authenticated:", user);
        const userIdfromDb = await getUserFromDatabase();
        

        const uploadedImage = await uploadImageToStorage(image);

        const newItem = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.itemsTableId!,
            rowId: ID.unique(),
            data: {
                user: userIdfromDb?.$id,
                title,
                description: description || undefined,
                latitude,
                longitude,
                category,
                image: uploadedImage,
                address: address,
                eventDate: eventDate.toISOString(),
                startTime: startTime?.toISOString(),
                endTime: endTime?.toISOString(),
            }
        });
        
        console.log("New item created in database:", newItem);
        return newItem;
    } catch (error) {
        console.log("Error creating item:", error);
        return null;
    }
}

// Fixed getItems function
export async function getItems({category, query, distance}: {category?: string, query?: string, distance?: number}) {
    try {
        const queries: string[] = [];
        
        // Fixed: Use consistent field name
        if (category) queries.push(Query.equal("category", [category]));
        
        // Fixed: Search in title field instead of name\
        if (query) queries.push(Query.contains("title", query));
        console.log("Query:", queries);
        const items = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.itemsTableId!,
            queries
        });

        // Convert date strings back to Date objects if needed
        const processedItems = items.rows.map(item => ({
            ...item,
            eventDate: new Date(item.eventDate),
            location: item.location,
            startTime: item.startTime ? new Date(item.startTime) : undefined,
            endTime: item.endTime ? new Date(item.endTime) : undefined,
        }));

        return processedItems;
       
    } catch (error) {
        console.log("Error getting items:", error);
        return [];
    }
}

export async function createChatRoom({itemId, sellerId, buyerId}: {itemId: string, sellerId: string, buyerId: string}) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        const Id = ID.unique();
        await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.chatRoomTableId!,
            rowId: Id,
            data: {
                // user: userIdfromDb?.$id,
                item: itemId,
                seller: sellerId,
                buyer: buyerId
            }
        })  
        return Id;    
        
    } catch (error) {
        console.log("Error creating chat room:", error);
    }
}

export async function getChatRooms(): Promise<ChatroomResponse> {
    try {
        const user = await getUserFromDatabase();
        const userId = user?.$id;
        
        if (!userId) {
            return { rows: [], total: 0 };
        }
        const response = await tablesDB.listRows<Chatroom>({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.chatRoomTableId!,
            queries: [Query.or([
                Query.equal("seller", [userId]),
                Query.equal("buyer", [userId])
            ])],
        }) as unknown as ChatroomResponse;
        return response || { rows: [], total: 0 };
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        return { rows: [], total: 0 };
    }
}

export async function addMessage(message: { content: string; senderId: string; chatroomId: string }) {
    await tablesDB.createRow({
        databaseId: appwriteConfig.databaseId!,
        tableId: appwriteConfig.messagesTableId!,
        rowId: ID.unique(),
        data: {
            content: message.content,
            senderId: message.senderId,
            chatroomId: message.chatroomId
        }
    });
}
export async function subscribeToMessages(chatroomId: string) {
    return await tablesDB.updateRow({
        databaseId: appwriteConfig.databaseId!,
        tableId: appwriteConfig.chatRoomTableId!,
        rowId: chatroomId,
        data: { $updatedAt: new Date().toISOString() }
    });
}
export async function getMessagesForChatroom(chatroomId: string) {
    const response = await tablesDB.listRows({
        databaseId: appwriteConfig.databaseId!,
        tableId: appwriteConfig.messagesTableId!,
        queries: [
            Query.equal("chatroomId", [chatroomId]), 
            Query.orderDesc("$createdAt"), // Oldest first
            Query.limit(100)
        ],
    });
    return response as unknown as MessageResponse;
}
export const chatroomChannel = `databases.${appwriteConfig.databaseId}.tables.${appwriteConfig.chatRoomTableId!}.rows.`;


