import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  makeStyles,
  CssBaseline,
  Divider,
  createStyles,
  Theme,
  Collapse,
  Avatar,
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { componentsSelector } from './ComponentSlice';
import { useAppSelector } from '../../app/hooks';
import { IComponentSettings } from '../../../Application/Component/IComponentSettings';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

function SideBar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [state, setState] = useState({
    ActiveComponentsOpen: false,
    InactiveComponentsOpen: false,
  });

  const components: IComponentSettings[] =
    useAppSelector(componentsSelector) || [];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <List>
          <ListItem
            button
            onClick={open ? handleDrawerClose : handleDrawerOpen}
          >
            <ListItemIcon>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          </ListItem>
        </List>
        <Divider />
        <List>
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
        <Divider />

        <List>
          <ListItem
            button
            onClick={() =>
              state.ActiveComponentsOpen
                ? setState({ ...state, ActiveComponentsOpen: false })
                : setState({ ...state, ActiveComponentsOpen: true })
            }
          >
            <ListItemIcon>
              {state.ActiveComponentsOpen ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </ListItemIcon>
            <ListItemText primary="Active Components" />
          </ListItem>

          <Collapse
            in={state.ActiveComponentsOpen}
            timeout="auto"
            unmountOnExit
          >
            {components.map((component: IComponentSettings) => (
              <ListItem
                button
                key={component.uuid}
                component={Link}
                to={`/component/${component.uuid}`}
              >
                <ListItemIcon>
                  <Avatar alt={component.name} src={component.iconData}>
                    {!component.iconData &&
                      component.name
                        .split(' ')
                        .map((str) => str[0])
                        .join('')}
                  </Avatar>
                </ListItemIcon>
                <ListItemText primary={component.name} />
              </ListItem>
            ))}
          </Collapse>
        </List>
      </Drawer>
    </div>
  );
}

export default SideBar;
