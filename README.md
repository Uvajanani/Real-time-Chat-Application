# 💬 Real-Time Chat Application

A modern real-time chat app where users can connect, chat, share media, and customize their profiles. Built with React and Firebase, it features smooth authentication, emoji support, user search, and media storage.

---

## 🚀 Features

### 🗨️ Core Chat Functionality
- **Real-Time Messaging:** Instantly send and receive messages with live updates.
- **Emoji Support:** Send emojis to express yourself.
- **Media Sharing:** Share images in chat. Images are stored securely in Firebase Storage.
- **User Search:** Search and start chatting with other registered users.
- **Chat History:** View recent chats and conversations.

### 👤 User Profile
- **Edit Profile:** Update your profile picture, display name, and "about" section.
- **User Avatars:** Profile images visible in chat and user lists.

### 🔐 Authentication
- **Sign Up / Login / Logout:** Secure authentication using Firebase Auth.
- **User Sessions:** Persistent login across sessions.

---

## 🧰 Tech Stack

### Frontend
- **React.js** – For building the user interface
- **Firebase Auth** – User authentication and session handling
- **Firebase Firestore** – Real-time database for chats
- **Firebase Storage** – Store and retrieve shared media (images)

---



## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
    git clone https://github.com/Uvajanani/Real-time-Chat-Application.git
    cd chatsphere

Install Dependencies
bash
Copy
Edit
npm install
3. Configure Firebase
Create a firebase.js file inside /src and add your Firebase config:

javascript
Copy
Edit
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
4. Start the Development Server
bash
Copy
Edit
npm start
📸 Screenshots
Add screenshots of:

Chat screen

Media sharing

Profile editor

Search functionality

🧑‍💻 Author
Your Name

GitHub

LinkedIn
