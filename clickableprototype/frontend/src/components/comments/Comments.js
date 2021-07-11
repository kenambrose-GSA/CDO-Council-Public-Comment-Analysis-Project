import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import CommentsTable from "./CommentsTable"
import SendIds from "./SendIds"
import DataTable from 'react-data-table-component';

import "./Comments.css"

let api = "http://127.0.0.1:8080"

export default function Comments({user, subjects, rules}) {
  const increaseBy = 5; 
  const [comments, setComments] = useState([])
  const [firstComments, setFirstComments] = useState([])
  const [clust, changeClust] = useState([])
  const [rule, changeRule] = useState('')
  const [showCount, setShowCount] = useState(0)
  function showMore(){
    setShowCount(showCount + 1)
  }

  function collapse(){
    setShowCount(0)
  }

  function clustAction(id, action){
    let tmpClust = [...clust]

    if(action == 'add'){
      tmpClust.push(id)
    }

    if(action == 'remove'){
      let index = tmpClust.indexOf(id)
      if(index >= 0){
        tmpClust.splice(index, 1)
      }
    }

    changeClust(tmpClust)
  }

  useEffect(() => {
      if(!rule){
        changeRule(rules[0])
      }
  }, [rules])

  useEffect(()=> {
    if(rule){
      axios.get(`${api}/comments?rule=${rule}`)
        .then(res => {
          let unique = res.data.map(x => x.clust)
          unique =  [...new Set(unique)];
          unique = unique.map(x =>
            res.data.filter(y => y.clust == x)
          )
          setShowCount(0)
          setComments(unique)
          setFirstComments(unique.map(x => {x[0].size = x.length; return(x[0])}).sort((a,b)=>b.size -a.size))
          
          console.log('unique', unique.length)
          console.log('unique', unique.map(x => x.length).reduce((tot, curr)=> tot + curr, 0))
        })
        .catch(err => {alert(err)})
    }
  }, [rule])

  const columns = [
    {
      name: 'Comment ID:',
      selector: 'clust',
      sortable: true,
      maxWidth: '100px'
    },
    {
      name: "Comments Represented",
      selector: 'size', 
      sortable: true,
      maxWidth: '100px'
    },
    {
      name: 'Text',
      selector: 'text',
      maxWidth: '700px'
    }
  ];

  const scrollingTable = (data) => <p>{data.text}</p>

  const ExpandableComponent = ({ data }) => {
    let tmp = comments.filter(x => x[0].name == data.name)[0]
    console.log('tmp', tmp)
    return(
      <div className="scrollable-td">
        <table className="duplicate-table">
        <tbody>
            {
              showCount 
              ?
              tmp.slice(0, showCount * increaseBy).map((x,i) => {
                return(<tr key={'rowdata'+i}><td>{x.text}</td></tr>)
              })
              :
              <tr><td>{tmp[0].text}</td></tr>
            }
            <tr>
              <td>
                <div className="center-button-div">
                  {
                    tmp.length > increaseBy * showCount
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
    )
  };

  const ruleselect = useRef(null)

  return (
    <div id="chats">
      {/* <SendIds user={user} clust={clust} subjects={subjects} /> */}
      <label className="smallText" for="chooseRule">Select a Rule:</label><br/>
      <select id="chooseRules" 
              name="chooseRules"
              value={rule}
              onChange={(e) => {changeRule(ruleselect.current.value)}}
              ref={ruleselect}
              >
        {
          rules.map((r, i) => <option key={i} value={r}>{r}</option>)
        }
      </select>
      <br/>
      <br/>
      <h3>
        {comments.length} comments representing {comments.map(x => x.length).reduce((tot, curr)=> tot + curr, 0)} total comments
      </h3>
      {/* <CommentsTable commentData={comments} clustAction={clustAction} /> */}
      <DataTable
        // className="smallText"
        columns={columns}
        data={firstComments}
        // selectableRows // add for checkbox selection
        // selectableRowsHighlight
        // onSelectedRowsChange={selectChange}
        pagination
        paginationPerPage={5}
        expandableRows
        expandableRowsComponent={<ExpandableComponent />}
        expandOnRowClicked
      />
    </div>
  )
}
