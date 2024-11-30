import { useEffect } from 'react';
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';

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
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';

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
    return <PageLoadingSpinner caption="Loading Board..." />;
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
