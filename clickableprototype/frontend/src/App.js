import './App.css';
import { useState } from 'react'
import FirebaseLogic from "./components/firebase/FirebaseLogic"
// import LoginModal from './components/firebase/LoginModal'
import ModalUpdate from './components/development/ModalUpdate/ModalUpdate'
// import TestingPage from "./components/development/TestingPage"

function App() {
  const [pagedata, setPagedata] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState({
    template: "Basic",
    header: "",
    body: "",
    actionText: "Button",
    action: () => {alert("action")}
  })
  const [smeList, setSme] = useState([])
  const [user, setUser] = useState(null)
  const [msgRef, setMsgRef] = useState({})

  return (
    <>
      <FirebaseLogic 
        setModalData={setModalData}
        setShowModal={setShowModal}
        showModal={showModal}
        setSme={setSme} 
        user={user}
        setUser={setUser}
        msgRef={msgRef}
        setMsgRef={setMsgRef} />

      <ModalUpdate 
        modalData={modalData}
        showModal={showModal}
        smeList={smeList}
        changeModal={() => {setShowModal(!showModal)}}
        user={user}
        msgRef={msgRef}
      />
    </>
    // <TestingPage />

      

  );
}

export default App;
