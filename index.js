const PORT = 8000;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());

// app.get("/", (req, res) => {
//   res.json("");
// });

// RETRIEVE ALL LISTS FROM KLAVIYO ACCOUNT
app.get("/lists", (req, res) => {
  const privateKey = req.query.privateKey;
  
  async function fetchAllLists() {
    let allLists = [];
    let url = 'https://a.klaviyo.com/api/lists';
    
    try {
      while (true) {
        const response = await axios.get(url, {
          headers: { 
            accept: 'application/vnd.api+json',
            revision: '2025-01-15',
            Authorization: `Klaviyo-API-Key ${privateKey}`
           }
        });
  
        allLists.push(...response.data.data);  
        url = response.data.links && response.data.links.next ? response.data.links.next : null;
        if (!url) {
          break;  
        }
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
    res.json(allLists);
  }
  fetchAllLists();
});

// RETRIEVE MEMBERS FROM CHOSEN KLAVIYO LIST
app.get("/listMembers", (req, res) => {
  const privateKey = req.query.privateKey;
  const listId = req.query.selectedList;

  async function fetchAllListMembers() {
    let allMembers = [];
    let url = `https://a.klaviyo.com/api/lists/${listId}/profiles`;
    
    try {
      while (true) {
        const response = await axios.get(url, {
          headers: { 
            accept: 'application/vnd.api+json',
            revision: '2025-01-15',
            Authorization: `Klaviyo-API-Key ${privateKey}`
            }
        });
  
        allMembers.push(...response.data.data);  
        url = response.data.links && response.data.links.next ? response.data.links.next : null;
        if (!url) {
          break;  
        }
      }
    } catch (error) {
      console.error('Error fetching list members:', error);
    }
    res.json(allMembers);
  }
  fetchAllListMembers();
});

// GET EVENT DATA FROM TICKETMASTER
app.get("/getEvents", (req, res) => {
  const apiKey = process.env.REACT_APP_TICKETMASTER_API_KEY;
  const latLng = req.query.latLng;
  const options = {
    method: "GET",
    url: `https://app.ticketmaster.com/discovery/v2/events.json?size=2&apikey=${apiKey}&latlong=${latLng}`,
    headers: { Accept: "application/json" },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error("error", error);
    });
});

// UPDATE PROFILE'S CUSTOM PROPERTIES WITH EVENT DATA
app.put("/updateProfile", (req, res) => {
  const privateKey = req.query.privateKey;
  const personId = req.query.personId;
  const eventOneName = req.query.eventOneName;
  const eventOneDate = req.query.eventOneDate;
  const eventOneImage = req.query.eventOneImage;
  const eventOneLink = req.query.eventOneLink;
  const eventTwoName = req.query.eventTwoName;
  const eventTwoDate = req.query.eventTwoDate;
  const eventTwoImage = req.query.eventTwoImage;
  const eventTwoLink = req.query.eventTwoLink;

  let header = { headers: {accept: 'application/vnd.api+json',
    revision: '2025-01-15',
    'content-type': 'application/vnd.api+json',
    Authorization: `Klaviyo-API-Key ${privateKey}`
  }};
  let url = `https://a.klaviyo.com/api/profiles/${personId}`;
  let body = `{"data":{"type":"profile","id":"${personId}","attributes":{"properties":{"EventOneName":"${eventOneName}","EventOneDate":"${eventOneDate}","EventOneImage":"${eventOneImage}","EventOneLink":"${eventOneLink}","EventTwoName":"${eventTwoName}","EventTwoDate":"${eventTwoDate}","EventTwoImage":"${eventTwoImage}","EventTwoLink":"${eventTwoLink}"}}}}`;

  axios
    .patch(url, body, header)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error("error", error);
    });
});

app.get("/getTemplates", (req, res) => {
  const privateKey = req.query.privateKey;
  async function fetchAllTemplates() {
    let allTemplates = [];
    let url = 'https://a.klaviyo.com/api/templates';
    
    try {
      while (true) {
        const response = await axios.get(url, {
          headers: { 
            accept: 'application/vnd.api+json',
            revision: '2025-01-15',
            Authorization: `Klaviyo-API-Key ${privateKey}`
           }
        });
  
        allTemplates.push(...response.data.data);  
        url = response.data.links && response.data.links.next ? response.data.links.next : null;
        if (!url) {
          break;  
        }
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
    // console.log('allTemplates',allTemplates);
    res.json(allTemplates);
  }
  fetchAllTemplates();
});

// CREATE NEW KLAVIYO CAMPAIGN
app.post("/createCampaign", (req, res) => {
  const privateKey = req.query.privateKey;
  const listId = req.query.listId;
  const selectedTemplate = req.query.selectedTemplate;
  let messageId = ''

  async function createNewCampaign() {
    try {
      let headerCampaign = { headers: {
        accept: 'application/vnd.api+json',
        revision: '2025-01-15',
        'content-type': 'application/vnd.api+json',
        Authorization: `Klaviyo-API-Key ${privateKey}`
      }};
      let urlCampaign = 'https://a.klaviyo.com/api/campaigns';
      let bodyCampaign = `{
      "data": {
        "type": "campaign",
        "attributes": {
          "audiences": {
            "included": [
              "${listId}"
            ]
          },
          "send_options": {
            "use_smart_sending": true
          },
          "campaign-messages": {
            "data": [
              {
                "type": "campaign-message",
                "attributes": {
                  "definition": {
                    "channel": "email",
                    "label": "Local Events",
                    "content": {
                      "subject": "Local Events"
                    }
                  }
                }
              }
            ]
          },
          "name": "Local Events"
        }
      }
    }`;
    
    const campaignResponse = await axios
      .post(urlCampaign, bodyCampaign, headerCampaign)
      .then((response) => {
        messageId = response.data.data.relationships['campaign-messages'].data[0].id;
      })

      let headerMessage = { headers: {
        accept: 'application/vnd.api+json',
        revision: '2025-01-15',
        'content-type': 'application/vnd.api+json',
        Authorization: `Klaviyo-API-Key ${privateKey}`
      }};
      let urlMessage = 'https://a.klaviyo.com/api/campaign-message-assign-template';
      let bodyMessage = `{
        "data": {
          "type": "campaign-message",
          "relationships": {
            "template": {
              "data": {
                "type": "template",
                "id": "${selectedTemplate}"
              }
            }
          },
          "id": "${messageId}"
        }
      }`;

      const messageResponse = await axios
        .post(urlMessage, bodyMessage, headerMessage)
        .then((response) => {
          res.json(response.data);
      })


    } catch (err) {
      console.log('Error creating campaign:', err);
    }
  }
  createNewCampaign()
  
});

app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});
