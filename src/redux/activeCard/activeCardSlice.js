import { createSlice } from '@reduxjs/toolkit';
// Khởi tạo giá trị state của 1 slice trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
};

// Khởi tạo 1 slice trong kho lưu trữ
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Xử lí dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true;
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload;
      state.currentActiveCard = fullCard;
    },

    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
      state.isShowModalActiveCard = false;
    }
  }
});

export const { updateCurrentActiveCard, clearAndHideCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions;

export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};
export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard;
};

export const activeCardReducer = activeCardSlice.reducer;
