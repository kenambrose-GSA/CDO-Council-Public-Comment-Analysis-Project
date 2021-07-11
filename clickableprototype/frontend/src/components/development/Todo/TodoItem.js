import React, {useRef, useEffect} from 'react'

export default function TodoItem({data, bool, index, oncheck}) {
  const inputCheck = useRef(null)

  useEffect(()=>{
    inputCheck.current.checked = data[bool]
  }, [data])

  function onClick(){
    let newData = {...data};
    console.log('input check', inputCheck)
    newData[bool] = inputCheck.current.checked
    oncheck(newData, index)
  }

  function style(bool){
    console.log('style', bool)
    if(bool) return({ textDecoration: "line-through"})
    return({})
  }

  return (
    <li>
      <input type="checkbox" ref={inputCheck} onClick={onClick}/>
      <span style={style(data[bool])}>
        {data.txt}
      </span>
    </li>
  )
}
