import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';
const Coverage = () => {
    const position = [23.6850,90.3563]
    const serviceCenters=useLoaderData();
    console.log(serviceCenters);
    return (
        <div>
            <h2 className="text-5xl">we are available in 64 districts</h2>
            <div></div>
            <div className='border w-full h-200 bg-amber-500'>
                <MapContainer center={position} zoom={8} scrollWheelZoom={false} className='h-200'>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                   {
                    serviceCenters.map((center,index)=> <Marker key={index} position={[center.latitude,center.longitude]}>
              <Popup>
                <strong className='text-primary bg-red-600'>{center.district}</strong> <br /> service area: {center.covered_area.join(', ')}
              </Popup>
                    </Marker>)
                   }
                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;