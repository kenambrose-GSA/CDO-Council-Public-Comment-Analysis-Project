import React, {useState, useEffect} from 'react'
import {auth} from './firebase'

export default function SignIn({signup}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onsubmit(e){
    e.preventDefault()

    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        alert('successfully added yourself')
      })
      .catch(err => alert(err))
  }

  function oninputchange(e, f){
    let fun = eval(f)
    fun(e.target.value)
  }

  return (
    <section>
      <form onSubmit={onsubmit}>
        <fieldset>
          <legend>Sign Up:</legend>

          <label for="email">Your Email</label><br/>
          <input type="text"
                name="email" 
                id="email"
                onChange={(e) => {oninputchange(e, 'setEmail')}}/><br/><br/>
          
          <label for="pword">Your Password</label><br/>
          <input type="password" 
                name="pword" 
                id="pword"
                onChange={(e) => {oninputchange(e, 'setPassword')}}/><br/><br/> 
          
          <button>Sign Up!</button>

        </fieldset>
      </form>  
      <p>Already a member? <a href="#" onClick={signup}>Log in here</a></p>
    </section>
  )
}
