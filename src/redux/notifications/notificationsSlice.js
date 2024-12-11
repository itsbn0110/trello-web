import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
// Khởi tạo giá trị state của 1 slice trong redux
const initialState = {
  currentNotifications: null
};

// Các hành động gọi api (bất đồng bộ ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk

export const fetchInvitationsAPI = createAsyncThunk('notifications/fetchInvitationsAPI', async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/invitations`);
  return response.data;
});

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status });
    return response.data;
  }
);

// Khởi tạo 1 slice trong kho lưu trữ
export const notificationsSlice = createSlice({
  name: 'addNotification',
  initialState,
  // Xử lí dữ liệu đồng bộ
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null;
    },

    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload;
    },

    addNotification: (state, action) => {
      const incomingInvitation = action.payload;
      state.currentNotifications.unshift(incomingInvitation);
    }
  },
  // ExtraReducers : Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload;
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : [];
    });

    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      const incomingInvitation = action.payload;
      const getInvitation = state.currentNotifications.find((i) => i._id === incomingInvitation._id);
      getInvitation.boardInvitation = incomingInvitation.boardInvitation;
    });
  }
});

// Action creators are generated for each case reducer function
export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications;
};

export const notificationsReducer = notificationsSlice.reducer;
