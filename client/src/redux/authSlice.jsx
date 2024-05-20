import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { readYearsTermFromday } from '../../src/api/years_termApi';

const initialState = {
  user: null,
  isAuthenticated: false,
  findYearTerm: "",   
};


//--------------api
export const fetchCurrentYearTerm = createAsyncThunk(
  'auth/fetchCurrentYearTerm',
  async () => {
    const today = new Date();
    const todayFormatted = today.toISOString().split("T")[0];
    const response = await readYearsTermFromday(todayFormatted);
    return response.data.length > 0 ? response.data[0] : null;
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    LOGIN: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    LOGOUT: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentYearTerm.fulfilled, (state, action) => {
      state.findYearTerm = action.payload;
    });
  },
});

export const { LOGIN, LOGOUT } = authSlice.actions;

export default authSlice.reducer;
