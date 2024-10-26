import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import NoteAdd from '@mui/icons-material/NoteAdd';
function ListColumns({ columns }) {
  return (
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
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
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
    </Box>
  );
}

export default ListColumns;
