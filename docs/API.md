# API Documentation

This document describes the backend API integration and data models used in the FindFreebie application.

## Appwrite Integration

### Configuration

```typescript
// lib/appwrite.ts
import { Client, Account, Databases, Storage, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('YOUR_APPWRITE_ENDPOINT')
  .setProject('YOUR_PROJECT_ID');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };
```

## Data Models

### User
```typescript
interface User {
  $id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Item
```typescript
interface Item {
  $id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  userId: string;
  status: 'available' | 'reserved' | 'taken';
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Authentication

#### Sign In
- **Endpoint**: `POST /v1/account/sessions/oauth2/google`
- **Description**: Authenticate user with Google OAuth
- **Response**: User session and profile data

#### Sign Out
- **Endpoint**: `DELETE /v1/account/sessions/current`
- **Description**: End current user session

### Items

#### List Items
- **Endpoint**: `GET /v1/databases/items`
- **Query Params**: 
  - `filters`: Array of filter conditions
  - `limit`: Number of items to return
  - `offset`: Pagination offset
- **Response**: Array of `Item` objects

#### Create Item
- **Endpoint**: `POST /v1/databases/items`
- **Body**: `Item` object (without ID and timestamps)
- **Response**: Created `Item` object

#### Get Item
- **Endpoint**: `GET /v1/databases/items/{itemId}`
- **Response**: Single `Item` object

### Storage

#### Upload Image
- **Endpoint**: `POST /v1/storage/files`
- **Body**: FormData with image file
- **Response**: File metadata including URL

## Realtime Updates

Subscribe to realtime updates using Appwrite's subscription system:

```typescript
import { databases } from '../lib/appwrite';

// Subscribe to item updates
const unsubscribe = databases.client.subscribe(
  'databases.items.documents',
  response => {
    // Handle realtime update
  }
);

// Cleanup
unsubscribe();
```

## Error Handling

All API calls should be wrapped in try/catch blocks:

```typescript
try {
  const response = await databases.getDocument('items', itemId);
  return response;
} catch (error) {
  console.error('Error fetching item:', error);
  throw error;
}
```

## Rate Limiting

- Authentication endpoints: 10 requests per minute
- Item creation: 5 requests per minute
- All other endpoints: 60 requests per minute

## Response Format

Successful responses follow this format:
```json
{
  "success": true,
  "data": {},
  "timestamp": "2023-04-01T12:00:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  },
  "timestamp": "2023-04-01T12:00:00Z"
}
```

## Webhooks

The following webhooks are available for external integrations:

1. `item.created` - Triggered when a new item is created
2. `item.updated` - Triggered when an item is updated
3. `item.deleted` - Triggered when an item is deleted

## Testing

API endpoints can be tested using the Appwrite console or tools like Postman. Make sure to:
1. Set the correct project ID
2. Include authentication headers for protected endpoints
3. Follow the rate limits
