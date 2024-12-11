// Redux State management tool
import { configureStore } from '@reduxjs/toolkit';
import { activeBoardReducer } from './activeBoard/activeBoardSlice';
import { userReducer } from './user/userSlice';

// https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
// https://www.npmjs.com/package/redux-persist
// https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { activeCardReducer } from './activeCard/activeCardSlice';
import { notificationsReducer } from './notifications/notificationsSlice';
const rootPersistConfig = {
  key: 'root', // key của persist do chúng ta chỉ định, cứ để mặc định là root cx đc
  storage: storage,
  whitelist: ['user']
};

// Combine các reducers trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  activeCard: activeCardReducer,
  user: userReducer,
  notifications: notificationsReducer
});
const persistedReducers = persistReducer(rootPersistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Bỏ qua các action liên quan đến persist
        ignoredPaths: ['register'] // Bỏ qua path chứa giá trị không chuỗi hóa
      }
    })
});
