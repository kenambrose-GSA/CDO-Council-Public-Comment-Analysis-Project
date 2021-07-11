import React, {useState, useEffect} from 'react'
import {auth} from './firebase'

export default function SignIn({signup}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onsubmit(e){
    e.preventDefault()

    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log(userCredential, 'userCred')

      })
      .catch(err => alert(err))
  }

  function oninputchange(e, f){
    let fun = eval(f)
    fun(e.target.value)
  }

  return (
    <section style={{ marginLeft: "160px" }}>
      
      <form onSubmit={onsubmit}>
        <fieldset>
          <legend className="smallTitle">Login:</legend>

          <label 
          for="email"
          className="smallText">
            Enter your Email:
          </label><br/>
          <input type="text"
                name="email" 
                id="email"
                onChange={(e) => {oninputchange(e, 'setEmail')}}/><br/><br/>
          
          <label 
          for="pword"
          className="smallText">
            Enter your Password:
          </label><br/>
          <input type="password" 
                name="pword" 
                id="pword"
                onChange={(e) => {oninputchange(e, 'setPassword')}}/><br/><br/> 
          
          <button 
          id="signInBtn"
          className="buttons">
            Sign in with email
            </button>

        </fieldset>
      </form>  
      <p className="smallerText">Not a member? <a href="#" onClick={signup}>Signup here</a></p>
    </section>
  )
}
