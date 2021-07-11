import React, {useState, useEffect} from 'react'
import NavBar from '../infrastructure/NavBar/NavBar'
import { Container } from 'react-bootstrap'

import firebase, {auth} from './firebase'
// import FormSubmission from "./FormSubmission"
import LoggedOut from './LoggedOut'
import axios from 'axios';
import Comments from "../comments/Comments"
import VizPage from "../visualizations/VizPage"
import Messages from "../user/Messages"

let api = "http://127.0.0.1:8080"

export default function FirebaseLogic({ msgRef, setMsgRef, setModalData, setShowModal, showModal, setSme, user, setUser }) {  
  const [rules, setRules] = useState([])
  const [topics, setTopics] = useState({})

  const [page, changePage] = useState("Home")
  const [subjects, setSubjects] = useState([])
  const [messages, setMessages] = useState([])
  // const [smeList, setSme] = useState([])
  // const [msgRef, setMsgRef] = useState({})
  const [smeRef, setSmeRef] = useState({})

  useEffect(()=>{
    if (subjects.length === 0) {
      axios
        .get(`${api}/subjects`)
        .then(res => {
          setSubjects(res.data)
        })

      axios
        .get(`${api}/all_dockets`)
        .then(res => {
          console.log('res', res.data)
          setTopics(res.data)
        })
    }
  }, [subjects])


  function selectPage(pg){
    if(pg == "Login") return(<LoggedOut />)
    if(pg == 'Comments') return(<Comments user={user} subjects={subjects} rules={rules}/>)
    if(pg == 'Visualization') return (<VizPage topics={topics.topics} dockets={topics.dockets} setShowModal={setShowModal} setModalData={setModalData} />)
    if(pg == 'User' && user) return(<div><h1 className="title">User: {user.email}</h1><p className="smallTitle"><b>uid: </b>{user.uid}</p></div>)
    if(pg == 'Messages') return(<Messages user={user} messages={messages} msgRef={msgRef} setMessages={setMessages}/>)
    return(<div><h1>{pg}</h1></div>)
  }

  let loggedOutButtons = [
    {text: "Home", action: (x) => {changePage("Home")}},
    {text: "About", action: (x) => {changePage('About')}},
    {text: "Login", action: (x) => { changePage('Login')}},
    {text: "Modal", action: (x) => { setShowModal(true); 
      setModalData({
      template: "Basic",
      header: "About",
      body: "Body",
      actionText: "action",
      action: () => {alert("action")}}) }},
  ]

  let loggedInButtons = [
    {text: "Home", action: (x) => {changePage("Home")}},
    {text: "About", action: (x) => {changePage('About')}},
    {text: "User", action: (x) => { changePage('User')}},
    {text: "Comments", action:(x)=>{changePage("Comments")}},
    {text: "Visualization", action: (x) => {changePage("Visualization")}},
    {text: "Messages", action: (x)=>{changePage("Messages")}},
    {text: "Logout", action: (x)=> {auth.signOut()} },
    {text: "Modal", action: (x) => { setShowModal(true); 
      setModalData({
      template: "Basic",
      header: "About",
      body: "Body",
      actionText: "action",
      action: () => {alert("action")}}) }}
  ]

  const [buttons, setButtons] = useState(loggedOutButtons) 


  useEffect(()=>{
    auth.onAuthStateChanged((user) => {
      const db = firebase.firestore();
      // let unsubscribeMsg;
      let unsubscribeSme;

      if (user) {
        axios.get(`${api}/rules`)
          .then(res => {
            setRules(res.data)
            setUser(user );

            setButtons(loggedInButtons)
            changePage('User')

          })

        setMsgRef( db.collection('smeMessages'))
        setSmeRef(db.collection('SMEList'))

        console.log('smeref', typeof smeRef)


        unsubscribeSme = smeRef
          .onSnapshot(ss => {
            let sme = ss.docs.map(x => x.data())
            setSme(sme)
          })

      } else {
        setUser(null)
        setMessages([])
        setButtons(loggedOutButtons)
        changePage('Login')
        // unsubscribeMsg && unsubscribeMsg()
        unsubscribeSme && unsubscribeSme()
      }
    });
  }, [user])  
  

  return (
    <Container>
      <div className="nav">
        <NavBar  menuList={buttons}/>
      </div>
      {/* <Messages usr={user} setMessages={setMessages} /> */}
      <br/>
      <br/>
        {
          selectPage(page)
        }
 
      {/* {
      user ?
      <LoggedIn user={user} rules={rules}/> :
        
      } */}
    
    </Container>
  )
}
