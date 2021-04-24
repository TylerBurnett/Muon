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
} from "@material-ui/core";
import {
  Send,
  Drafts,
  Inbox,
  StarBorder,
  ExpandMore,
  ExpandLess,
} from "@material-ui/icons";

import "./App.css";

function App() {
  const [state, setState] = useState({ open: false });

  return (
    <Grid container>
      <Grid item xs={2}>
        <Paper>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Nested List Items
              </ListSubheader>
            }
          >
            <ListItem button>
              <ListItemIcon>
                <Send />
              </ListItemIcon>
              <ListItemText primary="Sent mail" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Drafts />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItem>
            <ListItem
              button
              onClick={() =>
                state.open
                  ? setState({ open: false })
                  : setState({ open: true })
              }
            >
              <ListItemIcon>
                <Inbox />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
              {state.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={state.open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Starred" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Paper>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default App;
