import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { mapOrder } from '~/utils/sorts';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep } from 'lodash';
import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/Listcards/Card/Card';

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
};

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // if only use PointerSenSor by default, have to combine with CSS attributes : 'touch-action: none' on DnD elements. But the bug still exists
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });
  // require mouse move 10px to trigger event, fix the case of being call event when click
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  // Press and hold for 250ms  will trigger the event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 500, tolerance: 5 } });

  // should use mouse sensors and touch sensors to have the best experience on mobile

  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);
  // At the same time, there is only one element is being dragged (column or card)
  const [activeDragItem, setActiveDragItem] = useState({
    id: null,
    type: null,
    data: null
  });
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column.cards.map((card) => card._id)?.includes(cardId));
  };

  const handleDragOver = (event) => {
    if (activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;

    // console.log('handleDragOver: ', event);

    const { active, over } = event;
    if (!active || !over) return;

    // activeDraggingCard is the card is being drag
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active;

    // overCard is the card that activeDraggingCard is dragging over
    const { id: overCardId } = over;

    // find 2 columns by cardID
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // if not exsists 1 in 2 columns, do nothing, avoid crashing web
    if (!activeColumn || !overColumn) return;

    // handle logic when drag column over 2 different columns,
    // if drag card within 1 column , do nothing!
    // this is a handler when (handleDragOVer),
    // and handling when completely drag is another problem in (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId);
        let newCardIndex;
        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newCardIndex = over >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;
        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id);
        const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id);

        if (nextActiveColumn) {
          // Delete card in active column
          nextActiveColumn.cards = nextActiveColumn.cards.filter((card) => card._id !== activeDraggingCardId);

          // Update cardOrderIds array
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id);
        }

        if (nextOverColumn) {
          // Check card is being drag whether exists in overColumn? , if exsist, need to delete first
          nextOverColumn.cards = nextOverColumn.cards.filter((card) => card._id !== activeDraggingCardId);

          // Next step, add dragging card to overColumn into new index position
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData);

          nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id);
        }
        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event) => {
    // console.log('hanldeDragEnd', event);

    if (activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return;
    }
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      // take the old position (from active obj)
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      // use arrayMove to arrange the original column array
      // Code arrayMove function : dnd-kit/packages/sortable/src/ulilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // 2 console.log data will be use to hanlde API
      // console.log('dndOrderedColumns', dndOrderedColumns);
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds);

      // update state columns after drag and drop
      setOrderedColumns(dndOrderedColumns);
      setActiveDragItem({
        id: null,
        type: null,
        data: null
      });
    }
  };

  const handleDragStart = (event) => {
    // console.log(event);
    const itemType = event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN;
    setActiveDragItem({
      id: event?.active?.id,
      type: itemType,
      data: event?.active?.data?.current
    });
  };

  // console.log('activeDragItemId', activeDragItemId);
  // console.log('activeDragItemType', activeDragItemType);
  // console.log('activeDragItemData', activeDragItemData);

  // Animation when dropping an element - Test by dragging and dropping directly and looking at the overLay placeholder
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#0f71d2'),
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItem.type && null}
          {activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItem.data} />}
          {activeDragItem.type === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItem.data} />}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
