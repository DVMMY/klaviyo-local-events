import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const ListSelection = ({
  lists,
  privateKey,
  setNewProfiles,
  setChosenList,
  retrieveEventDetails,
}) => {
  const [selectedList, setSelectedList] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [open, setOpen] = useState(true);

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

  const handleListItemClick = () => {
    setOpen(!open);
  };

  // Retrieve events from parent element and close lists view
  const handleGetEvents = () => {
    retrieveEventDetails();
    setOpen(false);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <nav aria-label='klaviyo lists'>
          {lists && (
            <List
              className='list-selections'
              subheader={
                <ListSubheader component='div' id='nested-list-subheader'>
                  <span className='list-main-title'>Klaviyo Local Events</span>
                </ListSubheader>
              }
            >
              <ListItemButton onClick={handleListItemClick}>
                <ListItemText primary='Select a List:' />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {lists?.map((list) => {
                    return (
                      <ListItemButton
                        sx={{ pl: 4 }}
                        key={list.list_id}
                        onClick={() => {
                          setSelectedList(list.list_id);
                          setChosenList(list.list_id);
                        }}
                        selected={list.list_id === selectedList}
                      >
                        <ListItemText primary={list.list_name} />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </List>
          )}
        </nav>
      </Box>
      {profiles.length > 0 && (
        <div className='button-wrap'>
          <Button variant='outlined' onClick={() => handleGetEvents()}>
            Assign local events to Profiles
          </Button>
        </div>
      )}
    </>
  );
};

export default ListSelection;
