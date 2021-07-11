import React, {useState, useEffect} from 'react'
import { Button } from 'react-bootstrap'
import axios from 'axios'
import "./Comments.css"

export default function SendIds({user, clust, subjects}) {
  const [notes, setNotes] = useState("")
  const [subject, setSubject] = useState("")
  const [counter, setCounter] = useState(0)

  useEffect(()=>{
    if(!counter){
      setSubject(subjects[0])
      setCounter(1)
    }
  }, [subjects])


  let api = "http://127.0.0.1:8080"
  
  function oninputchange(e, f){
    let fun = eval(f)
    fun(e.target.value)
  }

  function onsubmit(e){
    e.preventDefault()

    axios({
      url: `${api}/sendEmail`,
      method: "POST",
      data: {sub: subject, 
             temp: 'test', 
             userEmail: user.email,
             commentIds: clust,
             userNotes: notes
            }
    })
    .then(() => alert('email sent'))
    .catch(err => alert(err))

  }

  return (
    <div>
      <h3 className="smallTitle">Selected Cluster IDs: {clust.length ? clust.join(' | ') : "[None Selected]"}</h3>
      <form action="#" method="POST" onSubmit={onsubmit}>
        <fieldset>
          <legend className="smallTitle">Send out IDs</legend>
          
          <label className="smallText" for="chooseSubject">Notify the following SME:</label><br/>
          <input list="subjects" 
                  id="chooseSubject" 
                  name="chooseSubject"
                  onChange={(e) => {oninputchange(e, 'setSubject')}}/>
          <datalist id="subjects">
            {
              subjects.map((sub, i) => <option key={i} value={sub}>{sub}</option>)
            }
          </datalist><br/><br/>

          <label className="smallText" for="notes">Notes</label><br/>
          <textarea name="notes" 
                    id="notes" 
                    rows="4" 
                    cols="50" 
                    onChange={(e) => {oninputchange(e, 'setNotes')}}></textarea><br/><br/>

          <button className="sendButton" type="submit">Send</button>

        </fieldset>
      </form>
    </div>
  )
}
