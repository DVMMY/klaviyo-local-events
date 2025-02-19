import React, { useState } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import axios from "axios";
import ListSelection from "./components/ListSelection";
import TemplateSelection from "./components/TemplateSelection";
import MapDisplay from "./components/MapDisplay";
import LoginDisplay from "./components/LoginDisplay";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const App = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [lists, setLists] = useState([]);
  const [chosenList, setChosenList] = useState("");
  const [listProfiles, setListProfiles] = useState([]);
  const [eventsUpdated, setEventsUpdated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [campaignId, setCampaignId] = useState("");

  // useEffect(() => {
  //     console.log('loggedIn', loggedIn);
  //   }, [loggedIn]);

  /**
   * Retrieves all of the lists within the user's Klaviyo account
   *
   * @return {Array} Returns an array of the lists
   * which is then populating the 'lists' state
   */
  const getLists = async () => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/lists",
      params: {
        privateKey: privateKey,
      },
    };

    axios
      .request(options)
      .then((response) => {
        if(response.data.length > 0) {
          setLists(response.data);
          console.log('loggedIn Data', response.data);
          setLoggedIn(true);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoggedIn(false);
      });
      console.log('loggedIn', loggedIn);
  };

  /**
   * Uses the Ticketmaster API to retrieve events for each profile within the 'newProfiles' state
   *
   * @returns {Array} Returns an array of 2 events which is then
   * passed into the assignEventDetails function
   */
  const retrieveEventDetails = () => {
    listProfiles.forEach((item) => {
      let personId = item.id;
      if (item.attributes.location.latitude && item.attributes.location.longitude) {
        const options = {
          method: "GET",
          url: "http://localhost:8000/getEvents",
          params: {
            latLng:
              item.attributes.location.latitude.toString() + "," + item.attributes.location.longitude.toString(),
          },
        };

        axios
          .request(options)
          .then((response) => {
            assignEventDetails(personId, response.data._embedded.events);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  /**
   * Assigns the the retrived events to Profiles as custom properties
   *
   * @param {String} id The id of the Profile
   * @param {Array} events The array of the events
   * @returns {Object} Returns an Object of the updated Profile's properties.
   */
  const assignEventDetails = (id, events) => {
    const options = {
      method: "PUT",
      url: "http://localhost:8000/updateProfile",
      params: {
        privateKey: privateKey,
        personId: id,
        eventOneName: events[0].name,
        eventOneDate: events[0].dates.start.localDate,
        eventOneImage: events[0].images[0].url,
        eventOneLink: events[0].url,
        eventTwoName: events[1].name,
        eventTwoDate: events[1].dates.start.localDate,
        eventTwoImage: events[1].images[0].url,
        eventTwoLink: events[1].url,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setEventsUpdated(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /**
   * Creates a new Campaign within Klaviyo
   *
   * @returns {Object} Returns an Object of the new Campaign's details/properties which
   * is then used to update the 'campaignId' state
   */
  const createCampaign = () => {
    const options = {
      method: "POST",
      url: "http://localhost:8000/createCampaign",
      params: {
        privateKey: privateKey,
        listId: chosenList,
        selectedTemplate: selectedTemplate,
      },
    };

    axios
      .request(options)
      .then((response) => {
        let newCampaignId = response.data.data.id;
        setCampaignId(newCampaignId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {!loggedIn && (
        <LoginDisplay setPrivateKey={setPrivateKey} getLists={getLists} />
      )}
      {loggedIn && (
        <>
          <CssBaseline />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} className='list-wrap'>
              {lists.length > 0 && (
                <ListSelection
                  lists={lists}
                  privateKey={privateKey}
                  setChosenList={setChosenList}
                  retrieveEventDetails={retrieveEventDetails}
                  setListProfiles={setListProfiles}
                  eventsUpdated={eventsUpdated}
                />
              )}
              {eventsUpdated && (
                <TemplateSelection
                  privateKey={privateKey}
                  setSelectedTemplate={setSelectedTemplate}
                  selectedTemplate={selectedTemplate}
                />
              )}
              {eventsUpdated && selectedTemplate && (
                <div className='button-wrap'>
                  <Button variant='outlined' onClick={createCampaign}>
                    Create Campaign
                  </Button>
                </div>
              )}
              {campaignId && (
                <div className='button-wrap'>
                  <Link
                    href={`https://www.klaviyo.com/email-template-editor/campaign/${campaignId}/content/edit`} 
                    underline='none'
                    target='_blank'
                    rel='noopener'
                    className='css-1rwt2y5-MuiButtonBase-root-MuiButton-root'
                  >
                    View Campaign
                  </Link>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={8} className='map-wrapper'>
              <MapDisplay listProfiles={listProfiles} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default App;
