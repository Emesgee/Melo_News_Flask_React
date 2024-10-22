import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CustomZoomControl = () => {
  const map = useMap(); // Access the map instance
  const zoomInRef = useRef(null);
  const zoomOutRef = useRef(null);

  useEffect(() => {
    let zoomInInterval, zoomOutInterval;

    // Function to continuously zoom in
    const startZoomingIn = () => {
      zoomInInterval = setInterval(() => {
        map.zoomIn();  // Zoom in the map
      }, 200);  // Adjust the speed as needed
    };

    // Function to continuously zoom out
    const startZoomingOut = () => {
      zoomOutInterval = setInterval(() => {
        map.zoomOut();  // Zoom out the map
      }, 200);  // Adjust the speed as needed
    };

    // Stop zooming
    const stopZooming = () => {
      clearInterval(zoomInInterval);
      clearInterval(zoomOutInterval);
    };

    // Add event listeners for the zoom-in area (bottom-left corner)
    if (zoomInRef.current) {
      zoomInRef.current.addEventListener('touchstart', startZoomingIn);
      zoomInRef.current.addEventListener('touchend', stopZooming);
    }

    // Add event listeners for the zoom-out area (bottom-right corner)
    if (zoomOutRef.current) {
      zoomOutRef.current.addEventListener('touchstart', startZoomingOut);
      zoomOutRef.current.addEventListener('touchend', stopZooming);
    }

    // Clean up event listeners on unmount
    return () => {
      if (zoomInRef.current) {
        zoomInRef.current.removeEventListener('touchstart', startZoomingIn);
        zoomInRef.current.removeEventListener('touchend', stopZooming);
      }
      if (zoomOutRef.current) {
        zoomOutRef.current.removeEventListener('touchstart', startZoomingOut);
        zoomOutRef.current.removeEventListener('touchend', stopZooming);
      }
    };
  }, [map]);

  return (
    <>
      {/* Div element for zoom-in control (bottom-left corner) */}
      <div
        ref={zoomOutRef}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
      />

      {/* Div element for zoom-out control (bottom-right corner) */}
      <div
        ref={zoomInRef}
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '50px',
          height: '50px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '50%',
          zIndex: 1000,
        }}
      />
    </>
  );
};

const MapArea = () => {
  return (
    <div className="map-area" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer center={[51.505, -0.09]} zoom={7} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>A sample marker.</Popup>
        </Marker>

        {/* Custom Zoom Control */}
        <CustomZoomControl />
      </MapContainer>
    </div>
  );
};

export default MapArea;
