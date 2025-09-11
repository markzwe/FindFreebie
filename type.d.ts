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

export interface Item extends Models.Row {
    title: string;
    description?: string;
    location: CoordinatesType; // Changed to string to match CreateItemData
    categories: string;
    image: string;
    eventDate: string | Date; // Allow both string (from DB) and Date (processed)
    startTime?: string | Date;
    endTime?: string | Date;
}

export interface CoordinatesType {
    coordinates: {
        latitude: number;
        longitude: number;
    }
}

export interface AddressType {
    name: string;
    postalCode: string;
}

export interface CreateItemData {
    title: string;
    description?: string;
    location: CoordinatesType;
    category: string;
    image: string;
    eventDate: Date;
    startTime?: Date;
    endTime?: Date;
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
    item: string;
    buyer: string;
    seller: string;
    messages: string[];
    
    
}
interface Message extends Models.Row {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    content: string;
    senderId: string;
    chatroomId: string;
    createdAt: string;
}