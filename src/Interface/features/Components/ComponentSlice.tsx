import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store';
import { IComponentSettingsMeta } from '../../../Application/Component/IComponentSettings';
import { getComponent, getComponents, saveComponent } from './ComponentAPI';

export interface ComponentState {
  components: IComponentSettingsMeta[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ComponentState = {
  components: [],
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const getComponentsAsync = createAsyncThunk(
  'components/getComponents',
  async () => {
    const response = await getComponents();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const getComponentAsync = createAsyncThunk(
  'components/getComponent',
  async (id: string) => {
    const response = await getComponent(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const saveComponentAsync = createAsyncThunk(
  'components/saveComponent',
  async (state: IComponentSettingsMeta) => {
    const response = await saveComponent(state);
    // The value we return becomes the `fulfilled` action payload
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
    (components: IComponentSettingsMeta[]) =>
      components[
        components.findIndex(
          (component: IComponentSettingsMeta) => component.uuid === id
        )
      ]
  );
};

export default componentsSlice.reducer;
