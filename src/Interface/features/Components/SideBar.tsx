import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
  CSSObject,
  Theme,
  styled,
  Tooltip,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link } from 'react-router-dom';
import { componentsSelector } from './ComponentSlice';
import { useAppSelector } from '../../app/hooks';
import { IComponentSettings } from '../../../Application/Component/IComponentSettings';

function SideBar() {
  const components: IComponentSettings[] =
    useAppSelector(componentsSelector) || [];

  const closedMixin = (theme: Theme): CSSObject => ({});

  const Sidebar = styled(Drawer)(({ theme }) => ({
    '.MuiDrawer-paper': {
      overflowX: 'hidden',
      width: `calc(${theme.spacing(7)} + 1px)`,
      [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
      },
    },
  }));

  const SideBarIcon = styled(ListItemIcon)(({ theme }) => ({
    paddingLeft: `calc(${theme.spacing(1)})`,
    paddingTop: `calc(${theme.spacing(1)})`,
    paddingBottom: `calc(${theme.spacing(1)})`,
  }));

  return (
    <div>
      <Sidebar variant="permanent">
        <List>
          <Divider />
          <ListItem button key="Dashboard" component={Link} to="/components">
            <SideBarIcon>
              <Tooltip title="Components" placement="right">
                <DashboardIcon />
              </Tooltip>
            </SideBarIcon>
          </ListItem>
          <ListItem button key="Settings" component={Link} to="/settings">
            <SideBarIcon>
              <Tooltip title="Settings" placement="right">
                <SettingsIcon />
              </Tooltip>
            </SideBarIcon>
          </ListItem>
          <ListItem button>
            <SideBarIcon button key="Settings" component={Link} to="/console">
              <Tooltip title="Console" placement="right">
                <AssessmentIcon />
              </Tooltip>
            </SideBarIcon>
          </ListItem>
        </List>

        <List>
          {/*
          {components.map((component: IComponentSettings) => (
            <ListItem
              button
              key={component.uuid}
              component={Link}
              to={`/component/${component.uuid}`}
            >
              <ListItemIcon>
                <ComponentAvatar component={component} />
              </ListItemIcon>
              <ListItemText primary={component.name} />
            </ListItem>
          ))}
          */}
        </List>
      </Sidebar>
    </div>
  );
}

export default SideBar;
