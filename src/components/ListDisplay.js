import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  List,
  ListSubheader,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const ListDisplay = ({ lists, privateKey, setNewProfiles, setChosenList }) => {
  const [selectedList, setSelectedList] = useState("");
  const [profiles, setProfiles] = useState([]);

  // Retrieves the list members of the selected Klaviyo List
  useEffect(() => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/listMembers",
      params: {
        privateKey: privateKey,
        selectedList: selectedList,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setProfiles(response.data.records);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedList]);

  // Retrieves more data for each Profile from selected List (including location details)
  useEffect(() => {
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
  }, [profiles]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <nav aria-label='klaviyo lists'>
          {lists && (
            <List
              className='list-selections'
              subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                  <span className='list-main-title'>Klaviyo Events App</span>
                  <br /> Select a list:
                </ListSubheader>
              }
            >
              {lists?.map((list) => {
                return (
                  <ListItem disablePadding key={list.list_id}>
                    <ListItemButton
                      onClick={() => {
                        setSelectedList(list.list_id);
                        setChosenList(list.list_id);
                      }}
                      selected={list.list_id === selectedList}
                    >
                      <ListItemText primary={list.list_name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          )}
        </nav>
      </Box>
    </>
  );
};

export default ListDisplay;
