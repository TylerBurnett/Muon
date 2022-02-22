import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  getSettingsContainer,
  setComponentSettings as saveComponentSettings,
  setApplicationSettings as saveApplicationSettings,
} from './SettingsAPI';
import {
  SettingsContainer,
  ComponentSettings,
  ApplicationSettings,
} from '../../../main/Data/ApplicationSettings';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store';

export interface SettingsState {
  settings: SettingsContainer;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: SettingsState = {
  settings: {} as SettingsContainer,
  status: 'idle',
};

export const getSettingsContainerAsync = createAsyncThunk(
  'settings/getContainer',
  async () => {
    const response = await getSettingsContainer();
    return response.data;
  }
);

export const saveApplicationSettingsAsync = createAsyncThunk(
  'settings/saveApplicationSettings',
  async (state: ApplicationSettings) => {
    const response = await saveApplicationSettings(state);
    return response.data;
  }
);

export const setComponentSettingsAsync = createAsyncThunk(
  'settings/saveComponentSettings',
  async (newState: ComponentSettings) => {
    const response = await saveComponentSettings(newState);
    return response.data;
  }
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getSettingsContainerAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSettingsContainerAsync.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = 'idle';
      })
      .addCase(saveApplicationSettingsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveApplicationSettingsAsync.fulfilled, (state, action) => {
        state.settings.applicationSettings = action.payload;
        state.status = 'idle';
      })
      .addCase(setComponentSettingsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setComponentSettingsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.settings.componentSettings = state.settings.componentSettings.map(
          (obj) => {
            if (obj.uuid === action.payload.uuid) return action.payload;
            return obj;
          }
        );
      });
  },
});

export const settingsContainerSelector = (state: RootState) => {
  return state.settings.settings;
};

export const applicationSettingsSelector = (state: RootState) => {
  return state.settings.settings.applicationSettings;
};

export const componentSettingsSelector = (uuid: string) => {
  return createSelector(
    settingsContainerSelector,
    (settings) =>
      settings.componentSettings.find((obj) => obj.uuid === uuid) ||
      ({} as ComponentSettings)
  );
};

export default settingsSlice.reducer;
