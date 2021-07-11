import React, {useEffect, useState} from 'react'
// import {flare, salesData} from "../development/Data"
import VizControl from "./VizControl"
import PieInterface from "./PieInterface"
import Sunburst from "./Sunburst"
import VizTable from "./VizTable"
import axios from 'axios'

let api = "http://127.0.0.1:8080"

export default function VizPage({topics, dockets, setShowModal, setModalData}) {
  const [rules, setRules] = useState([]);
  const [search, setSearch] = useState({})
  const [tableData, setTableData] = useState([])
  const [demoDockets, setDemoDockets] = useState(dockets.children[0])
  const [topicKey, setTopicKey] = useState(topics.epa)

  useEffect(() => {
    axios.get(`${api}/docket`, {params: search})
      .then((res) => {
        res.data.forEach(x => {
          let newLabel = topicKey.filter(y => y.topic == x.topic)[0]
          newLabel ? x.topic = newLabel.words : x.topic = x.topic
        })

        setTableData(res.data)
      })
      .catch((err) => alert(err))
  }, [search, topicKey])

  useEffect(() => {
    let tempDockets = {...dockets.children[0]}
    if(rules.length) tempDockets.children = tempDockets.children.filter((x,i) => rules.indexOf(i+"") >= 0)
    setDemoDockets(tempDockets)

  }, [rules])

  useEffect(()=>{
    let tmp = [...topics.epa]
    tmp = tmp.map(x => {
      let topKey = {
        topic: x.topic.toLowerCase().replace(' ', '_'),
        words: `${x.topic.replace('Topic ', '')}: ${x.words[0]}, ${x.words[1]}, ${x.words[2]}`
      }

      return(topKey)
    })

    setTopicKey(tmp)

  }, [topics])

  return (
    <div style={{ width: "100vw", height: "1050px", alignItems: "baseline"}}>
      <VizControl dockets={dockets.children[0]} topics={topics.epa} rules={rules} setRules={setRules} />
      <PieInterface dockets={dockets.children[0]} rules={rules} />
      {dockets.children ? <Sunburst data={demoDockets} setSearch={setSearch} width={500}/> : null}
      {tableData.length & topicKey.length ? <VizTable tableData={tableData} topics={topicKey} setShowModal={setShowModal} setModalData={setModalData} /> : null }
    </div>
  )
}
