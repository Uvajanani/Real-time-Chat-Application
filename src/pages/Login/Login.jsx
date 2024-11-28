import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login, resetPassword } from '../../config/firebase'

const Login = () => {

  const [curState, setcurState] = useState("Sign Up")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if(curState === "Sign Up") {
      signup(userName, email, password)
    }
    else {
      login(email, password)
    }
  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className="logo" />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{curState}</h2>
        
        {curState == "Sign Up" ? <input onChange={(e) => setUserName(e.target.value)} value={userName} type="text" placeholder='Username' className="form-input" required/> : null}
        <input onChange={(e) => setEmail(e.target.value)} value={email}  type="email" placeholder='Email Address' className="form-input" required/>
        <input onChange={(e) => setPassword(e.target.value)} value={password}  type="password" placeholder='Password' className="form-input" required/>
        <button type='submit'>{curState === "Sign Up" ? "Create Account" : "Login"}</button>
        
        <div className="login-term">
          <input type="checkbox" required/>
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        
        <div className="login-forgot">
          {
            curState === "Sign Up"
            ? <p className="login-toggle">Already have an account? <span onClick={() => setcurState("Login")}>Login here</span></p>
            : <p className="login-toggle">Create an account? <span onClick={() => setcurState("Sign Up")}>Click here</span></p> 
          }
          {curState === "Login" ? <p className="login-toggle">Forgot Password? <span onClick={() => resetPassword(email)}>Rest here</span></p> : null}
        </div>
      </form>
    </div>
  )
}

export default Login
