'use client'; // 必须标记为客户端组件

import { Button, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const { confirm } = Modal;

export default function PostActions({ postId }) {
  const router = useRouter();

  const handleDelete = () => {
    confirm({
      title: '确定要删除这篇文章吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后无法恢复（且会同步清除缓存）。',
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/posts/${postId}`);
          message.success('删除成功');
          router.push('/'); // 回到首页
          router.refresh(); // 刷新数据
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      {/* 编辑按钮：跳转到编辑页 */}
      <Button 
        icon={<EditOutlined />} 
        onClick={() => {router.push(`/posts/${postId}/edit`)}}
      >
        编辑
      </Button>

      {/* 删除按钮 */}
      <Button 
        danger 
        icon={<DeleteOutlined />} 
        onClick={handleDelete}
      >
        删除
      </Button>
    </div>
  );
}