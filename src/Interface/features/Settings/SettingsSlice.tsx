import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getSettings, setSettings } from './SettingsAPI';
import { IApplicationSettings } from '../../../Application/ComponentManager/IApplicationSettings';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store';

export interface SettingsState {
  settings: IApplicationSettings;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: SettingsState = {
  settings: {} as IApplicationSettings,
  status: 'idle',
};

export const getSettingsAsync = createAsyncThunk('settings/get', async () => {
  const response = await getSettings();
  return response.data;
});

export const saveSettingsAsync = createAsyncThunk(
  'settings/save',
  async (state: IApplicationSettings) => {
    const response = await setSettings(state);
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
      });
  },
});

export const settingsSelector = (state: RootState) => {
  return state.settings.settings;
};

export const componentNodeAccessSelector = (uuid: string) => {
  return createSelector(settingsSelector, (settings: IApplicationSettings) =>
    settings.componentNodeAccessWhitelist.includes(uuid)
  );
};

export default settingsSlice.reducer;
