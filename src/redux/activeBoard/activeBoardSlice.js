import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizedAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';
// Khởi tạo giá trị state của 1 slice trong redux
const initialState = {
  currentActiveBoard: null
};

import { isEmpty } from 'lodash';
import { mapOrder } from '~/utils/sorts';
import { generatePlaceholderCard } from '~/utils/formatter';

// Các hành động gọi api (bất đồng bộ ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
// https://redux-toolkit.js.org/api/createAsyncThunk

export const fetchBoardDetailsAPI = createAsyncThunk('activeBoard/fetchBoardDetailsAPI', async (boardId) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`);
  return response.data;
});

// Khởi tạo 1 slice trong kho lưu trữ
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Xử lí dữ liệu đồng bộ
  reducers: {
    // Luôn luôn để ngoặc nhọn {} cho những function reducer vì đó là 1 rule của Redux
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta nên gán nó vào 1 biến có nghĩa hơn
      const board = action.payload;

      // Xử lí dữ liệu khi cần thiết
      // Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board;
    },
    updateCardInBoard: (state, action) => {
      // Update nested data
      // https://redux-toolkit.js.org/usage/immer-reducers#updating-nested-data
      const incomingCard = action.payload;
      // Tìm dần từ board > column > card
      const column = state.currentActiveBoard.columns.find((i) => i._id === incomingCard.columnId);
      if (column) {
        const card = column.cards.find((i) => incomingCard._id === i._id);
        if (card) {
          Object.keys(incomingCard).forEach((key) => {
            card[key] = incomingCard[key];
          });
        }
      }
    }
  },
  // ExtraReducers : Nơi xử lí dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây là response.data được trả về fetchBoardDetailsAPI
      let board = action.payload;

      // Thành viên trong board sẽ gộp lại của 2 mảng owners và members

      board.FE_allUser = board.owners.concat(board.members);

      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

      board.columns.forEach((column) => {
        // Cần xử lí vấn đề kéo thả vào một column rỗng
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });
      //   Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board;
    });
  }
});

// Actions: là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu
//  thông qua reducer (chạy đồng bộ)
// Actions này được redux tạo tự động theo tên của reducer nhé.

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions;

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard;
};

export const activeBoardReducer = activeBoardSlice.reducer;
