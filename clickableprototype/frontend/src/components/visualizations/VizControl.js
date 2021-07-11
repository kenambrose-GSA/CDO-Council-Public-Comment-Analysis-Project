import React, {useRef, useEffect} from 'react'
import {  Col, Form } from "react-bootstrap";
import * as d3 from 'd3'
import { legendColor } from 'd3-svg-legend'

export default function VizControl({dockets, rules, setRules, topics}) {
  const svgKey = useRef(null)

  useEffect(()=>{

    let wrds = topics.map(x => `${x.topic.replace('Topic ', '')}: ${x.words[0]}, ${x.words[1]}, ${x.words[2]}`)
    wrds.push('Other')
    
    var ordinal = d3.scaleOrdinal()
      .domain(wrds)
      .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99']);

    var svg = d3.select(svgKey.current);

    svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(20,20)");

    var legendOrdinal = legendColor()
      //d3 symbol creates a path-string, for example
      //"M0,-8.059274488676564L9.306048591020996,
      //8.059274488676564 -9.306048591020996,8.059274488676564Z"
      .shape("path", d3.symbol().type(d3.symbolCircle ).size(150)())
      .shapePadding(10)
      //use cellFilter to hide the "e" cell
      // .cellFilter(function(d){ return d.label !== "e" })
      .scale(ordinal);
      
    svg.select(".legendOrdinal")
      .call(legendOrdinal)
              
  }, [dockets])

  return (
    <form style={{float: 'left', border: '1px solid black', padding: '10px', margin: '10px', width: '600px', margin: '10px'}}>
      <fieldset>
        <legend className="smallTitle">Dockets and Topics</legend>
        <div style={{float: 'left'}}>
        <Form.Group as={Col} controlId="my_multiselect_field">
          <Form.Label className="smallText">Select a Rule:</Form.Label>
          <Form.Control 
            as="select"
            multiple 
            value={rules} 
            onChange={e => setRules([].slice.call(e.target.selectedOptions).map(item => item.value))}>
            {
              dockets.children.map((x,i) => 
                <option className="smallerText" value={i} key={i}>{x.name}</option>
              )
            }
          </Form.Control>
        </Form.Group> 
        </div>
        <svg className="smallerText" height={340} width={300} style={{borderLeft: '1px solid black', margin: "10px"}} ref={svgKey}></svg>
      </fieldset>
    </form>
  )
}
