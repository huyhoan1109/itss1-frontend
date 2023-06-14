import { MapContainer, TileLayer, Circle, Marker, Polyline  } from 'react-leaflet';
import MapProp from "./MapProp";
import { useEffect, useRef } from 'react';

export default function Map(props: MapProp) {
    
    const zoom = 17

    return (
        <MapContainer 
            center={[props.c_lat, props.c_lng]} zoom={zoom}
            style={{ width: "400px", height:"400px",backgroundColor:"white"}} 
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[props.lat, props.lng]}></Marker>
            <Marker position={[props.c_lat, props.c_lng]}></Marker>
            <Circle 
                center={[props.c_lat, props.c_lng]}
                fillColor="blue" 
                radius={200}
            />
            <Polyline positions={[[props.c_lat, props.c_lng], [props.lat, props.lng]]} color={'red'} />
        </MapContainer>
    )
}