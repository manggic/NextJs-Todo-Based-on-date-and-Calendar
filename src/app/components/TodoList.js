import { months, events } from "@/constant";
import React from "react";
import { MdOutlineEdit } from "react-icons/md";
import { LuPlus } from "react-icons/lu";

import { RiDeleteBin6Line } from "react-icons/ri";
const TodoList = ({
  selectedMonth,
  selectedDay,
  currentDate,
  addTodoInSelectedDate,
  isSelectedDatePrevoius,
  deleteTodo,
  updateTodoStatus,
  deleteAllTodo,
  todo,
  showTooltipOn,
  setShowTooltipOn,
  handleHover,
  handleEdit,
  ifSelectedDateisToday,
  dataToShow,
  totalExpense,
}) => {
  let fields = events[dataToShow].fields;
  let width = events[dataToShow].width;
  let trimLength = events[dataToShow].trimLength;
  let widthCss = `w-[${width}px]`;

  return (
    <div className="ml-5">
      <div className="text-white pt-20 font-bold flex items-center">
        <div className="bg-black px-2">
          {dataToShow}
          {" : "}
          <span className="">
            {selectedDay
              ? `${selectedDay} ${months[selectedMonth].shortName} ${currentDate.year}`
              : ""}
          </span>
        </div>

        {selectedDay &&
        !isSelectedDatePrevoius([
          selectedDay,
          selectedMonth,
          currentDate.year,
        ]) ? (
          <div
            className="cursor-pointer pl-3 text-lg font-bold"
            onClick={addTodoInSelectedDate}
          >
            <LuPlus />
          </div>
        ) : (
          ""
        )}

        {todo?.length &&
        !isSelectedDatePrevoius([
          selectedDay,
          selectedMonth,
          currentDate.year,
        ]) ? (
          <div onClick={() => deleteAllTodo()} className="pl-3 cursor-pointer">
            <RiDeleteBin6Line />
          </div>
        ) : (
          ""
        )}
      </div>

      {todo?.length ? (
        <ul className="todo-scroll text-white mt-3">
          {todo.map((t, index) => {
            return (
              <>
                <li
                  className="mb-3 ml-3 flex items-center relative"
                  key={t.name}
                >
                  {showTooltipOn == t.name ? (
                    <span
                      className={`${
                        index === 0
                          ? "ItsTop"
                          : index === todo?.length - 1
                          ? "ItsBottom"
                          : "ItsCenter"
                      }   top z-20`}
                    >
                      {t.name}
                      <i></i>
                    </span>
                  ) : (
                    ""
                  )}

                  {fields.map((eve, ind) => {
                    return (
                      <span
                        onMouseEnter={() => handleHover(t)}
                        onMouseLeave={() => setShowTooltipOn("")}
                        key={ind}
                        className={`text-sm ${
                          ind == 0 ? widthCss : "pl-4 pr-2"
                        }`}
                      >
                        {ind == 0
                          ? t[eve].length > trimLength
                            ? t[eve].slice(0, trimLength) + "..."
                            : t[eve]
                          : "₹ " + t[eve]}
                      </span>
                    );
                  })}

                  {/* <span
                    onMouseEnter={() => handleHover(t)}
                    onMouseLeave={() => setShowTooltipOn("")}
                    className="text-sm todo_text"
                  >
                    {t.name.length > 10 ? t.name.slice(0, 10) + "..." : t.name}
                  </span>

                  {dataToShow === "expenses" ? (
                    <span className="cursor-pointer pl-3 text-lg font-bold">
                      {t.price}
                    </span>
                  ) : (
                    ""
                  )} */}

                  {!isSelectedDatePrevoius([
                    selectedDay,
                    selectedMonth,
                    currentDate.year,
                  ]) && events[dataToShow].edit ? (
                    <div
                      onClick={() => handleEdit(t, index)}
                      className="ml-1 cursor-pointer"
                    >
                      <MdOutlineEdit />
                    </div>
                  ) : (
                    ""
                  )}

                  {!isSelectedDatePrevoius([
                    selectedDay,
                    selectedMonth,
                    currentDate.year,
                  ]) && events[dataToShow].delete ? (
                    <div
                      className="ml-3 cursor-pointer"
                      onClick={() => deleteTodo(t)}
                    >
                      <RiDeleteBin6Line />
                    </div>
                  ) : (
                    ""
                  )}

                  {events[dataToShow].status ? (
                    ifSelectedDateisToday() ? (
                      <button
                        className={`ml-3 ${
                          t.status ? "bg-[aquamarine]" : "bg-orange-200"
                        } font-semibold cursor-pointer rounded-lg py-1 px-2 text-xs   text-black`}
                        onClick={() => updateTodoStatus(t)}
                      >
                        {!t.status ? "NOT DONE" : "DONE"}
                      </button>
                    ) : (
                      <span
                        className={`ml-3 ${
                          t.status ? "bg-[aquamarine]" : "bg-orange-200"
                        } font-semibold	py-1 px-2 rounded-lg text-xs border  text-black`}
                        // onClick={()=>updateTodoStatus(t)}
                      >
                        {!t.status ? "NOT DONE" : "DONE"}
                      </span>
                    )
                  ) : (
                    ""
                  )}
                </li>
              </>
            );
          })}
        </ul>
      ) : (
        <div className="text-white px-7 my-3">Empty!!!!</div>
      )}

      {dataToShow == "expenses" && todo?.length ? (
        <div className="ml-3 text-[cyan] text-md">Total - ₹ {totalExpense.toLocaleString('en-IN').split('.')[0]}</div>
      ) : (
        ""
      )}
      <style jsx global>
        {`
          .ItsTop {
            top: 0;
          }

          .ItsBottom {
            bottom: 0;
          }

          .ItsCenter {
            top: 50%;
            transform: translateY(-50%);
          }
        `}
      </style>
    </div>
  );
};

export default TodoList;
