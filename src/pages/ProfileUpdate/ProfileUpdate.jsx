import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileUpdate.css'
import { auth, db } from '../../config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import assets from '../../assets/assets'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import upload from '../../lib/upload.js'
import { AppContext } from '../../context/AppContext.jsx'

const ProfileUpdate = () => {

  const navigate = useNavigate()

  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [uid, setUid] = useState("")
  const [prevImage, setPrevImage] = useState("")
  const {setUserData} = useContext(AppContext)

  const profileUpdate = async(event) => {
      event.preventDefault()
      try{
        const docRef = doc(db, "users", uid)
        if(image) {
          const imgUrl = await upload(image)
          setPrevImage(imgUrl)
          await updateDoc(docRef, {
            avatar : imgUrl,
            bio : bio,
            name : name
          })
          toast.success("Profile Updated successfully")
        }
        else {
          await updateDoc(docRef, {
            bio : bio,
            name : name
          })
          toast.success("Updated successfully")
        }
        const snap = await getDoc(docRef)
        setUserData(snap.data())
        navigate('/chat')
      } catch(error) {
        console.error(error)
        toast.error(error.message)
      }
  }

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, async(user) => {
      if(user) {
        setUid(user.uid)
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if(docSnap.data().name) {
          setName(docSnap.data().name)
        }
        if(docSnap.data().bio) {
          setBio(docSnap.data().bio)
        }
        if(docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar)
        }
      }
      else {
        toast.error(error.message)
      }
    })
    return() => unsubsribe()
  }, [])

  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor="avatar">
            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png .jpg, .jpeg' hidden/>
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Upload Profile Image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Your Name' required/>
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write Profile Bio' required></textarea>
          <button type='submit'>Save</button>
        </form>
        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}


export default ProfileUpdate 