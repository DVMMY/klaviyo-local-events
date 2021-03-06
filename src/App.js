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
  const [newProfiles, setNewProfiles] = useState([]);
  const [eventsUpdated, setEventsUpdated] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [campaignId, setCampaignId] = useState("");

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
        setLists(response.data);
        setLoggedIn(true);
      })
      .catch((error) => {
        console.error(error);
        setLoggedIn(false);
      });
  };

  /**
   * Retrieves more data for each Profile from selected List (including location details)
   *
   * @returns {Array} Returns an array of Profiles which is being
   * used to update the 'newProfiles' state
   */
  const getExtraProfileData = (profiles) => {
    if (profiles.length > 0) {
      let tempProilesList = [];
      let itemsProcessed = 0;

      profiles.forEach((item) => {
        const options = {
          method: "GET",
          url: "http://localhost:8000/getProfile",
          params: {
            privateKey: privateKey,
            personId: item.id,
          },
        };

        axios
          .request(options)
          .then((response) => {
            tempProilesList.push(response.data);
            itemsProcessed++;
            if (itemsProcessed === profiles.length) {
              setNewProfiles(tempProilesList);
            }
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  };

  /**
   * Uses the Ticketmaster API to retrieve events for each profile within the 'newProfiles' state
   *
   * @returns {Array} Returns an array of 2 events which is then
   * passed into the assignEventDetails function
   */
  const retrieveEventDetails = () => {
    newProfiles.forEach((item) => {
      let personId = item.id;
      if (item.$latitude && item.$longitude) {
        const options = {
          method: "GET",
          url: "http://localhost:8000/getEvents",
          params: {
            latLng:
              item.$latitude.toString() + "," + item.$longitude.toString(),
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
        eventOneName: encodeURIComponent(events[0].name),
        eventOneDate: events[0].dates.start.localDate,
        eventOneImage: encodeURIComponent(events[0].images[0].url),
        eventOneLink: encodeURIComponent(events[0].url),
        eventTwoName: encodeURIComponent(events[1].name),
        eventTwoDate: events[1].dates.start.localDate,
        eventTwoImage: encodeURIComponent(events[1].images[0].url),
        eventTwoLink: encodeURIComponent(events[1].url),
      },
    };

    axios
      .request(options)
      .then((response) => {
        setEventsUpdated(true);
        getExtraProfileData(newProfiles);
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
        let newCampaignId = response.data.id;
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
                  setNewProfiles={setNewProfiles}
                  setChosenList={setChosenList}
                  retrieveEventDetails={retrieveEventDetails}
                  getExtraProfileData={getExtraProfileData}
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
                    href={`https://www.klaviyo.com/campaign-wizard/${campaignId}/1`}
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
              <MapDisplay newProfiles={newProfiles} />
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default App;
