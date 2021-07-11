import React, { useState, useRef } from 'react'
import firebase from "../../firebase/firebase"
import { Container, Modal, Button, Col, Row } from 'react-bootstrap'
import DataTable from 'react-data-table-component';
import './ModalUpdate.css'

export default function MultipleMessageSME({ msgRef, changeModal, modalData, smeList, user }) {
  const selectSME = useRef(null)
  const textMessage = useRef(null)

  const columns = [
    {
      name: 'Comment ID',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Topic',
      selector: 'topic',
      sortable: true
    },
    {
      name: 'Topic Match',
      selector: 'likeliness',
      sortable: true,
      maxWidth: '100px'
    }
  ];

  const ExpandableComponent = ({ data }) => <p>{data.comment}</p>;

  const enterClick = () => {
    const {serverTimestamp} = firebase.firestore.FieldValue;

    let msgBody = {
      from: user.uid,
      to: smeList[selectSME.current.value].uid,
      message: textMessage.current.value,
      time: serverTimestamp(),
      subject: smeList[selectSME.current.value].subject,
      relatedComments: modalData.data.map(x => x.id)
     }
     console.log(msgBody)
    
     msgRef.add(msgBody)
     changeModal()

  }

  
  
  return (
    <>
      <Modal.Header closeButton>
          {/* <h1>{modalData.header}</h1> */}
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
          <DataTable
            title="Inform SME about multiple comments"
            columns={columns}
            data={modalData.data}
            // selectableRows // add for checkbox selection
            // selectableRowsHighlight
            // onSelectedRowsChange={selectChange}
            pagination
            paginationPerPage={5}
            expandableRows
            expandableRowsComponent={<ExpandableComponent />}
            expandOnRowClicked
          />
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


