import React, {useEffect, useState} from 'react'
import DataTable from 'react-data-table-component';
import axios from 'axios'

let api = "http://127.0.0.1:8080"

export default function CommentTable({ids}) {
  const [tableData, setTableData] = useState([])
  useEffect(()=>{
    axios.get(`${api}/commentsv2`, {params: {cid: ids}})
      .then((res) => {
        console.log('ids data', res.data)
        setTableData(res.data)
      })
      .catch((err) => alert(err))

  }, [ids])

  const ExpandableComponent = ({ data }) => <p>{data.comment}</p>;

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

  return (
    <div>
      <DataTable
        className="smallText"
        columns={columns}
        data={tableData}
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
