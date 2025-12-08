import { configureStore } from '@reduxjs/toolkit';
import postReducer from './features/postSlice';

// 创建 makeStore 函数，每次请求都需要新的 store 实例（SSR 的要求）
export const makeStore = () => {
  return configureStore({
    reducer: {
      posts: postReducer,
    },
  });
};