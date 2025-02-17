import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { toast } from 'react-toastify';

import { API_ROOT } from '~/utils/constants';
// Khởi tạo giá trị state của 1 slice trong redux

const initialState = {
  currentUser: null
};

// Các hành động gọi api (bất đồng bộ ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data);
  return response.data;
});

export const logoutUserAPI = createAsyncThunk('user/logoutUserAPI', async (showSucceesMessage = true) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`);
  if (showSucceesMessage) {
    toast.success('Logged out successfully!');
  }
  return response.data;
});

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data);
  return response.data;
});

// Khởi tạo 1 slice trong kho lưu trữ
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Xử lí dữ liệu đồng bộ
  reducers: {},
  // ExtraReducers : Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây là response.data trả về ở trên trong trường hợp fullfilled
      const user = action.payload;
      state.currentUser = user;
    });

    builder.addCase(logoutUserAPI.fulfilled, (state, action) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
       */
      state.currentUser = null;
    });

    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.js => code sẽ điều hướng chuẩn về trang Login
       */
      const user = action.payload;
      state.currentUser = user;
    });
  }
});

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu
//  thông qua reducer (chạy đồng bộ)
// Actions này được redux tạo tự động theo tên của reducer nhé.

// Action creators are generated for each case reducer function
// export const {  } = userSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser;
};

export const userReducer = userSlice.reducer;
