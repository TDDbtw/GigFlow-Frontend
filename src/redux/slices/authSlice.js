import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const checkUser = createAsyncThunk('auth/checkUser', async (_, thunkAPI) => {
    try {
        const { data } = await api.get('/auth/me');
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
    try {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, thunkAPI) => {
    try {
        const { data } = await api.post('/auth/register', { name, email, password });
        return data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    await api.post('/auth/logout');
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: true,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(checkUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload?.message || 'Login failed';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.error = action.payload?.message || 'Registration failed';
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
