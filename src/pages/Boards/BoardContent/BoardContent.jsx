import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { mapOrder } from '~/utils/sorts';
function BoardContent({ board }) {
  const oderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id');
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0f71d2'),
        p: '10px 0'
      }}
    >
      <ListColumns columns={oderedColumns} />
    </Box>
  );
}

export default BoardContent;
