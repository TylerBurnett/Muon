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
  Avatar,
  Badge,
  withStyles,
} from '@material-ui/core';
import {
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

const ActiveComponentBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
      },
    },
  })
)(Badge);

const InactiveComponentBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.main,
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        border: '1px solid currentColor',
      },
    },
  })
)(Badge);

function SideBar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
          {components.map((component: IComponentSettings) => (
            <ListItem
              button
              key={component.uuid}
              component={Link}
              to={`/component/${component.uuid}`}
            >
              <ListItemIcon>
                {component.active ? (
                  <ActiveComponentBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    variant="dot"
                  >
                    <Avatar alt={component.name} src={component.iconData}>
                      {!component.iconData &&
                        component.name
                          .split(' ')
                          .map((str) => str[0])
                          .join('')}
                    </Avatar>
                  </ActiveComponentBadge>
                ) : (
                  <InactiveComponentBadge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    variant="dot"
                  >
                    <Avatar alt={component.name} src={component.iconData}>
                      {!component.iconData &&
                        component.name
                          .split(' ')
                          .map((str) => str[0])
                          .join('')}
                    </Avatar>
                  </InactiveComponentBadge>
                )}
              </ListItemIcon>
              <ListItemText primary={component.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

export default SideBar;
