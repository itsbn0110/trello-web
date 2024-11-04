import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
import { fetchBoardDetailsAPI } from '~/apis';
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    //  Tạm thời fix cứng boardId
    const boardId = '6724facbf02917d1414ee601';
    // call API
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
}

export default Board;
