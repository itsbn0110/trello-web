import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cloneDeep } from 'lodash';

import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import NoteAdd from '@mui/icons-material/NoteAdd';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { createNewColumnAPI } from '~/apis';
import { generatePlaceholderCard } from '~/utils/formatter';
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';
function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const [newColumnTitle, setNewColumnTitle] = useState('');

  const dispatch = useDispatch();
  // Không dùng state của components nữa mà chuyển qua sử dụng state của redux
  // const [board, setBoard] = useState(null);
  const board = useSelector(selectCurrentActiveBoard);
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title!', { position: 'bottom-left' });
      return;
    }
    // Tạo dữ liệu Column để gọi API
    const newColumnData = {
      title: newColumnTitle
    };

    // Gọi API tạo mới column và làm lại dữ liệu state Board
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
    // const newBoard = { ...board };
    const newBoard = cloneDeep(board);
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    dispatch(updateCurrentActiveBoard(newBoard));
    // Gọi API ở đây:
    toggleOpenNewColumnForm();
    setNewColumnTitle('');
  };

  return (
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          display: 'flex',
          bgcolor: 'inherit',
          height: '100%',
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {
            m: 2
          }
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}
          >
            {/* Box Add New Column */}
            <Button
              startIcon={<NoteAdd />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >
              Add New Column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <TextField
              id="outlined-search"
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => {
                setNewColumnTitle(e.target.value);
              }}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                fontSize="small"
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
}

export default ListColumns;
