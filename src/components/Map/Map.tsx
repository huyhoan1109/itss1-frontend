import { MapContainer, TileLayer, Circle, Marker, Polyline, useMap  } from 'react-leaflet';
import MapProp from "./MapProp";
import { useEffect } from 'react';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet';

const RecenterAutomatically = (props: MapProp) => {
    const map = useMap();
    useEffect(() => {
        map.setView([props.c_lat, props.c_lng]);
    }, [props.c_lat, props.c_lng]);
    return null;
}

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
            <Marker position={[props.c_lat, props.c_lng]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}></Marker>
            { props.lat && props.lng &&
            <Marker position={[props.lat, props.lng]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}></Marker>
            }
            <Circle 
                center={[props.c_lat, props.c_lng]}
                fillColor="blue" 
                radius={200}
            />
            { props.lat && props.lng && 
            <Polyline positions={[[props.c_lat, props.c_lng], [props.lat, props.lng]]} color={'red'} />
            }
            <RecenterAutomatically {...props}/>
        </MapContainer>
    )
}