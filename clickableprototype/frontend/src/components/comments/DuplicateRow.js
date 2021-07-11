import React, {useEffect, useState, useRef} from 'react'

export default function DuplicateRow({rowData, increaseBy, clustAction}) {
  const [showCount, setShowCount] = useState(0)
  const checkbox = useRef(null)

  function showMore(){
    setShowCount(showCount + 1)
  }

  function collapse(){
    setShowCount(0)
  }

  function onchange(){
    if(checkbox.current.checked){
      clustAction(rowData[0].clust, 'add')
    } else {
      clustAction(rowData[0].clust, 'remove')
    }
  }

  return (
    <tr>
      <td className="comment-cluster">
        <input type="checkbox" 
               ref={checkbox}
               onChange={onchange}/>
      </td>
      <td className="comment-cluster">
        {rowData[0].clust}
      </td>
      <td className="comment-cluster">
        {rowData.length}
      </td>
      <td className="comment-cluster">
        <div className="scrollable-td">
          <table className="duplicate-table">
          <tbody>
              {
                showCount 
                ?
                rowData.slice(0, showCount * increaseBy).map((x,i) => {
                  return(<tr key={'rowdata'+i}><td>{x.text}</td></tr>)
                })
                :
                <tr><td>{rowData[0].text}</td></tr>
              }
              <tr>
                <td>
                  <div className="center-button-div">
                    {
                      rowData.length > increaseBy * showCount
                      ?
                      <button onClick={showMore}>load {increaseBy} more</button>
                      :
                      null
                    }
                    {
                      showCount 
                      ?
                      <button onClick={collapse}>collapse</button>
                      :
                      null
                    }
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  )
}
