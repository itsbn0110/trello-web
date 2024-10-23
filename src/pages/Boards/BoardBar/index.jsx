import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const CHIP_STYLES = {
  borderRadius: '4px',
  border: 'none',
  bgcolor: 'transparent',
  color: 'white',
  paddingX: '5px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgColor: 'primary.50'
  }
};
function BoardBar() {
  return (
    <Box
      sx={{
        height: (theme) => theme.trello.boardBarHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'auto',
        borderBottom: '1px solid white',
        paddingX: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Chip icon={<DashboardIcon />} label="BaoNgoDev Board" sx={CHIP_STYLES} clickable />
        <Chip icon={<VpnLockIcon />} label="Public/Private Workspace" sx={CHIP_STYLES} clickable />
        <Chip icon={<AddToDriveIcon />} label="BaoNgoDev Board" sx={CHIP_STYLES} clickable />
        <Chip icon={<BoltIcon />} label="Automation" sx={CHIP_STYLES} clickable />
        <Chip icon={<FilterListIcon />} label="Filters" sx={CHIP_STYLES} clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddAlt1Icon sx={{ width: '18px', height: '20px' }} />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Share
        </Button>
        <AvatarGroup
          max={7}
          total={10}
          sx={{ gap: '10px', '& .MuiAvatar-root': { width: 36, height: 36, fontSize: 16, border: 'none' } }}
        >
          <Tooltip title="HoaXu">
            <Avatar
              alt="HoaXu"
              src="https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/1e8fbb1a32c113562e037e0835d2f64e.jpeg?lk3s=a5d48078&nonce=66911&refresh_token=3ad10bc2c2e17d12d5c5dcd10a3acbdd&x-expires=1729864800&x-signature=1EJ7k%2BloihXLbgAIXIaClcRjZUg%3D&shp=a5d48078&shcp=81f88b70"
            />
          </Tooltip>
          <Tooltip title="Bảo Ngô">
            <Avatar alt="BaoNgo" src="https://avatars.githubusercontent.com/u/181921020?v=4" />
          </Tooltip>
          <Tooltip title="Rose">
            <Avatar
              alt="Rose"
              src="https://i.pinimg.com/enabled_hi/564x/f6/cb/78/f6cb78a2affe7954a5c699313a382278.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/564x/a7/67/47/a767478c979c6274c1de6dab0066606d.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/736x/65/fe/29/65fe29d7c661a92f5c716b7f234444cd.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/736x/9c/b2/11/9cb211670c950870669fd722479a1e35.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/564x/73/88/64/73886422a42cb76fa30822d632ef4b15.jpg"
            />
          </Tooltip>
          <Tooltip title="HoaXu">
            <Avatar
              alt="HoaXu"
              src="https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/1e8fbb1a32c113562e037e0835d2f64e.jpeg?lk3s=a5d48078&nonce=66911&refresh_token=3ad10bc2c2e17d12d5c5dcd10a3acbdd&x-expires=1729864800&x-signature=1EJ7k%2BloihXLbgAIXIaClcRjZUg%3D&shp=a5d48078&shcp=81f88b70"
            />
          </Tooltip>
          <Tooltip title="Bảo Ngô">
            <Avatar alt="BaoNgo" src="https://avatars.githubusercontent.com/u/181921020?v=4" />
          </Tooltip>
          <Tooltip title="Rose">
            <Avatar
              alt="Rose"
              src="https://i.pinimg.com/enabled_hi/564x/f6/cb/78/f6cb78a2affe7954a5c699313a382278.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/564x/a7/67/47/a767478c979c6274c1de6dab0066606d.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/736x/65/fe/29/65fe29d7c661a92f5c716b7f234444cd.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/736x/9c/b2/11/9cb211670c950870669fd722479a1e35.jpg"
            />
          </Tooltip>
          <Tooltip title="Zhāng Ruò Nán / 章若楠">
            <Avatar
              alt="Zhāng Ruò Nán / 章若楠"
              src="https://i.pinimg.com/564x/73/88/64/73886422a42cb76fa30822d632ef4b15.jpg"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
