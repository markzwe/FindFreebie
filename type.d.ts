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

export interface Category{
    $id: string;
    name: string;
}

export interface Item extends Models.Document {
    title: string;
    description?: string;
    location : ip;
    categories: string;
    image: string;
}

export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
}
 interface DateTimePickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    date: Date;
    onDateChange: (date: Date) => void;
}
interface DescriptionModalProps {
    isVisible: boolean;
    onClose: () => void;
    description: string;
    setDescription: (description: string) => void;
    isSharing: boolean;
}
    