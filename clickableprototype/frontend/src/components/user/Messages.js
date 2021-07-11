import React, {useRef, useEffect, useState} from 'react'
import firebase from "../firebase/firebase"
import CommentTable from "./CommentTable"
export default function Messages({messages, user, msgRef, setMessages}) {
  const [msg, setMsg] = useState([])
  const [chat, setChat] = useState([])
  const msgInput = useRef(null)
  const [counter, setCounter] = useState(0)
  const [otherFocus, setOther] = useState("")

  useEffect(() => {
    const unsubscribeMsg = msgRef
      .orderBy('time')
      .onSnapshot(ss => {
        let msg = ss.docs.map(x => x.data()).filter(x => x.to == user.uid || x.from == user.uid)
        console.log('msg', msg)

        let tmp = [...msg];
        tmp.forEach(x => {
          x.other = x.from;
    
          if(x.from == user.uid) {
            x.other = x.to
          }
        })
    
        let others = [...new Set(tmp.map(x => x.other))]
          .map(x => {return{other: x, msg: tmp.filter(y => y.other == x)}})
        console.log('others', others)
        setMsg(others)
        if(otherFocus) {setChat(others.filter(x => x.other == otherFocus)[0].msg)}
      })

    return () => {
      unsubscribeMsg()
    }
  }, [counter])


  const onsend = (other) => {
    const {serverTimestamp} = firebase.firestore.FieldValue;

    msgRef.add({
      to: other,
      from: user.uid,
      message: msgInput.current.value,
      time: serverTimestamp(),
      subject: ""
    })

    setCounter(counter+1)
    msgInput.current.value = "";
  }

  return (
    <div style={{position: 'fixed', width: "90%", height: "70%", top: '15%', left: '5%'}}>
      <div style={{position: 'absolute', width: '30%', height: '100%', overflowY: 'scroll', border: 'solid 1px black'}}>
        {
          msg.map((x, i) => 
            <div key={i} 
                 style={{height: "20%", width: "100%",  position: 'relative', border: 'solid 1px black'}}
                 onClick={()=>{setChat(x.msg); setOther(x.other)}}>
              <p className="smallText">{x.other}</p>
            </div>)
        }
      </div>
      <div style={{position: 'absolute', width: '60%', top: "0%",  left: '35%', height: '80%', overflowY: 'scroll', border: 'solid 1px black'}}>
        {
          chat.length ?
          chat.map((x,i) => <div style={{backgroundColor: x.to == x.other ? '#F2F2F2' :'#ACACAC', margin: 0, width: "80%", float: x.to == x.other ? 'left' : 'right', borderRadius: '20px'}}>
            <p className="smallerText" style={{padding: "10px"}}>
            {x.message}
            {/* <sub>{new Date(x.time.seconds * 1000)}</sub> */}
            </p>
            {x.relatedComments ? <p>{x.relatedComments.join(' | ')}</p> : null}
            {x.relatedComments ? <CommentTable ids={x.relatedComments}/> : null}
          </div>) :
          null
        }
      </div>
      {
        chat.length ?
          <div style={{position: 'absolute', width: '60%', top: "80%",  left: '35%', height: '20%', border: 'solid 1px black'}}>         
            <textarea ref={msgInput} type="text" name="enterChat" id="enterChat" style={{float: 'left', width: '80%', height: "100%", resize: 'none'}} />
            <button onClick={()=>{onsend(chat[0].other)}} className="buttons" style={{float: 'right', width: '20%', height: '100%', fontSize: "20px"}}>Send</button>
          </div> :
          null
         
      }
    </div>
  )
}
