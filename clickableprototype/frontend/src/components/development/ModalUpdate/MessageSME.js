import React, { useState, useRef } from 'react'
import firebase from "../../firebase/firebase"
import { Container, Modal, Button, Col, Row } from 'react-bootstrap'
import './ModalUpdate.css'

export default function MessageSME({ msgRef, changeModal, modalData, smeList, user }) {
  const selectSME = useRef(null)
  const textMessage = useRef(null)
  const enterClick = () => {
    const {serverTimestamp} = firebase.firestore.FieldValue;

    let msgBody = {
      from: user.uid,
      to: smeList[selectSME.current.value].uid,
      message: textMessage.current.value,
      time: serverTimestamp(),
      subject: smeList[selectSME.current.value].subject
     }
    
     msgRef.add(msgBody)
     changeModal()

  }
  
  return (
    <>
      <Modal.Header closeButton>
          <h1>{modalData.header}</h1>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <p><b>docket id: </b>{modalData.docket_id}</p>
            <p><b>comment id: </b>{modalData.id}</p>
            <p><b>comment: </b>{modalData.comment}</p>
            <select ref={selectSME}>
              {
                smeList.map((x,i) => <option key={i} value={i}>{x.subject}</option>)
              }
            </select>
            <br/>
            <textarea ref={textMessage} placeholder="enter your message here..." style={{width: "100%", resize: "none"}}></textarea>
            <br/>
            <button onClick={enterClick}>ENTER</button>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={changeModal}>
            Close
          </Button>
          {/* <Button variant="info" onClick={modalData.action}>
            {modalData.actionText}
          </Button> */}
        </Modal.Footer>
    </>
  )
}


