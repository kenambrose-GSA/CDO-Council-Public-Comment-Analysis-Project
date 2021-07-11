import React, {useState} from 'react'
import SignIn from "./SignIn"
import SignUp from "./SignUp"

export default function LoggedOut() {
  const [form, setForm] = useState('SignIn')
  
  function changeform(){
    if(form == "SignIn") {
      setForm('SignUp')
    } else {
      setForm('SignIn')
    }
  }

  return (
    form == 'SignIn' ?
    <SignIn signup={changeform}/> :
    <SignUp signup={changeform} />
  )
}
