import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 异步操作：获取文章列表
// createAsyncThunk 会自动生成 pending, fulfilled, rejected 三种状态
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get('http://localhost:5000/api/posts');
    return response.data.data; // 返回后端给的数据数组
});

const postSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {
        // 这里可以写同步的 reducer，比如 addPostLocal
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default postSlice.reducer;