import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  Drawer,
  Divider,
  styled,
  Tooltip,
  Avatar,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link } from 'react-router-dom';
import icon from '../../../../assets/icons/128x128.png';

const SideBar: React.FC = () => {
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
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }));

  return (
    <div>
      <Sidebar variant="permanent">
        <List>
          <ListItem button key="Dashboard" component={Link} to="/components">
            <Tooltip title="Muon" placement="right">
              <Avatar src={icon} style={{ width: '40px', height: '40px' }} />
            </Tooltip>
          </ListItem>
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
          <ListItem button key="Settings" component={Link} to="/console">
            <SideBarIcon>
              <Tooltip title="Console" placement="right">
                <AssessmentIcon />
              </Tooltip>
            </SideBarIcon>
          </ListItem>
        </List>
      </Sidebar>
    </div>
  );
};

export default SideBar;
