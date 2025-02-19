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
  setChosenList,
  retrieveEventDetails,
  setListProfiles,
  eventsUpdated
}) => {
  const [selectedList, setSelectedList] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [open, setOpen] = useState(true);

  // Retrieves the list members of the selected Klaviyo List
  useEffect(() => {
    if(selectedList.length > 0) {
      const options = {
        method: "GET",
        url: "http://localhost:8000/listMembers",
        params: {
          privateKey: privateKey,
          selectedList: selectedList,
        },
      };
      // console.log('selected list', selectedList);
      axios
        .request(options)
        .then((response) => {
          setProfiles(response.data);
          setListProfiles(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedList,eventsUpdated]);

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
                  <span className='list-main-title' onClick={()=>window.location.reload()}>Klaviyo Local Events</span>
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
                          setSelectedList(list.id);
                          setChosenList(list.id);
                        }}
                        selected={list.list_id === selectedList}
                      >
                        <ListItemText primary={list.attributes.name} />
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
