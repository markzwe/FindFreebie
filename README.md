🪁 Windsurf Prompt – Freely App
📖 Project Overview

Freely is a mobile app where users can discover and share free food and items nearby.
Target audience: Gen Z, students, and the public.
Goal: Help people save money, reduce waste, and build community.

🛠️ Tech Stack

Frontend: React Native (Expo)

Backend: Appwrite (Database, Auth, Storage, Realtime, Functions)

Auth: Appwrite Auth (Google + Apple sign-in)

Storage: Appwrite Storage (freebie photos)

Realtime: Appwrite subscriptions for feed + chat updates

Push Notifications: Appwrite Functions + Expo Notifications

📂 Appwrite Collections
users

name (string)

avatar_url (string)

joined_at (datetime)

freebies

user_id (relation → users)

title (string)

category (enum: food, item)

photo_id (string, storage file id)

location (string/GeoJSON)

created_at (datetime)

expires_at (datetime, optional)

claims

freebie_id (relation → freebies)

claimer_id (relation → users)

status (enum: pending, accepted, taken)

created_at (datetime)

messages

claim_id (relation → claims)

sender_id (relation → users)

text (string)

created_at (datetime)

🎯 Core Features

Feed: list of nearby freebies (with category filters).

Map View: freebies shown on a map.

Post Freebie: photo + title + category + location.

Claim & Chat: users can claim freebies and chat with poster.

Realtime Updates: new posts and messages appear instantly.

Push Notifications: new nearby freebies and claim status updates.

🚀 Windsurf Goals

When writing or refactoring code in this repo, please:

Use clean, modular React Native components.

Follow best practices for Appwrite SDK integration.

Ensure reusable hooks for data fetching and realtime subscriptions.

Keep code production-ready, easy to scale, and simple for a solo dev.

Document any assumptions directly in comments.

📌 Roadmap (MVP First)

✅ Auth (Google/Apple via Appwrite).

✅ Post Freebies (with photo + location).

✅ Feed (list + filter).

🔜 Map View.

🔜 Claim + Chat (with Appwrite Realtime).

🔜 Notifications (Appwrite Functions + Expo)# FindFreebie
