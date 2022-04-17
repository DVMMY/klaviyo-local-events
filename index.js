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
  const options = {
    method: "GET",
    url: `https://a.klaviyo.com/api/v2/lists?&api_key=${privateKey}`,
    headers: { Accept: "application/json" },
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
      console.log("response.data", response.data);
    })
    .catch((error) => {
      console.error("error", error);
    });
});

// RETRIEVE MEMBERS FROM CHOSEN KLAVIYO LIST
app.get("/listMembers", (req, res) => {
  const privateKey = req.query.privateKey;
  const listId = req.query.selectedList;
  const options = {
    method: "GET",
    url: `https://a.klaviyo.com/api/v2/group/${listId}/members/all?api_key=${privateKey}`,
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

// GET PROFILE DATA
app.get("/getProfile", (req, res) => {
  const privateKey = req.query.privateKey;
  const personId = req.query.personId;
  const options = {
    method: "GET",
    url: `https://a.klaviyo.com/api/v1/person/${personId}?api_key=${privateKey}`,
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

  const options = {
    method: "PUT",
    url: `https://a.klaviyo.com/api/v1/person/${personId}?EventOneName=${eventOneName}&EventOneDate=${eventOneDate}&EventOneImage=${eventOneImage}&EventOneLink=${eventOneLink}&EventTwoName=${eventTwoName}&EventTwoDate=${eventTwoDate}&EventTwoImage=${eventTwoImage}&EventTwoLink=${eventTwoLink}&api_key=${privateKey}`,
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

// CREATE NEW KLAVIYO CAMPAIGN
app.post("/createCampaign", (req, res) => {
  const privateKey = req.query.privateKey;
  const listId = req.query.listId;

  const { URLSearchParams } = require("url");
  const encodedParams = new URLSearchParams();

  encodedParams.set("list_id", `${listId}`);
  encodedParams.set("template_id", "YvBtCD");
  encodedParams.set("from_email", "dammy.adeniyi@klaviyo.com");
  encodedParams.set("from_name", "Local Events");
  encodedParams.set("subject", "Local Events");
  encodedParams.set("name", "Local Events");
  encodedParams.set("use_smart_sending", "true");
  encodedParams.set("add_google_analytics", "false");

  const options = {
    method: "POST",
    url: `https://a.klaviyo.com/api/v1/campaigns?api_key=${privateKey}`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: encodedParams,
  };

  axios
    .request(options)
    .then((response) => {
      res.json(response.data);
      console.error("response", response);
    })
    .catch((error) => {
      console.error("error", error);
    });
});

app.listen(8000, () => {
  console.log(`Server is running on port ${PORT}`);
});
