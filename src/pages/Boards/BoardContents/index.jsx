import Box from '@mui/material/Box';

function BoardContent() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
        backgroundColor: 'primary.main'
      }}
    >
      Board Content
    </Box>
  );
}

export default BoardContent;
