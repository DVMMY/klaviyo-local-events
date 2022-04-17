import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const MapMarker = ({ item, position }) => {
  const [markerHover, setMarkerHover] = useState(false);

  return (
    <Marker
      position={position}
      onMouseOver={() => setMarkerHover(true)}
      onMouseOut={() => setMarkerHover(false)}
    >
      {markerHover && (
        <InfoWindow position={position}>
          <div className='marker-content'>
            <h4 className='title'>
              {item.$first_name} {item.$last_name}
            </h4>
            {item.EventOneName && (
              <div className='events'>
                <h5 className='subtitle'>Events applied:</h5>
                <p>
                  {item.EventOneName}
                  <br /> {item.EventTwoName}
                </p>
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default MapMarker;
