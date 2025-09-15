import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
    accountId: string;
    name: string;
    email: string;
    avatar: string;
}

export interface AppwriteUser extends Models.User<Models.Preferences> {
    $id: string;
    name: string;
    email: string;
}

export interface Category {
    $id: string;
    name: string;
}

// This interface represents a complete item from the database
export interface AppwriteListResponse<T> {
    total: number;
    documents: T[];
}

export interface Item {
    title: string;
    $id: string;
    description?: string;
    category: string;
    image: string;
    eventDate: Date;
    startTime?: Date;
    latitude?: float;
    longitude?: float;
    endTime?: Date;
    address: string;
    user: string; // User ID of the item creator
}

export interface CoordinatesType {
    coordinates: {
        latitude: float;
        longitude: float;
    }
}

export interface AddressType {
    name: string;
    postalCode: string;
}


interface DateTimePickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    currentDate: Date;
    startTime: Date;
    endTime: Date;
    showTimePicker: boolean;
    setShowTimePicker: (showTimePicker: boolean) => void;
    onDateChange: (date: Date) => void;
    onStartTimeChange: (time: Date) => void;
    onEndTimeChange: (time: Date) => void;
}

interface DescriptionModalProps {
    isVisible: boolean;
    onClose: () => void;
    description: string;
    setDescription: (description: string) => void;
    isSharing: boolean;
}
interface ItemViewDetailModalProps {
    item: CreateItemData;
    isVisible: boolean;
    onClose: () => void;
}

interface Chatroom extends Models.Row{
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    item: string;
    buyer: string;
    seller: string;
    messages: string;
    
}
interface ChatroomResponse {
    rows: Chatroom[];
    total: number;
}

export interface Message extends Models.Document {
  $id: string;
  content: string;
  senderId: string;
  chatroomId: string;
  $createdAt: string;
  $updatedAt: string;
  $databaseId?: string;
  $permissions?: string[];
  $sequence?: number;
  $tableId?: string;
}

export interface MessageResponse {
    rows: Message[];
    total: number;
}
