import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import upload from '../../lib/upload'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

const ChatBox = () => {
  const {userData, messagesId, chatUser, messages, setMessages, chatVisible, setChatVisible} =  useContext(AppContext)
  const [input, setInput] = useState("")

  const sendMessage = async() => {
    try {
      if(input.trim() && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages : arrayUnion({
            sId : userData.id,
            text : input,
            createAt : new Date()
          })
        })

        const userIDs = [chatUser.rId, userData.id]

        userIDs.forEach(async(id) => {
          const userChatsRef = doc(db, "chats", id)
          const userChatsSnapShot = await getDoc(userChatsRef)

          if(userChatsSnapShot.exists()) {
            const userChatData = userChatsSnapShot.data()
            const chatIndex = userChatData.chatData.findIndex((c) => c.messageId === messagesId)
            
            userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.chatData[chatIndex].updatedAt = Date.now()
            
            if(userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false
            }
            
            await updateDoc(userChatsRef, {
              chatData : userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      toast.error("send msg chatbox")
    }
    setInput("")
  }

  const sendImage = async(e) => {
    try {
      const fileUrl = await upload(e.target.files[0])
      if(fileUrl && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages : arrayUnion({
            sId : userData.id,
            image : fileUrl,
            createAt : new Date()
          })
        })

        const userIDs = [chatUser?.rId, userData.id]

        userIDs.forEach(async(id) => {
          const userChatsRef = doc(db, "chats", id)
          const userChatsSnapShot = await getDoc(userChatsRef)

          if(userChatsSnapShot.exists()) {
            const userChatData = userChatsSnapShot.data()
            const chatIndex = (userChatData.chatData.findIndex((c) => c.messageId === messagesId)) 
            
            userChatData.chatData[chatIndex].lastMessage = "Image"
            userChatData.chatData[chatIndex].updatedAt = Date.now()
            
            if(userChatData.chatData[chatIndex].rId === userData.id) {
              userChatData.chatData[chatIndex].messageSeen = false
            }
            
            await updateDoc(userChatsRef, {
              chatData : userChatData.chatData
            })
          }
        })
      }
    } catch (error) {
      toast.error("send message send image")
    }
  }

  const convertTimeStamp = (timeStamp) => {
    let date = timeStamp.toDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    if(hour > 12) {
      return hour - 12 + ":" + minute + " PM"
    }
    else {
      return hour + ":" + minute + " AM"
    }
  }

  useEffect(() => {
    if(messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        const newMessages = res.data()?.messages || []
        setMessages([...newMessages].reverse())      
      })
      return () => {
        unSub()
      }
    }
  }, [messagesId])

  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={assets.avatar_icon} alt="" />
        <p>
          {chatUser.userData.name} 
          {Date.now() - chatUser.userData.lastSeen <= 70000 ? (
          <img className='dot' src={assets.green_dot} alt=""/>
          )
          : null
          }
        </p>
        <img src={assets.help_icon} className='help' alt="" />
        <img onClick={() => setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
      </div>

      <div className='chat-msg'>
        {messages.map((msg, index) => (
          <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg["image"]
             ? <img className='msg-img' src={msg.image} alt="" />
             :<p className='msg'>{msg.text}</p>
            }
            <div>
              <img src={assets.avatar_icon} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder='Send a message'/>
        <input onChange={sendImage} type="file" id='image' accept='image/png, image.jpeg' hidden/>
        <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
      </div>
  )
  : <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
    <img src={assets.logo_icon} alt="" />
    <p>Chat anything anywhere</p>
    </div>
    
}


export default ChatBox
