import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MapMarker from "./MapMarker";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 17.5707,
  lng: 3.9962,
};

const MapDisplay = (props) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(2.2);

  useEffect(() => {
    const updateZoomLevel = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth > 1800) { 
        setZoomLevel(3);
      } else {
        setZoomLevel(2.2); 
      }
    };
    updateZoomLevel();

    window.addEventListener("resize", updateZoomLevel);
    return () => {
      window.removeEventListener("resize", updateZoomLevel);
    };
  }, []);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoomLevel}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {props.listProfiles?.map((item, index) => {
        let position = {
          lat: parseInt(item.attributes.location.latitude, 10),
          lng: parseInt(item.attributes.location.longitude, 10),
        };

        return (
          position.lat && (
            <MapMarker item={item} position={position} key={index} />
          )
        );
      })}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapDisplay;
