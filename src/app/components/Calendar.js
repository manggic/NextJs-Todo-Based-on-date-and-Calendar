

import React from 'react'

const Calendar = ({todosData, handleDateClick, currentDate, selectedMonth, selectedDay}) => {
  return (
    <div className="flex content-start flex-wrap">
    {todosData.map((todo, index) => {
      let { day, tasks } = todo;

      let classname =
        "h-16 w-1/4 border flex justify-center items-center cursor-pointer";

      if (day == currentDate.day && selectedMonth == currentDate.month) {
        classname += " highlight_current_date";
      } else if (day == selectedDay) {
        classname += " highlight_selected_date";
      } else if (tasks?.length) {
        classname += " text-pink-300	drop-shadow-2xl text-xl ";
      } else {
        classname += "";
      }
      return (
        <div
          className={classname}
          // style={{background:"#1f2f1f"}}
          onClick={() => handleDateClick(day)}
          key={index}
        >
          {day}
        </div>
      );
    })}
  </div>
  )
}

export default Calendar