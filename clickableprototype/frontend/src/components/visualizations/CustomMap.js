import React, {useState, useRef, useEffect} from 'react'
import { MapContainer,  Marker, TileLayer, GeoJSON, Popup }from 'react-leaflet'
import "leaflet/dist/leaflet.css";

export default function CustomMap({ width, height,  mapData, vector, drillDown, changeVector }) { 
  const gJson = useRef(null)

  useEffect(() => {
    console.log(mapData)
    console.log(mapData[vector])    
  })

  function MapPlaceholder(){
    return(
      <p>
        A leaflet map
        <noscript>You need to enable JavaScript to see this map.</noscript>
      </p>
    )
  }

  function clickedFeature(feature, layer){
    if(vector == 'states'){
      changeVector('counties')
    }
    if(vector == 'counties'){
      changeVector('orgs')
    }
  }
  function onEachFeature(feature, layer){
    layer.on({
      click: function(){clickedFeature(feature, layer)} 
    })
  }


  return (
    <MapContainer
      style={{height, width}}
      center={[37.0902, -95.7129]}
      zoom={4}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder/>}
      >
      <TileLayer 
        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        accessToken='pk.eyJ1IjoiYmVuamFtaW4tYS1vcnRpeiIsImEiOiJjanIxMGZ2OWQwaml1NGFveG03YWRzMXlxIn0.NvqZp0gcf8rFC9Ani5D9Cw'
        zoomOffset={-1}
        tileSize={512}
        id="mapbox/streets-v11"
        maxZoom={18} 
        />
      <GeoJSON 
        key={vector}
        data={mapData[vector]}
        onEachFeature={onEachFeature}
        />
    </MapContainer>
  )
}

