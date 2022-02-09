import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import {
  getSettings,
  setComponentActiveState,
  setComponentNodeAccess,
  setSettings,
} from './SettingsAPI';
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

export const setComponentNodeAccessAsync = createAsyncThunk(
  'settings/setComponentNodeAccess',
  async (state: { uuid: string; newState: boolean }) => {
    const response = await setComponentNodeAccess(state.uuid, state.newState);
    return response.data;
  }
);

export const setComponentActiveStateAsync = createAsyncThunk(
  'settings/setComponentActiveState',
  async (state: { uuid: string; newState: boolean }) => {
    const response = await setComponentActiveState(state.uuid, state.newState);
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

      .addCase(setComponentNodeAccessAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setComponentNodeAccessAsync.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = 'idle';
      })

      .addCase(setComponentActiveStateAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(setComponentActiveStateAsync.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.status = 'idle';
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
