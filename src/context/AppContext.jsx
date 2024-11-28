import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [chatsData, setChatsData] = useState(null)
    
    const [messagesId, setMessagesId] = useState(null)
    const [messages, setMessages] = useState([])
    
    const [chatUser, setChatUser] = useState(null)
    const [chatVisible, setChatVisible] = useState(false)

    const loadUserData = async(uid) => {
        try {
            const userRef = doc(db, "users", uid)
            const userSnap = await getDoc(userRef)
            const userData = userSnap.data()
            setUserData(userData)
            if(userData.name || userData.avatar) {
                navigate('/chat')
            }
            else {
                navigate('/profile')
            }
            await updateDoc(userRef, {
                lastSeen : Date.now()
            })
            setInterval(async() => {
                if(auth.chatUser) {
                    await updateDoc(userRef, {
                        lastSeen : Date.now()
                    })
                }
            }, 60000)
        } catch (error) {
            toast.error("Error from AppContext")
        }
    }

    useEffect(() => {
        if(userData) {
            const chatRef = doc(db, "chats", userData.id)
            const unSub = onSnapshot(chatRef, async(res) => {
                const chatItems = res.data().chatsData                
                const tempData = []
                for(const item of chatItems) {
                    const userRef = doc(db, "users", item.rId)
                    const userSnap = await getDoc(userRef)
                    const userData = userSnap.data()
                    tempData.push({...item, userData})
                }
                setChatsData(tempData.sort((a, b) => b.updatedAt - a.updatedAt))
            })
            return () => {
                unSub()
            }
        }
    }, [userData])

    const value = {
        userData, setUserData,
        chatsData, setChatsData,
        loadUserData,
        messages, setMessages,
        messagesId, setMessagesId,
        chatUser, setChatUser,
        chatVisible, setChatVisible
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


export default AppContextProvider
