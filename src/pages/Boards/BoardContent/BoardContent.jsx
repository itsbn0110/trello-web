import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListColumns from './ListColumns/ListColumns';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { mapOrder } from '~/utils/sorts';
import { arrayMove } from '@dnd-kit/sortable';
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
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);
  const handleDragEnd = (event) => {
    // console.log('hanldeDragEnd', event);
    const { active, over } = event;
    if (!over) return;
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
      setActiveDragItemId(null);
      setActiveDragItemType(null);
      setActiveDragItemData(null);
    }
  };

  const handleDragStart = (event) => {
    console.log(event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN);
    setActiveDragItemData(event?.active?.data?.current);
  };

  // console.log('activeDragItemId', activeDragItemId);
  // console.log('activeDragItemType', activeDragItemType);
  // console.log('activeDragItemData', activeDragItemData);

  // Animation when dropping an element - Test by dragging and dropping directly and looking at the overLay placeholder
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
