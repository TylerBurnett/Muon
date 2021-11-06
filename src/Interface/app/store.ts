import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import componentReducer from '../features/Components/ComponentSlice';
// eslint-disable-next-line import/no-cycle
import settingsReducer from '../features/Settings/SettingsSlice';

export const store = configureStore({
  reducer: { components: componentReducer, settings: settingsReducer },
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
