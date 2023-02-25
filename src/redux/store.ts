import {configureStore } from '@reduxjs/toolkit';
import {
    TypedUseSelectorHook, useDispatch as useAppDispatch,
    useSelector as useAppSelector
} from 'react-redux';
import contractsReducer from 'src/redux/slices/contracts';

const rootReducer = {
  contracts: contractsReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
const { dispatch } = store;
const useDispatch = () => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;
export { store, dispatch, useSelector, useDispatch };
