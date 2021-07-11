import React, {useState, useRef, useEffect} from 'react'
import Sunburst from '../visualizations/Sunburst'
import Pie3d from '../visualizations/Pie3d'
import CustomMap from "../visualizations/CustomMap"
import Data, {salesData} from './Data'

export default function TestingPage() {
  const [mapData, setMapData] = useState({states: Data.states, counties: null, orgs: null})
  const [vector, setVector] = useState("states")

  // function changeVector(v){
  //   if(v == 'states'){
  //     setMapData({...mapData, counties: null, orgs: null})
  //     setVector('states')
  //   }

  //   if(v == 'counties'){
  //     setMapData({...mapData, counties: Data.counties})
  //     setVector('counties')
  //   }

  //   if(v == 'orgs'){
  //     setMapData({...mapData, orgs: Data.organizations})
  //     setVector('orgs')
  //   }
  // }
  // const [map, setMap] = useState({})
  function drillDown(info){
    console.log(info)
    // setMapData({...mapData, counties: info})
  }



  return (
    <div>
      {/* <CustomMap 
        width={600} 
        height={500} 
        mapData={mapData} 
        changeVector={changeVector} 
        vector={vector}/> */}
      <svg
        width={500}
        height={600}
        // viewBox={[0,0,width,width]}
        style={{font: '10px sans-serif'}}>
          
      {[6,5,4,3,2,1,0].map(x => 
        <Pie3d width={500} 
             data={salesData} 
             rx={100} 
             ry={25} 
             h={40} 
             ir={.34} 
             rotation={260}
             i={x}/> 
        
        )}

      </svg>
      {/* <Sunburst width={500} data={Data.flare}/> */}
    </div>
  )
}
