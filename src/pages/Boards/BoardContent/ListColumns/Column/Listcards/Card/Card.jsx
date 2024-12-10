import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Card as MuiCard } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import GroupIcon from '@mui/icons-material/Group';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice';
function Card({ card }) {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  });
  const dndKitCardStyles = {
    // For sensor default has PointerSensor
    // touchAction: 'none',
    // if use CSS.transform will be bug like 'stretch'
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  };
  const shouldShowCardAction = () => {
    return card?.memberIds?.length || card?.comments?.length || card?.attachments?.length;
  };

  const setActiveCard = () => {
    // Cập nhật data cho ActiveCard trong Redux
    dispatch(updateCurrentActiveCard(card));
    dispatch(showModalActiveCard());
  };
  return (
    <MuiCard
      onClick={setActiveCard}
      sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset',
        display: card?.FE_PlaceholderCard ? 'none' : 'block',
        border: '1px solid transparent',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
      style={dndKitCardStyles}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {card?.cover && (
        <CardMedia
          sx={{
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px'
          }}
          component="img"
          alt="green iguana"
          height="140"
          image={card?.cover}
        />
      )}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      {!!shouldShowCardAction() && (
        <CardActions sx={{ p: '0 4 px 8px 4px' }}>
          {!!card?.memberIds?.length && (
            <Button size="small" startIcon={<GroupIcon />}>
              {card?.memberIds?.length}
            </Button>
          )}
          {!!card?.comments?.length && (
            <Button size="small" startIcon={<CommentIcon />}>
              {card?.comments?.length}
            </Button>
          )}
          {!!card?.attachments?.length && (
            <Button size="small" startIcon={<AttachmentIcon />}>
              {card?.attachments?.length}
            </Button>
          )}
        </CardActions>
      )}
    </MuiCard>
  );
}

export default Card;
