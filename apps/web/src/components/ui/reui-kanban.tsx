"use client";

import * as React from "react";
import type {
  CSSProperties,
  ReactNode,
} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  type AnimateLayoutChanges,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface KanbanContextProps<T> {
  columns: Record<string, T[]>;
  setColumns: (columns: Record<string, T[]>) => void;
  getItemId: (item: T) => string;
  columnIds: string[];
  activeId: UniqueIdentifier | null;
  setActiveId: (id: UniqueIdentifier | null) => void;
  findContainer: (id: UniqueIdentifier) => string | undefined;
  isColumn: (id: UniqueIdentifier) => boolean;
}

const KanbanContext = createContext<KanbanContextProps<any>>({
  columns: {},
  setColumns: () => {},
  getItemId: () => "",
  columnIds: [],
  activeId: null,
  setActiveId: () => {},
  findContainer: () => undefined,
  isColumn: () => false,
});

const ColumnContext = createContext<{
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  attributes: {} as DraggableAttributes,
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

const ItemContext = createContext<{
  listeners: DraggableSyntheticListeners | undefined;
  isDragging?: boolean;
  disabled?: boolean;
}>({
  listeners: undefined,
  isDragging: false,
  disabled: false,
});

const IsOverlayContext = createContext(false);

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export interface KanbanMoveEvent {
  event: DragEndEvent;
  activeContainer: string;
  activeIndex: number;
  overContainer: string;
  overIndex: number;
}

export interface KanbanRootProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  value: Record<string, T[]>;
  onValueChange: (value: Record<string, T[]>) => void;
  getItemValue: (item: T) => string;
  children: ReactNode;
  onMove?: (event: KanbanMoveEvent) => void;
}

function Kanban<T>({
  value,
  onValueChange,
  getItemValue,
  children,
  className,
  onMove,
  ...props
}: KanbanRootProps<T>) {
  const columns = value;
  const setColumns = onValueChange;
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columnIds = useMemo(() => Object.keys(columns), [columns]);

  const isColumn = useCallback(
    (id: UniqueIdentifier) => columnIds.includes(id as string),
    [columnIds]
  );

  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      if (isColumn(id)) return id as string;
      return columnIds.find((key) =>
        columns[key].some((item) => getItemValue(item) === id)
      );
    },
    [columns, columnIds, getItemValue, isColumn]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (onMove) {
        return;
      }

      const { active, over } = event;
      if (!over) return;

      if (isColumn(active.id)) return;

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      if (!activeContainer || !overContainer) {
        return;
      }

      if (activeContainer !== overContainer) {
        const activeItems = columns[activeContainer];
        const overItems = columns[overContainer];

        const activeIndex = activeItems.findIndex(
          (item: T) => getItemValue(item) === active.id
        );
        let overIndex = overItems.findIndex(
          (item: T) => getItemValue(item) === over.id
        );

        // If dropping on the column itself, not an item
        if (isColumn(over.id)) {
          overIndex = overItems.length;
        }

        const newActiveItems = [...activeItems];
        const newOverItems = [...overItems];
        const [movedItem] = newActiveItems.splice(activeIndex, 1);
        newOverItems.splice(overIndex, 0, movedItem);

        setColumns({
          ...columns,
          [activeContainer]: newActiveItems,
          [overContainer]: newOverItems,
        });
      } else {
        const container = activeContainer;
        const activeIndex = columns[container].findIndex(
          (item: T) => getItemValue(item) === active.id
        );
        const overIndex = columns[container].findIndex(
          (item: T) => getItemValue(item) === over.id
        );

        if (activeIndex !== overIndex) {
          setColumns({
            ...columns,
            [container]: arrayMove(columns[container], activeIndex, overIndex),
          });
        }
      }
    },
    [findContainer, getItemValue, isColumn, setColumns, columns, onMove]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      // Handle item move callback
      if (onMove && !isColumn(active.id)) {
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id);

        if (activeContainer && overContainer) {
          const activeIndex = columns[activeContainer].findIndex(
            (item: T) => getItemValue(item) === active.id
          );
          const overIndex = isColumn(over.id)
            ? columns[overContainer].length
            : columns[overContainer].findIndex(
                (item: T) => getItemValue(item) === over.id
              );

          onMove({
            event,
            activeContainer,
            activeIndex,
            overContainer,
            overIndex,
          });
        }
        return;
      }

      // Handle column reordering
      if (isColumn(active.id) && isColumn(over.id)) {
        const activeIndex = columnIds.indexOf(active.id as string);
        const overIndex = columnIds.indexOf(over.id as string);
        if (activeIndex !== overIndex) {
          const newOrder = arrayMove(
            Object.keys(columns),
            activeIndex,
            overIndex
          );
          const newColumns: Record<string, T[]> = {};
          newOrder.forEach((key) => {
            newColumns[key] = columns[key];
          });
          setColumns(newColumns);
        }
        return;
      }

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      // Handle item reordering within the same column
      if (
        activeContainer &&
        overContainer &&
        activeContainer === overContainer
      ) {
        const container = activeContainer;
        const activeIndex = columns[container].findIndex(
          (item: T) => getItemValue(item) === active.id
        );
        const overIndex = columns[container].findIndex(
          (item: T) => getItemValue(item) === over.id
        );

        if (activeIndex !== overIndex) {
          setColumns({
            ...columns,
            [container]: arrayMove(columns[container], activeIndex, overIndex),
          });
        }
      }
    },
    [
      columnIds,
      columns,
      findContainer,
      getItemValue,
      isColumn,
      setColumns,
      onMove,
    ]
  );

  const contextValue = useMemo(
    () => ({
      columns,
      setColumns,
      getItemId: getItemValue,
      columnIds,
      activeId,
      setActiveId,
      findContainer,
      isColumn,
    }),
    [
      columns,
      setColumns,
      getItemValue,
      columnIds,
      activeId,
      findContainer,
      isColumn,
    ]
  );

  return (
    <KanbanContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div
          data-slot="kanban"
          data-dragging={activeId !== null}
          className={cn(activeId !== null && "cursor-grabbing!", className)}
          {...props}
        >
          {children}
        </div>
      </DndContext>
    </KanbanContext.Provider>
  );
}

export type KanbanBoardProps = React.HTMLAttributes<HTMLDivElement>;

function KanbanBoard({ className, children, ...props }: KanbanBoardProps) {
  const { columnIds } = useContext(KanbanContext);

  return (
    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
      <div
        data-slot="kanban-board"
        className={cn("grid auto-rows-fr gap-4 sm:grid-cols-3", className)}
        {...props}
      >
        {children}
      </div>
    </SortableContext>
  );
}

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

function KanbanColumn({
  value,
  className,
  children,
  disabled,
  ...props
}: KanbanColumnProps) {
  const isOverlay = useContext(IsOverlayContext);

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges,
  });

  if (isOverlay) {
    return (
      <ColumnContext.Provider
        value={{
          attributes: {} as DraggableAttributes,
          listeners: undefined,
          isDragging: true,
          disabled: false,
        }}
      >
        <div
          data-slot="kanban-column"
          data-value={value}
          data-dragging={true}
          className={cn("group/kanban-column flex flex-col", className)}
          {...props}
        >
          {children}
        </div>
      </ColumnContext.Provider>
    );
  }

  const { activeId, isColumn } = useContext(KanbanContext);
  const isColumnDragging = activeId ? isColumn(activeId) : false;

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <ColumnContext.Provider
      value={{ attributes, listeners, isDragging: isColumnDragging, disabled }}
    >
      <div
        data-slot="kanban-column"
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        className={cn(
          "group/kanban-column flex flex-col",
          isSortableDragging && "opacity-50 z-50",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ColumnContext.Provider>
  );
}

export interface KanbanItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

function KanbanItem({
  value,
  className,
  children,
  disabled,
  ...props
}: KanbanItemProps) {
  const isOverlay = useContext(IsOverlayContext);

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging,
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges,
  });

  if (isOverlay) {
    return (
      <ItemContext.Provider
        value={{ listeners: undefined, isDragging: true, disabled: false }}
      >
        <div
          data-slot="kanban-item"
          data-value={value}
          data-dragging={true}
          className={cn(className)}
          {...props}
        >
          {children}
        </div>
      </ItemContext.Provider>
    );
  }

  const { activeId, isColumn } = useContext(KanbanContext);
  const isItemDragging = activeId ? !isColumn(activeId) : false;

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <ItemContext.Provider
      value={{ listeners, isDragging: isItemDragging, disabled }}
    >
      <div
        data-slot="kanban-item"
        data-value={value}
        data-dragging={isSortableDragging}
        data-disabled={disabled}
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(
          isSortableDragging && "opacity-50 z-50",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export interface KanbanColumnContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function KanbanColumnContent({
  value,
  className,
  children,
  ...props
}: KanbanColumnContentProps) {
  const { columns, getItemId } = useContext(KanbanContext);

  const itemIds = useMemo(
    () => columns[value].map(getItemId),
    [columns, getItemId, value]
  );

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <div
        data-slot="kanban-column-content"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </SortableContext>
  );
}

export interface KanbanOverlayProps extends Omit<
  React.ComponentProps<typeof DragOverlay>,
  "children"
> {
  children?:
    | ReactNode
    | ((params: {
        value: UniqueIdentifier;
        variant: "column" | "item";
      }) => ReactNode);
}

function KanbanOverlay({ children, className, ...props }: KanbanOverlayProps) {
  const { activeId, isColumn } = useContext(KanbanContext);
  const [mounted, setMounted] = useState(false);

  React.useLayoutEffect(() => setMounted(true), []);

  const variant = activeId ? (isColumn(activeId) ? "column" : "item") : "item";

  const content =
    activeId && children
      ? typeof children === "function"
        ? children({ value: activeId, variant })
        : children
      : null;

  if (!mounted) return null;

  return createPortal(
    <DragOverlay
      className={cn("z-50", activeId && "cursor-grabbing", className)}
      {...props}
    >
      <IsOverlayContext.Provider value={true}>
        {content}
      </IsOverlayContext.Provider>
    </DragOverlay>,
    document.body
  );
}

export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanItem,
  KanbanColumnContent,
  KanbanOverlay,
};
