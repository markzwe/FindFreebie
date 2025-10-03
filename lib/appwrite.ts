import { Account, Avatars, Client, Databases, ID, OAuthProvider, Query, Storage, TablesDB } from "react-native-appwrite";

import { Chatroom, ChatroomResponse, Item, MessageResponse } from "@/type";
import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from "expo-linking";
import * as Location from 'expo-location';
import * as WebBrowser from 'expo-web-browser';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userTableId: 'user',
    itemsTableId: 'items',
    chatRoomTableId: 'chatrooms',
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID,
    messagesTableId: 'messages',
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

export async function login() {
    // Build the redirect URI string at runtime so it reads from expo config
    const deepLinkStr = makeRedirectUri({ preferLocalhost: true });
    const redirectUri = Linking.createURL("/");

    try {
        // Try a few possible SDK methods to obtain an OAuth URL. Different Appwrite
        // SDKs/expos may expose slightly different helper names or return shapes.
        let authUrl: string | null = null;

        // Some SDK versions expose createOAuth2Token which may return a URL or an object
        if (typeof (account as any).createOAuth2Token === 'function') {
            try {
                const res = await Promise.resolve((account as any).createOAuth2Token({
                    provider: OAuthProvider.Google,
                    success: deepLinkStr,
                    failure: deepLinkStr,
                }));
                if (typeof res === 'string') authUrl = res;
                else if (res && typeof res === 'object') {
                    // sometimes SDK returns { url: '...' } or similar
                    authUrl = res.url || res.redirect || null;
                }
            } catch (e) {
                // ignore and try other options
                console.debug('createOAuth2Token attempt failed:', e);
            }
        }

        // Fallback: createOAuth2Session may be available in other SDK versions
        if (!authUrl && typeof (account as any).createOAuth2Session === 'function') {
            try {
                const res = await Promise.resolve((account as any).createOAuth2Session(
                    OAuthProvider.Google,
                    deepLinkStr,
                    deepLinkStr
                ));
                if (typeof res === 'string') authUrl = res;
                else if (res && typeof res === 'object') authUrl = res.url || res.redirect || null;
            } catch (e) {
                console.debug('createOAuth2Session attempt failed:', e);
            }
        }

        // Final fallback: try to build an auth URL from the Appwrite endpoint (best-effort)
        if (!authUrl && appwriteConfig.endpoint && appwriteConfig.projectId) {
            try {
                const provider = 'google';
                const base = appwriteConfig.endpoint.replace(/\/$/, '');
                const succ = encodeURIComponent(deepLinkStr);
                const fail = encodeURIComponent(deepLinkStr);
                authUrl = `${base}/v1/account/sessions/oauth2/${provider}?project=${appwriteConfig.projectId}&success=${succ}&failure=${fail}`;
            } catch (e) {
                console.debug('manual auth URL build failed:', e);
            }
        }

        if (!authUrl) throw new Error('Unable to obtain OAuth URL from SDK or build it');

        const browserResult = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

        if (browserResult.type !== 'success') {
            console.warn('Auth session did not complete successfully', browserResult);
            throw new Error('Failed to login');
        }

        const resultUrl = (browserResult as any).url || browserResult.url;
        if (!resultUrl) throw new Error('No redirect URL returned from auth session');

        const url = new URL(resultUrl);
        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();
        if (!secret || !userId) {
            throw new Error('Missing secret or userId in redirect URL');
        }

        const session = await account.createSession({ userId, secret });
        const user = await account.get();
        // Create user in database if needed
        const dbUser = await createUser(user.name, user.email);
        console.log('Login successful, user data:', dbUser);
        return session;

    } catch (error) {
        console.error('login error:', error);
        return null;
    }
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

export async function deleteAccount(userId: string) {
    try {
        // Ensure the current authenticated user matches the identityId
        // const current = await getCurrentUser();
        // if (!current || current.$id !== userId) {
        //     throw new Error('Not authenticated as the target account');
        // }

        // Try to find the user's DB row (if any)
        const dbId = appwriteConfig.databaseId!;

        // Delete items created by the user
        try {
            const items = await tablesDB.listRows({
                databaseId: dbId,
                tableId: appwriteConfig.itemsTableId!,
                queries: [Query.equal('user', [userId])]
            });
            for (const row of items.rows) {
                await tablesDB.deleteRow({ databaseId: dbId, tableId: appwriteConfig.itemsTableId!, rowId: row.$id });
            }
        } catch (e) {
            console.warn('Failed to delete user items:', e);
        }

        // Delete chatrooms where the user is seller or buyer
        try {
            const chatrooms = await tablesDB.listRows({
                databaseId: dbId,
                tableId: appwriteConfig.chatRoomTableId!,
                queries: [Query.or([
                    Query.equal('seller', [userId]),
                    Query.equal('buyer', [userId])
                ])]
            });
            for (const row of chatrooms.rows) {
                await tablesDB.deleteRow({ databaseId: dbId, tableId: appwriteConfig.chatRoomTableId!, rowId: row.$id });
            }
        } catch (e) {
            console.warn('Failed to delete chatrooms for user:', e);
        }

        // Delete messages sent by the user (best-effort)
        try {
            const messages = await tablesDB.listRows({
                databaseId: dbId,
                tableId: appwriteConfig.messagesTableId!,
                queries: [Query.equal('senderId', [userId])]
            });
            for (const row of messages.rows) {
                await tablesDB.deleteRow({ databaseId: dbId, tableId: appwriteConfig.messagesTableId!, rowId: row.$id });
            }
        } catch (e) {
            console.warn('Failed to delete messages for user:', e);
        }

        // Delete the user DB row
        try {
            await tablesDB.deleteRow({ databaseId: dbId, tableId: appwriteConfig.userTableId!, rowId: userId });
        } catch (e) {
            console.warn('Failed to delete user DB row:', e);
        }

        // Finally delete the Appwrite account for the current user. Most client SDKs
        // expose account.delete() for the current authenticated user.
        if (typeof (account as any).delete === 'function') {
            await (account as any).delete();
        } else if (typeof (account as any).deleteAccount === 'function') {
            await (account as any).deleteAccount();
        } else if (typeof (account as any).deleteIdentity === 'function') {
            // last-resort: if only deleteIdentity exists, try that
            await (account as any).deleteIdentity({ userId });
        } else {
            throw new Error('No supported account deletion method available on the SDK');
        }

        return true;
    } catch (error) {
        console.error('deleteAccount error:', error);
        return false;
    }
    finally {
        // Ensure user is logged out locally
        try {
            await logout();
        } catch (e) {
            // ignore
        }
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
    location,
    category,
    image,
    eventDate,
    startTime,
    endTime,
    showLocationDetails,
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
                location    ,
                category,
                image: uploadedImage,
                address: address,
                eventDate: eventDate.toISOString(),
                startTime: startTime?.toISOString(),
                endTime: endTime?.toISOString(),
                showLocationDetails,
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
export async function getItems({category, query, distance, userId}: {category?: string, query?: string, distance?: number, userId?: string}) {
    try {
        const queries: string[] = [];
        
        // Fixed: Use consistent field name
        if (category) queries.push(Query.equal("category", [category]));
        
        // Fixed: Search in title field instead of name\
        if (query) queries.push(Query.contains("title", query));
        
        if (userId) queries.push(Query.equal("user", [userId]));

        // Update query to include distance
        if (distance) {
            const userLocation = await Location.getCurrentPositionAsync({});
            const userLatitude = userLocation.coords.latitude;
            const userLongitude = userLocation.coords.longitude;
            if (!userLocation) return console.log("User location not found");
            const distanceInMeters = distance * 1609.34;
            queries.push(Query.distanceLessThan("location", [userLongitude, userLatitude], distanceInMeters, true));
        }

        console.log("Queries:", queries);
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
export async function deleteItem(itemId: string) {
    try {
        await tablesDB.deleteRow({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.itemsTableId!,
            rowId: itemId
        });
        return true;
    } catch (error) {
        console.log("Error deleting item:", error);
        return false;
    }
}
export async function createChatRoom({itemId, sellerId, buyerId}: {itemId: string, sellerId: string, buyerId: string}) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }
        //TODO: Check if chat room already exists
        const chatRoom = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId!,
            tableId: appwriteConfig.chatRoomTableId!,
            queries: [
                Query.equal("item", [itemId]),
                Query.equal("seller", [sellerId]),
                Query.equal("buyer", [buyerId])
            ]
        });
        if (chatRoom.rows.length > 0) {
            return chatRoom.rows[0].$id;
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


