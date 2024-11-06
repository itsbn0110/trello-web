import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI
} from '~/apis';
// import { mockData } from '~/apis/MockData';
import { generatePlaceholderCard } from '~/utils/formatter';
import { isEmpty } from 'lodash';
import { mapOrder } from '~/utils/sorts';
import Typography from '@mui/material/Typography';
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    //  Tạm thời fix cứng boardId
    const boardId = '672b1ed01b5582d5310145a2';
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
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
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }

    // Cập nhật state board
    setBoard(newBoard);
  };

  // Func này gọi Api khi kéo thả column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Gọi Api Update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    });
  };

  /**
   * Khi di chuyển card trong cùng column:
   * Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó ( thay đổi vị trí trong mảng )
   */

  const moveCardInTheSameColumn = (dndOrderCards, dndOrderCardIds, columnId) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderCards;
      columnToUpdate.cardOrderIds = dndOrderCardIds;
      // Cập nhật state board
      setBoard(newBoard);

      // gọi API update column
      updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderCardIds });
    }
  };

  /**
   * Cập nhật mảng cardOrderIDs của Column ban đầu chứa nó, bản chất là xóa cái _id của Card ra khỏi mảng)
   * Cập nhật mảng cardOrderIds của Column tiếp theo (Bản chất là thêm _id của Card vào mảng)
   * Cập nhật lại trường columnId mới của cái Card đã kéo
   * => Làm 1 API support riêng
   */
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    // Xử lí vấn đề khi kéo card cuối cùng ra khỏi column, column rỗng sẽ có placeholder-card xuất hiện, cần xóa đi trước khi gửi cho BE
    let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds;

    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = [];
    // Gọi API xử lý
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
    });
  };

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography> Loading Board .... </Typography>
      </Box>
    );
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}
export default Board;
