import React, { useState } from 'react'
import { Col, Row, Container } from 'react-bootstrap'
import SideBar from '../SideBar/SideBar'
import { RiArrowDownSLine } from 'react-icons/ri'
import './NavBar.css'

export default function NavBar({ menuList}) {
    const [menuHidden, setMenu] = useState(true)

  function onClickMenu(){
    setMenu(!menuHidden)
  }

  return (
    <Container fluid className="navbar-size">
      <div >
        <div className="title-space">
          {/* <h1 className="title-text">CDO</h1> */}
          <img src={process.env.PUBLIC_URL + '/cdo-logo.png'} style={{maxHeight:"95%", maxWidth: "100%"}} />
        </div>
        <div style={{ float: "left" }}
          onClick={onClickMenu}>
            <div className="menu">
              <p className="menuTitle">Menu</p>
            </div>
            <div className="droparrow">
              <RiArrowDownSLine style={{ height: "25px", width: "30px" }}/>
            </div>
        </div>
      </div>     
      <div className="dropbar"
      hidden={menuHidden}>
          <SideBar 
            menuList={menuList}
            setMenu={setMenu}
           />
      </div>
    </Container>
  )
}
