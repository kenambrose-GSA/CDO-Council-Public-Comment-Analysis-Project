import React, { useState } from 'react'
import { Container, Modal, Button, Col, Row } from 'react-bootstrap'
import './ModalUpdate.css'
import Basic from './Basic'
import MessageSME from './MessageSME'
import MultipleMessageSME from "./MultipleMessageSME"

export default function ModalUpdate({ msgRef, showModal, changeModal, user, modalData, smeList}) {
    //const [modalChange, setModalChange] = useState()
    //const [showModal, setShowModal] = useState(false)
    /*
    const openModal = () => setShowModal(true)
    const closeModal = () => setShowModal(false)

    const setChanges = () => {
        alert('Successfully Saved')
        setModalChange("Success")
        closeModal()
    }
    */

  return (
    <>
      <Modal 
      show={showModal} 
      onHide={changeModal}
      size="lg"
      centered
      >
        {
          modalData.template == "Basic" ?
          <Basic 
            changeModal={changeModal}
            modalData={modalData} /> :
           null
        }
        {
          modalData.template == "MessageSME" ?
          <MessageSME
            smeList={smeList}
            changeModal={changeModal}
            user={user}
            modalData={modalData}
            msgRef={msgRef} /> :
          null
        }
        {
          modalData.template == "MultipleMessageSME" ?
          <MultipleMessageSME
            smeList={smeList}
            changeModal={changeModal}
            user={user}
            modalData={modalData}
            msgRef={msgRef} /> :
          null
        }
      </Modal>
    </>
  )
}
