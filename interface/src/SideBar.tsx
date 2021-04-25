import React, { useState } from "react";
import {
  Grid,
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from "@material-ui/core";
import {
  List as ListIcon,
  Send as SendIcon,
  Drafts as DraftsIcon,
  Inbox as InboxIcon,
  StarBorder as StarBorderIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
} from "@material-ui/icons";

function SideBar() {
  const [state, setState] = useState({
    ActiveComponentsOpen: false,
    InactiveComponentsOpen: false,
  });

  return (
    <Paper style={{ height: "100vh" }}>
      <Typography variant="h4" align="center">
        Desktop Electron
      </Typography>

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            System
          </ListSubheader>
        }
      >
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="Security" />
        </ListItem>
      </List>

      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Components
          </ListSubheader>
        }
      >
        <ListItem
          button
          onClick={() =>
            state.ActiveComponentsOpen
              ? setState({ ...state, ActiveComponentsOpen: false })
              : setState({ ...state, ActiveComponentsOpen: true })
          }
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Active Components" />
          {state.ActiveComponentsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItem>
        <Collapse in={state.ActiveComponentsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 1" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 2" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 3" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 4" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem
          button
          onClick={() =>
            state.InactiveComponentsOpen
              ? setState({ ...state, InactiveComponentsOpen: false })
              : setState({ ...state, InactiveComponentsOpen: true })
          }
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Inactive Components" />
          {state.InactiveComponentsOpen ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ListItem>
        <Collapse
          in={state.InactiveComponentsOpen}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding>
            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 1" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 2" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 3" />
            </ListItem>

            <ListItem button>
              <ListItemIcon>
                <StarBorderIcon />
              </ListItemIcon>
              <ListItemText primary="Component 4" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Paper>
  );
}

export default SideBar;
