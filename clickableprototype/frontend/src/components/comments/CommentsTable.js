import React, {useState, useEffect, useRef} from 'react'
import CommentTableSearch from './CommentTableSearch'
import DuplicateRow from "./DuplicateRow"

export default function CommentsTable({commentData, clustAction}) {
  const [searchData, changeSearchData] = useState(commentData)
  const [searchValue, getSearchValue] = useState("")
  
  useEffect(()=>{
    if(!searchValue){
      changeSearchData(commentData)
    } else {
      let newData = commentData.filter(x => (x[0].clust + "").indexOf(searchValue) > -1)
      changeSearchData(newData)
    }
  })

  return (
    <div className="scrollable-table">
      
      <br/>
      {/* <CommentTableSearch searchChange={getSearchValue} /> */}
      <br/>
      <br/>
      <table>
        <thead>
          <tr>
            <th className="tableHead">Save-to-Show:</th>
            <th className="tableHead">Cluster:</th>
            <th className="tableHead">Comment Count:</th>
            <th className="tableHead">Comment:</th>
          </tr>
        </thead>
        <tbody>
          {
            clustAction.length ?
            // <p>{JSON.stringify(searchData)}</p>
            searchData.map((d,i) => 
              <DuplicateRow key={'duplicaterow' + i}
                            rowData={d}
                            increaseBy={5}
                            clustAction={clustAction}/>
            )
             :
            <p></p>
          }
        </tbody>
      </table>
    </div>
    
  )
}
