import { useState, useCallback } from "react";
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
      zoom={2}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {props.newProfiles?.map((item, index) => {
        let position = {
          lat: parseInt(item.$latitude, 10),
          lng: parseInt(item.$longitude, 10),
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
