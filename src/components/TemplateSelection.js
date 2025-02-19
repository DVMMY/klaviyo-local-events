import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const TemplateSelection = ({
  privateKey,
  setSelectedTemplate,
  selectedTemplate,
}) => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(true);

  // Retrieves the list members of the selected Klaviyo List
  useEffect(() => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/getTemplates",
      params: {
        privateKey: privateKey,
      },
    };

    axios
      .request(options)
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  const handleListItemClick = () => {
    setOpen(!open);
  };

  return (
    <>
      {templates.length < 1 ? (
        <Box sx={{ display: "flex" }} className='load-wrap'>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <nav aria-label='klaviyo lists'>
            {templates && (
              <List className='list-selections'>
                <ListItemButton onClick={handleListItemClick}>
                  <ListItemText primary='Select an Email Template:' />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {templates?.map((template) => {
                      return (
                        <ListItemButton
                          sx={{ pl: 4 }}
                          key={template.id}
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setOpen(false);
                          }}
                          selected={template.id === selectedTemplate}
                        >
                          <ListItemText primary={template.attributes.name} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </List>
            )}
          </nav>
        </Box>
      )}
    </>
  );
};

export default TemplateSelection;
