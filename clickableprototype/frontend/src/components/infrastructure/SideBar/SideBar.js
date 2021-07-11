import React from 'react'
import './SideBar.css'

export default function SideBar({ menuList, setMenu }) {
/*
function onClickPage(y) {
  setMenuList(y.action(y.text))
  onClickMenu()
}
*/

  return (
    <div className="sidebar">
        { 
        menuList.map((x, i) =>
            <div
            key={i}>
                <button 
                className="menuButton"
                onClick={() => {x.action(x.text); setMenu(true) }}>
                  <p className="menuText">{x.text}</p>
                </button>
            </div>
        )
        }
    </div>
  )
}
