'use client' // 必须标记为客户端组件
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../lib/store';

export default function StoreProvider({ children }) {
  const storeRef = useRef();
  
  if (!storeRef.current) {
    // 确保 store 只被创建一次
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}