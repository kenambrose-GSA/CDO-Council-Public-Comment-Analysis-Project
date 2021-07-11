import React, {useState, useRef, useEffect} from 'react'
import * as d3 from 'd3'

export default function Sunburst({ width, data, setSearch }) {
  //=====================//
  //===== Props =========//
  //=====================//
  // 
  // data must be in the format of {name: 'root', children: [{name: 'child1', children: []}, {name: 'child2', value: 123}]}
  // root nodes must have value
  // everything but root must have children


  //=====================//
  //== Initializing ====//
  //====================// 

  // reference to g element for d3 manipulation
  let gInit = useRef(null) 

  // initializers for D3 Selections [maybe convert to state?]
  let g;
  let path;
  let parent;
  let label;

  let radius = width/6

  
  const root = partition(data);
  root.each(d => d.current = d)
  
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

  function partition(data) {
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a,b) => b.value - a.value)

    return d3.partition()
      .size([2*Math.PI, root.height + 1])
      (root);
  }

  // runs on each render
  useEffect(() => {
    if(!g)  g = d3.select(gInit.current);
    g.selectAll('*').remove()
    path = g
      .append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .join("path")
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
        .attr("d", d => arc(d.current));

    path.filter(d => d.children)
      .style("cursor", "pointer")

    path.on("click", clicked);
    
    path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
    
    label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .text(d => d.data.name);

    parent = g
      .append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "transparent")
      .attr("pointer-events", "all")
      .on("click", clicked);
  }, [data])

  const format = d3.format(",d")
  
  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }
  
  function arcVisible(x){return x.y1 <= 3 && x.y0 >= 1 && x.x1 > x.x0}

  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))


  
  function clicked(event, p) {
    if(p.depth > 0){

      let tmp = {...p}
      let qryName = p.data.name
      let qryDocket;

      while (tmp.depth > 1) tmp = tmp.parent; 
      qryDocket = tmp.data.name; 

      let search = {did: qryDocket}
      if(qryName != qryDocket) {search.top =qryName}

      setSearch(search)
    }
    
    if(p.children){

      parent.datum(p.parent || root);
  
      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });
  
      const t = g.transition().duration(750);
  
      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));
  
      label.filter(function(d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
          .attr("fill-opacity", d => +labelVisible(d.target))
          .attrTween("transform", d => () => labelTransform(d.current));
    }
  }

  return (
    
    <svg
      width={width}
      height={width}
      viewBox={[0,0,width,width]}
      style={{font: '10px sans-serif', float: 'left'}}>
      <g 
        transform={`translate(${width/2},${width/2})`}
        ref={gInit}>
      </g>
    </svg>
  )
}

