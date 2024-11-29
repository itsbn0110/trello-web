import { useEffect } from 'react';
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Typography from '@mui/material/Typography';
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis';
// import { mockData } from '~/apis/MockData';
import { cloneDeep } from 'lodash';
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';

function Board() {
  const dispatch = useDispatch();
  // Không dùng state của components nữa mà chuyển qua sử dụng state của redux
  // const [board, setBoard] = useState(null);
  const board = useSelector(selectCurrentActiveBoard);

  const { boardId } = useParams();

  useEffect(() => {
    dispatch(fetchBoardDetailsAPI(boardId));
  }, [dispatch, boardId]);

  // Func này gọi Api khi kéo thả column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    // shallow copy nhưng các phần tử con không có phần tử nào dùng push hay các phương thức làm thay đổi phần tử cũ nên là không dính immutability
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    dispatch(updateCurrentActiveBoard(newBoard));

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
    //  Cannot assign to read only property 'cards' of object lỗi này xảy ra vì là cards nằm quá sâu trong 1 object nên gán lại card sẽ bị dính lỗi này
    const newBoard = cloneDeep(board);
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId);
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderCards;
      columnToUpdate.cardOrderIds = dndOrderCardIds;
      // Cập nhật state board
      dispatch(updateCurrentActiveBoard(newBoard));

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
    dispatch(updateCurrentActiveBoard(newBoard));

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

  // Xử lý xóa một column và card bên trong nó

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#e8f5e9',
          gap: 4
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={80} sx={{ color: '#4caf50' }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 40, color: '#4caf50' }} />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Loading Board
            <span
              style={{
                animation: 'dots 1.5s steps(5, end) infinite',
                fontSize: '1.5rem'
              }}
            >
              ...
            </span>
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: '400px' }}>
            It might take you a little time or not 😅. You need to keep refreshing the webpage frequently 👉👈.
          </Typography>
        </Box>

        <style>
          {`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            @keyframes dots {
              0%, 20% { content: ''; }
              40% { content: '.'; }
              60% { content: '..'; }
              80%, 100% { content: '...'; }
            }
          `}
        </style>
      </Box>
    );
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // createNewColumn={createNewColumn}

        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}
export default Board;
