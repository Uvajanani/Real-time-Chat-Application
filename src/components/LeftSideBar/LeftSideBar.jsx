import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../config/firebase'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { AppContext } from '../../context/AppContext'

const LeftSideBar = () => {
  const navigate = useNavigate()
  const {userData, chatsData, chatUser, setChatUser, messagesId, setMessagesId, chatVisible, setChatVisible} = useContext(AppContext)
  const [user, setUser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const inputHandler = async(e) => {
    try {
      const input = e.target.value
      if(input) {
        setShowSearch(true)
        const userRef = collection(db, "users")
        const q = query(userRef, where("username", "==", input.toLowerCase()))
        const querySnap = await getDocs(q)
        
        if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false
          chatsData.map((user) => {
            if(user.rId === querySnap.docs[0].data().id) {
              userExist = true
            }
          })
          if(!userExist) {
            setUser(querySnap.docs[0].data())
          }
        }
        else {
          setUser(null)
        }
      }
      else {
        setShowSearch(false)
      }
    } catch (error) {
      toast.error("input handler")
    }
  }

  const addChat = async() => {
    const messagesRef = collection(db, "messages")
    const chatsRef = collection(db, "chats")
    try {
      const newMessageRef = doc(messagesRef)
      
      await setDoc(newMessageRef, {
        createAt : serverTimestamp(),
        messages : []
      })
      
      await updateDoc(doc(chatsRef, user.id), {
        chatData : arrayUnion({
          messageId : newMessageRef.id,
          lastMessage : "",
          rId : userData.id,
          updatedAt : Date.now(),
          messageSeen : true

        })
      })

      await updateDoc(doc(chatsRef, userData.id), {
        chatData : arrayUnion({
          messageId : newMessageRef.id,
          lastMessage : "",
          rId : user.id,
          updatedAt : Date.now(),
          messageSeen : true

        })
      })
      const uSnap = await getDoc(doc(db, "users", user.id))
      const uData = uSnap.data()
      setChat({
        messagesId : newMessageRef.id,
        lastMessage : "",
        rId : user.id,
        updatedAt : Date.now(),
        messageSeen : true,
      })

      setShowSearch(false)
      setChatVisible(true)
    } 
    catch (error) {
      toast.error("add chat")
      console.log(error)
    }
  }

  const setChat = async(item) => {
    try {
      setMessagesId(item.messageId)
      setChatUser(item)
      
      const userChatsRef = doc(db, "chats", userData.id)
      const userChatsSnapShot = await getDoc(userChatsRef)
      const userChatsData = userChatsSnapShot.data()
      const chatIndex = userChatsData.chatData.findIndex((c) => c.messageId === item.messageId)
      userChatsData.chatData[chatIndex].messageSeen = true
      
      await updateDoc(userChatsRef, {
        chatData : userChatsData.chatData
      })
      setChatVisible(true)
    } catch (error) {
      toast.error("set chat")
    }
    
  }

  useEffect(() => {
    const updateChatUserData = async() => {
      if(chatUser) {
        const userRef = doc(db, "users", chatUser.userData.id)
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data()
        setChatUser(prev => ({...prev, userData : userData}))
      }
    }
    updateChatUserData()
  }, [chatsData])

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className="ls-top">
        <div className="ls-nav">
            <img src={assets.logo} className='logo' alt="" />
            <div className="menu">
                <img src={assets.menu_icon} alt="" />
                <div className="sub-menu">
                  <p onClick={() => navigate('/profile')}>Edit Profile</p>
                  <hr />
                  <p>Logout</p>
                </div>
            </div>
        </div>
    
        <div className="ls-search">
            <img src={assets.search_icon} alt="" />
            <input onChange={inputHandler} type="text" placeholder='Search Here'/>
        </div>
      </div>
      
      <div className="ls-list">
        {showSearch && user
        ? <div onClick={addChat} className='friends add-user'>
            <img src={assets.avatar_icon} alt="" />
            <p>{user.name}</p>
        </div>
        : Array.isArray(chatsData) && chatsData.length > 0
        ? chatsData.map((item, index) => (
            <div onClick={() => setChat(item)} key = {index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
              <img src={assets.avatar_icon} alt="" />
              <div>
                <p>{item?.userData?.name || "Unknown User"}</p>
                <span>{item?.lastMessage || ""}</span>
              </div>
            </div>
          ))
        : <p></p>
        }
      </div>
    </div>
  )
}


export default LeftSideBar
