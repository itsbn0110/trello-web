import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis';
// import { mockData } from '~/apis/MockData';
import { generatePlaceholderCard } from '~/utils/formatter';
import { isEmpty } from 'lodash';
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    //  Tạm thời fix cứng boardId
    const boardId = '6724facbf02917d1414ee601';
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      // Cần xử lí vấn đề kéo thả vào một column rỗng
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        }
      });
      setBoard(board);
    });
  }, []);
  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu StateBoard
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    });
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];
    // Cập nhật state board
    // Thay vì gọi lại api fetchBoardDetailsAPI thì bên phía front-end sẽ cập nhật luôn column được trả về sau khi tạo column mới,
    //  thêm dữ liệu vào board và set lại state Board

    // Còn 1 cách nữa bên phía đội BE có thể hỗ trợ và trả về toàn bộ Board luôn dù đây là api tạo column hay card
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    });
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId);
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard._id);
    }
    setBoard(newBoard);
  };
  // Cập nhật state board
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} />
    </Container>
  );
}

export default Board;
