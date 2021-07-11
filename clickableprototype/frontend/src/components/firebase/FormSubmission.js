import React, {useState} from 'react'
import firebase from './firebase'

export default function FormSubmission({user, collection}) {
  const [inputString, setInputString] = useState('')

  function onsubmit(e) {
    e.preventDefault()
    const {serverTimestamp} = firebase.firestore.FieldValue;
    

    collection.add({
      uid: user.uid,  
      randomString: inputString,
      createdAt: serverTimestamp()
    })
  }

  function oninputchange(e, f){
    let fun = eval(f)
    fun(e.target.value)
  }

  return (
    <section>
      <form onSubmit={onsubmit}>
        <fieldset>
          <legend>Enter String:</legend>
          <label for="randomString">Enter Random String</label><br/>
          <input type="text"
                 name="randomString" 
                 id="randomString"
                 value={inputString}
                 onChange={(e) => {oninputchange(e, 'setInputString')}}/><br/><br/>
          <button type="submit">enter</button>
        </fieldset>
      </form>
    </section>
  )
}
