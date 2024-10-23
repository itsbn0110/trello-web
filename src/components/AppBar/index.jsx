import Box from '@mui/material/Box';
import ModeSelect from '~/components/ModeSelect';
import AppsIcon from '@mui/icons-material/Apps';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import WorkSpaces from './Menus/WorkSpaces';
import Recent from './Menus/Recent';
import Starred from './Menus/Starred';
import Templates from './Menus/Templates';
import Profiles from './Menus/Profiles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

function AppBar() {
  return (
    <Box
      sx={{
        height: (theme) => theme.trello.appBarHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'auto',
        paddingX: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'primary.main' }} />
          <Typography variant="span" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>
            Trello
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <WorkSpaces />
          <Recent />
          <Starred />
          <Templates />
          <Button variant="outlined" startIcon={<LibraryAddIcon />}>
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <TextField id="outlined-search" label="Search..." type="search" size="small" sx={{ minWidth: '120px' }} />
        <ModeSelect />

        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Notifications">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  );
}

export default AppBar;
