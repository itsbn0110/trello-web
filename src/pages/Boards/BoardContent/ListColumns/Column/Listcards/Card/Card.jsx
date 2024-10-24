import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
function Card({ hideMedia }) {
  if (hideMedia) {
    return (
      <MuiCard sx={{ cursor: 'pointer', boxShadow: '0 1px 1px rgba(0,0,0,0.2)', overflow: 'unset' }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card Test 01</Typography>
        </CardContent>
      </MuiCard>
    );
  }
  return (
    <MuiCard sx={{ cursor: 'pointer', boxShadow: '0 1px 1px rgba(0,0,0,0.2)', overflow: 'unset' }}>
      <CardMedia
        sx={{
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px'
        }}
        component="img"
        alt="green iguana"
        height="140"
        image="https://camo.githubusercontent.com/80180ecdadc4a60d45e3ad258644001ad647f424ab6def3d8196312db75ae206/68747470733a2f2f692e70696e696d672e636f6d2f373336782f61662f66342f33362f61666634333634336336323137616666333666306562323231316139323662382e6a7067"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>Code cùng BaoNgooDev</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4 px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon />}>
          20
        </Button>
        <Button size="small" startIcon={<CommentIcon />}>
          15
        </Button>
        <Button size="small" startIcon={<AttachmentIcon />}>
          10
        </Button>
      </CardActions>
    </MuiCard>
  );
}

export default Card;
