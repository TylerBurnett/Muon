import { Grid, Box } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from './features/Components/SideBar';
import { useAppDispatch } from './app/hooks';
import { getComponentsAsync } from './features/Components/ComponentSlice';
import { getSettingsAsync } from './features/Settings/SettingsSlice';
import ComponentSettings from './features/Components/ComponentSettings';
import ApplicationSettings from './features/Settings/Settings';
import Components from './features/Components/Components';

function App() {
  const dispatch = useAppDispatch();
  dispatch(getComponentsAsync());
  dispatch(getSettingsAsync());

  return (
    <Router>
      <Grid container style={{ height: '99vh' }}>
        <Grid item xs={2}>
          <SideBar />
        </Grid>
        <Grid item xs={10}>
          <Box width="auto" pt={5} pr={10}>
            <Routes>
              <Route path="/" element={<Components />} />
              <Route path="/component/:uuid" element={<ComponentSettings />} />
              <Route path="/settings" element={<ApplicationSettings />} />
            </Routes>
          </Box>
        </Grid>
      </Grid>
    </Router>
  );
}

export default App;
