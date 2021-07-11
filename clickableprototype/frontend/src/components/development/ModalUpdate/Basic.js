import React, { useState } from 'react'
import { Container, Modal, Button, Col, Row } from 'react-bootstrap'
import './ModalUpdate.css'

export default function Basic({ changeModal, modalData }) {
  
  return (
    <>
      <Modal.Header closeButton>
          <h1>{modalData.header}</h1>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            {modalData.body}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={changeModal}>
            Close
          </Button>
          <Button variant="info" onClick={modalData.action}>
            {modalData.actionText}
          </Button>
        </Modal.Footer>
    </>
  )
}


