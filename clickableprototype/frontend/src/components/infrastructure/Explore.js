import { useState } from 'react'

export default function Explore() {
  const [search, setSearch] = useState([])

  function onSearch() {
    alert("Searching . . .")
    setSearch([])
  }

  return (

    <div style={{ marginTop: "10px"}}>
      <h1 className="title">Explore</h1>
      
      <button
      onClick={onSearch}>
          Search
        </button>
       
    </div>
    
  );
}

