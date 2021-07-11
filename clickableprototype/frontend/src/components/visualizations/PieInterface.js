import React from 'react'
import Pie3d from "./Pie3d"

export default function PieInterface({dockets, rules}) {
  return (
    <svg
      width={600}
      height={500}
      // viewBox={[0,0,width,width]}
      style={{font: '10px sans-serif'}}>
      {
        rules.map((x,i) => 
          <Pie3d width={500} 
            data={dockets.children[x].children} 
            docket={dockets.children[x].name}
            rx={100} 
            ry={25} 
            h={40} 
            ir={.34} 
            rotation={260}
            i={7-i} key={i}/>   
          )
      }      
    </svg>
  )
}
