'use client'; // 错误边界组件必须是 Client Component

import { useEffect } from 'react';
import { Button, Result } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('🚨 SSR 渲染发生严重错误:', error);
  }, [error]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status="500"
        title="服务暂时不可用 (SSR 降级)"
        subTitle="服务端预渲染遇到问题，可能是后端服务繁忙或维护中。"
        extra={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button 
                type="primary" 
                key="console" 
                icon={<ReloadOutlined />} 
                onClick={
                  // 尝试恢复：reset() 会尝试重新渲染该路段
                  () => reset()
                }
            >
              尝试刷新
            </Button>
            <Button key="back" onClick={() => window.location.href = '/'}>
              返回首页
            </Button>
          </div>
        }
      >
          <div style={{ background: '#f5f5f5', padding: 15, borderRadius: 8, maxWidth: 600, margin: '0 auto', textAlign: 'left' }}>
              <p>错误详情 (开发模式可见):</p>
              <code style={{ color: 'red' }}>{error.message}</code>
          </div>
      </Result>
    </div>
  );
}