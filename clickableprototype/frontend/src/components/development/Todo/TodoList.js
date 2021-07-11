import React, {useState, useEffect} from 'react'
import TodoItem from './TodoItem'

export default function TodoList() {
  const [todo, setTodo] = useState([])
  const [counter, setCounter] = useState(0)

  useEffect(()=>{
    if(!counter){
      let todoList = [
        {txt: "Create navbar", completed: false},
        {txt: "Create hamburger icon", completed: false},
        {txt: "Create a side menu that opens with hamburger", completed: false},
        {txt: "Create home, about, login, and explore buttons in side menu", completed: false},
        {txt: "Create home, about, login, and explore react templates", completed: false}
      ]
      setTodo(todoList)
      setCounter(counter + 1)
    }
  }, [counter])

  function oncheck(data, index){
    let newTodo = [...todo]
    newTodo[index] = data
    
    setTodo(newTodo)
  }

  return (
      <ol>
        {
          todo.map((x,i) => {
            return(
              <TodoItem 
                key={`todoitem-${i}`}
                data={x}
                bool={"completed"}
                index={i}
                oncheck={oncheck}/>
            )
          })
        }
      </ol>
  )
}
