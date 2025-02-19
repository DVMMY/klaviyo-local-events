import React, { useState } from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";

const MapMarker = ({ item, position }) => {
  const [markerHover, setMarkerHover] = useState(false);
  let last_name = item.attributes.last_name ? ' ' + item.attributes.last_name : '';
  let markerTitle = item.attributes.first_name || item.attributes.last_name ? item.attributes.first_name + last_name : item.attributes.email;
  // console.log('item', item);

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
              {markerTitle}
            </h4>
            {item.attributes.properties.EventOneName && (
              <div className='events'>
                <h5 className='subtitle'>Events applied:</h5>
                <p>
                  {item.attributes.properties.EventOneName}
                  <br /> {item.attributes.properties.EventTwoName}
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
