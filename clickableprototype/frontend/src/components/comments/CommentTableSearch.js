import React, {useRef, useEffect } from 'react'

export default function CommentTableSearch({searchChange}) {
  const searchinput = useRef(null)

  useEffect(() => {
    if(!searchinput.current.value){
      searchChange('')
    }
  }, [searchinput])

  onchange = (e) => {
    searchChange(searchinput.current.value)
  }
  
  return (
    <div style={{ overflow: "revert" }}>
      <label className="smallText" for="searchCluster">Search for cluster:</label><br/>
      <input  type="text" 
              id="searchCluster" 
              name="searchCluster"
              ref={searchinput}
              onChange={onchange}/>
    </div>
  )
}
