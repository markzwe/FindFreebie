import { Account, Avatars, Client, Databases, ID, OAuthProvider, Query, Storage, TablesDB, Functions } from "react-native-appwrite";

import { Chatroom, ChatroomResponse, Item, MessageResponse } from "@/type";
import { makeRedirectUri } from 'expo-auth-session';
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
export const functions = new Functions(client);

export async function login() {
    const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
    const scheme = `${deepLink.protocol}//`;
    try {
        // Remove MFA authenticator if it exists
        try {
        await account.deleteIdentity({identityId: "google"});
        } catch (error) {
            // Ignore if no MFA is set up
            console.log('No MFA to remove');
        }
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
    finally {
        WebBrowser.dismissAuthSession();
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

/**
 * Deletes all records associated with a user and their account
 * @param userId - The ID of the user to delete
 * @returns Promise<boolean> - True if deletion was successful, false otherwise
 */
export async function deleteAccount(userId: string): Promise<boolean> {
    if (!userId) {
        console.error('User ID is required');
        return false;
    }
    console.log("Deleting account for user:", userId)
    
    const dbId = appwriteConfig.databaseId;
    if (!dbId) {
        console.error('Database ID is not configured');
        return false;
    }
    
    try {
        // Get the account user ID (different from database user ID)
        const accountUser = await getCurrentUser();
        console.log("Account user:", accountUser?.$id);
        if (!accountUser) {
            console.error('No authenticated user found');
            return false;
        }

        // First, delete the Appwrite account
        // This is done first to prevent any further operations if account deletion fails
        await deleteAppwriteAccount(accountUser.$id);
        console.log("Appwrite account deletion initiated");
        
        // Then clean up user data (these will run in parallel)
        console.log("Starting cleanup of user data...");
        const cleanupPromises = [
            // Delete user's items
            deleteUserRecords({
                tableId: appwriteConfig.itemsTableId!,
                field: 'user',
                value: userId,
                errorMessage: 'user items'
            }),
            
            // Delete user's chatrooms (as seller or buyer)
            deleteUserRecords({
                tableId: appwriteConfig.chatRoomTableId!,
                queries: [
                    Query.or([
                        Query.equal('seller', [userId]),
                        Query.equal('buyer', [userId])
                    ])
                ],
                errorMessage: 'chatrooms'
            }),
            
            // Delete user's messages
            deleteUserRecords({
                tableId: appwriteConfig.messagesTableId!,
                field: 'senderId',
                value: userId,
                errorMessage: 'messages'
            }),
            
            // Delete user's profile from database
            deleteUserRecords({
                tableId: appwriteConfig.userTableId!,
                rowId: userId,
                errorMessage: 'user profile'
            })
        ];

        // Wait for all cleanup operations to complete
        await Promise.all(cleanupPromises);
        
        return true;
    } catch (error) {
        console.error('Failed to delete account:', error);
        return false;
    } finally {
        // Always ensure user is logged out, even if there was an error
        try {
            await logout();
        } catch (e) {
            console.warn('Error during logout after account deletion:', e);
        }
    }
}


interface DeleteRecordsOptions {
    tableId: string;
    field?: string;
    value?: string | string[];
    queries?: any[];
    rowId?: string;
    errorMessage: string;
}

/**
 * Helper function to delete records from a table
*/
async function deleteUserRecords({
    tableId,
    field,
    value,
    queries = [],
    rowId,
    errorMessage
}: DeleteRecordsOptions): Promise<void> {
    const dbId = appwriteConfig.databaseId!;
    
    try {
        if (rowId) {
            // Direct deletion if rowId is provided
            await tablesDB.deleteRow({ databaseId: dbId, tableId, rowId });
        } else if (field && value) {
            // Query and delete multiple rows
            const query = [Query.equal(field, Array.isArray(value) ? value : [value]), ...queries];
            const { rows } = await tablesDB.listRows({
                databaseId: dbId,
                tableId,
                queries: query
            });
            
            await Promise.all(
                rows.map(row => 
                    tablesDB.deleteRow({ databaseId: dbId, tableId, rowId: row.$id })
                )
            );
        } else if (queries.length > 0) {
            // Handle custom queries
            const { rows } = await tablesDB.listRows({
                databaseId: dbId,
                tableId,
                queries
            });
            
            await Promise.all(
                rows.map(row => 
                    tablesDB.deleteRow({ databaseId: dbId, tableId, rowId: row.$id })
                )
            );
        }
    } catch (error) {
        console.warn(`Failed to delete ${errorMessage}:`, error);
        // Continue with account deletion even if some cleanup fails
    }
}
/**
 * Helper function to delete the Appwrite account using client-side SDK
 */
async function deleteAppwriteAccount(accountUserId: string): Promise<void> {
    try {
        if (!accountUserId) {
            throw new Error('Account user ID is required');
        }

        const execution = await functions.createExecution({
            functionId: '68fcd8ec0005486ac461', // Replace with your actual Function ID
            body: JSON.stringify({ userId: accountUserId }), // Changed from payload to body
            async: false
        });
        if (execution.status === 'completed') {
            const response = JSON.parse(execution.responseBody);
            console.log("Function success:", response);
        } else {
            console.error("Function failed:", execution.responseBody);
            // Just log the failure, don't throw an error
        }
    } catch (error) {
        console.error('❌ Error deleting user account:', error);
        throw error;
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


