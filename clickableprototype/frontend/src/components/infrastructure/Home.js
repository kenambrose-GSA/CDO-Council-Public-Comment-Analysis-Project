import { useState } from 'react'

export default function Home() {
  const [workState, setWorkState] = useState({text: "In Progress"})

  function onUpdate() {
    alert("Update complete")
    setWorkState("Updated")
  }

  return (

    <div style={{ marginTop: "10px"}}>
      <h1 className="title">Home</h1>
      <h2>View your work:</h2>
      <button
      onClick={onUpdate}>
          Update
        </button>
    </div>
    
  );
}

