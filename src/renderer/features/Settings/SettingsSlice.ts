import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getSettings, setComponentSettings, setSettings } from './SettingsAPI';
import {
  SettingsContainer,
  ComponentSettings,
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

export const getSettingsAsync = createAsyncThunk('settings/get', async () => {
  const response = await getSettings();
  return response.data;
});

export const saveSettingsAsync = createAsyncThunk(
  'settings/save',
  async (state: SettingsContainer) => {
    const response = await setSettings(state);
    return response.data;
  }
);

export const setComponentSettingsAsync = createAsyncThunk(
  'settings/setComponentSettings',
  async (newState: ComponentSettings) => {
    const response = await setComponentSettings(newState);
    return response.data;
  }
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getSettingsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getSettingsAsync.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = 'idle';
      })
      .addCase(saveSettingsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveSettingsAsync.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = 'idle';
      })
      .addCase(setComponentSettingsAsync.pending, (state) => {
        state.status = 'loading';
      });
  },
});

export const settingsSelector = (state: RootState) => {
  return state.settings.settings;
};

export const componentInstanceSettingsSelector = (uuid: string) => {
  return createSelector(
    settingsSelector,
    (settings: SettingsContainer) =>
      settings.componentSettings.find(
        (instanceSetting) => instanceSetting.uuid === uuid
      ) || ({} as ComponentSettings)
  );
};

export default settingsSlice.reducer;
