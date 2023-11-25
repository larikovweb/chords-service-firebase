import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { trackAPI } from '../services/TracksService';

const rootReducer = combineReducers({
  [trackAPI.reducerPath]: trackAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(trackAPI.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
