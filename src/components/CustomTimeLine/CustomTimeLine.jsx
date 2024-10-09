"use client";
import React, { useState } from "react";
import moment from "moment";

import Timeline from "react-calendar-timeline";
import InfoLabel from "./InfoLabel";
import generateFakeData from "./generate-fake-data";

const keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end",
  groupLabelKey: "title",
};

const CustomTimeLine = () => {
  const { groups, items: initialItems } = generateFakeData();
  const defaultTimeStart = moment().startOf("day").toDate();
  const defaultTimeEnd = moment().startOf("day").add(1, "day").toDate();

  const [items, setItems] = useState(initialItems);
  const [draggedItem, setDraggedItem] = useState(undefined);

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const group = groups[newGroupOrder];
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id,
            }
          : item,
      ),
    );
    setDraggedItem(undefined);
    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  const handleItemResize = (itemId, time, edge) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time,
            }
          : item,
      ),
    );
    setDraggedItem(undefined);
    console.log("Resized", itemId, time, edge);
  };

  const handleItemDrag = ({ eventType, itemId, time, edge, newGroupOrder }) => {
    let item = draggedItem ? draggedItem.item : undefined;
    if (!item) {
      item = items.find((i) => i.id === itemId);
    }
    setDraggedItem({ item: item, group: groups[newGroupOrder], time });
  };

  return (
    <React.Fragment>
      <Timeline
        groups={groups}
        items={items}
        keys={keys}
        fullUpdate
        itemTouchSendsClick={false}
        stackItems
        itemHeightRatio={0.75}
        canMove={true}
        canResize={"both"}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onItemDrag={handleItemDrag}
      />
      {draggedItem && (
        <InfoLabel
          item={draggedItem.item}
          group={draggedItem.group}
          time={draggedItem.time}
        />
      )}
    </React.Fragment>
  );
};

export default CustomTimeLine;
