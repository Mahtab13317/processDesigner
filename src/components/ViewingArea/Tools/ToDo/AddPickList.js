import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../Interfaces.css";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DragIndicatorOutlinedIcon from "@material-ui/icons/DragIndicatorOutlined";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function AddPickList(props) {
  let { t } = useTranslation();
  let [pickList, setPickList] = useState([{ picklistId: 1, name: "" }]);
  const handleInputOnchange = (event, list) => {
    let tempList = [...pickList];
    tempList.map((el) => {
      if (el.picklistId === list.picklistId) {
        el.name = event.target.value;
      }
    });

    setPickList(tempList);
  };

  const deletePickList = (index) => {
    let temp = [...pickList];
    temp.splice(index, 1);
    setPickList(temp);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const pickListArray = [...pickList];
    const [reOrderedPickListItem] = pickListArray.splice(source.index, 1);
    pickListArray.splice(destination.index, 0, reOrderedPickListItem);
    setPickList(pickListArray);
  };

  useEffect(() => {
    props.addPickList(pickList);
  }, [pickList]);

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="pickListInputs">
          {(provided) => (
            <div
              className="inputs"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {pickList.map((list, index) => {
                return (
                  <Draggable
                    draggableId={`${index}`}
                    key={`${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="pickListInputDiv"
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <div {...provided.dragHandleProps}>
                          <DragIndicatorOutlinedIcon />
                        </div>
                        <input
                          id="triggerInput_todo"
                          key={list}
                          value={list.name}
                          onChange={(e) => handleInputOnchange(e, list)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setPickList((prev) => {
                                return [
                                  ...prev,
                                  { picklistId: pickList.length + 1, name: "" },
                                ];
                              });
                            }
                          }}
                        />
                       
                        <DeleteForeverOutlinedIcon
                          onClick={() => deletePickList(index)}
                          style={{ color: "red", cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default AddPickList;
