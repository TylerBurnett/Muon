import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store';
import { ComponentConfig } from '../../../main/Data/ComponentConfig';
import { getComponent, getComponents, saveComponent } from './ComponentAPI';

export interface ComponentState {
  components: ComponentConfig[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ComponentState = {
  components: [],
  status: 'idle',
};

export const getComponentsAsync = createAsyncThunk(
  'components/getComponents',
  async () => {
    const response = await getComponents();
    return response.data;
  }
);

export const getComponentAsync = createAsyncThunk(
  'components/getComponent',
  async () => {
    const response = await getComponent();
    return response.data;
  }
);

export const saveComponentAsync = createAsyncThunk(
  'components/saveComponent',
  async (state: ComponentConfig) => {
    const response = await saveComponent(state);
    return response.data;
  }
);

export const componentsSlice = createSlice({
  name: 'components',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getComponentsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getComponentsAsync.fulfilled, (state, action) => {
        state.components = action.payload;
        state.status = 'idle';
      })

      .addCase(getComponentAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getComponentAsync.fulfilled, (state, action) => {
        state.components[
          state.components.findIndex(
            (component) => component.name === action.payload.name
          )
        ] = action.payload;
        state.status = 'idle';
      })

      .addCase(saveComponentAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveComponentAsync.fulfilled, (state, action) => {
        state.components[
          state.components.findIndex(
            (component) => component.name === action.payload.name
          )
        ] = action.payload;
        state.status = 'idle';
      });
  },
});

export const componentsSelector = (state: RootState) => {
  return state.components.components;
};

export const componentSelector = (id: string) => {
  return createSelector(
    componentsSelector,
    (components: ComponentConfig[]) =>
      components[
        components.findIndex(
          (component: ComponentConfig) => component.uuid === id
        )
      ]
  );
};

export default componentsSlice.reducer;
