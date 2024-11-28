import { initializeApp } from "firebase/app";
import {toast} from "react-toastify"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPPS5CrbLgBDvr10HjxCogJtcEJdlojsc",
  authDomain: "chat-app-uva-demo-project.firebaseapp.com",
  projectId: "chat-app-uva-demo-project",
  storageBucket: "chat-app-uva-demo-project.firebasestorage.app",
  messagingSenderId: "1006609456492",
  appId: "1:1006609456492:web:ada2c8d9f17c60d111a749"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signup = async(username, email, password) => {
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const user = res.user
      await setDoc(doc(db, "users", user.uid), {
        id : user.uid,
        username : username.toLowerCase(),
        email,
        name : "",
        avatar : "",
        bio : "Hey, There I am using Chat App",
        lastSeen : Date.now()
      })
      await setDoc(doc(db, "chats", user.uid), {
        chatsData : []
      })
      toast.success("User created successfully")
    }
    catch(error){
      console.log(error)
      toast.error(error.code.split("/")[1].split("-").join(" ")) 
    }
}

const login = async(email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email,password)
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" ")) 
  }
}

const logout = async() => {
  try {
    await signOut(auth)
  } catch(error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" ")) 
  }
}

const resetPassword = async(email) => {
  if(!email) {
    toast.error("Enter your email")
    return null
  }
  try {
    const userRef = collection(db, "users")
    const q = query(userRef, where("email", "==", email))
    const querySnap = await getDocs(q)
    if(!querySnap.empty) {
      await sendPasswordResetEmail(auth, email)
      toast.success("Reset Email Sent")
    }
    else {
      toast.error("Email doesn't exist")
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

export {signup, login, logout, auth, db, resetPassword}

