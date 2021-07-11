import React, {useState, useRef, useEffect} from 'react'
import DataTable from 'react-data-table-component';

export default function VizTable({tableData, topics, setModalData, setShowModal}) {
  const [viewData, searchData] = useState(tableData)
  const [multiRow, setMultiRow] = useState([])
  const searchString = useRef(null)
  const sendButton = useRef(null)



  useEffect(() => {
    searchData(tableData)
    sendButton.current.disabled = true
  }, [tableData])

  const filterData = () => {
    let newData = tableData;

    console.log('current', searchString.current)

    if(searchString.current){
      let searchTxt = new RegExp(searchString.current.value.split(/\s+/).join('|'), 'i')
      newData = newData.filter(x => searchTxt.test(x.comment))
    }

    searchData(newData)

  }

  const selectChange = (x) => {
    console.log('change', x)
    sendButton.current.disabled = true
    
    if(x.selectedCount){
      sendButton.current.disabled = false 
      setMultiRow(x.selectedRows)
    }
  }


  const columns = [
    {
      name: 'Comment ID',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Topic',
      selector: 'topic',
      sortable: true
    },
    {
      name: 'Topic Match',
      selector: 'likeliness',
      sortable: true,
      maxWidth: '100px'
    }
  ];

  const sendMultiple = () => {
    console.log('hi')
    let tmp = {}
    tmp.data = multiRow;
    tmp.template = 'MultipleMessageSME'
    console.log('tmp', tmp)
    setModalData(tmp)
    setShowModal(true)
  }

  const ExpandableComponent = ({ data }) => <p onClick={()=> {let tmp = {...data}; tmp.template = 'MessageSME'; setModalData(tmp); setShowModal(true)}}>{data.comment}</p>;

  return (
    <div style={{width: '700px', float: "left", border: '1px solid black', padding: '10px', margin: '10px 10px 10px 55px'}}>
      <input 
        type="text"
        className="smallerText" 
        placeholder="search comment text..." 
        ref={searchString} 
        onChange={filterData} />

      <button 
        ref={sendButton} 
        style={{float: "right"}} 

        onClick={sendMultiple}>Send Multiple Rows</button>
      
      <DataTable
        className="smallText"
        title={tableData[0].docket_id}
        columns={columns}
        data={viewData}
        selectableRows // add for checkbox selection
        selectableRowsHighlight
        onSelectedRowsChange={selectChange}
        pagination
        paginationPerPage={10}
        expandableRows
        expandableRowsComponent={<ExpandableComponent />}
        expandOnRowClicked
      />
    </div>
  )
}
