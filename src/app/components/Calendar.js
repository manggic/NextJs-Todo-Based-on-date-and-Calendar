import React, { useState, useRef } from 'react'

const Calendar = ({todosData = [], handleDateClick, currentDate, selectedMonth, selectedDay}) => {


  const [showExpense, setShowExpense] = useState(false)
  return (
    <div className="flex content-start flex-wrap">
    {todosData?.map((todo, index) => {
      let { day, tasks, totalExpense } = todo;

      let classname =
        "h-16 w-1/4 border flex justify-center items-center cursor-pointer relative";

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
          onMouseEnter={() => setShowExpense(true)}
          onMouseLeave={() => setShowExpense(false)}
        >
            {showExpense? <span className='absolute text-[cyan] text-[15px] top-0 right-2'>{totalExpense?<><span className='text-[10px] pb-5 pr-[2px]'>₹</span>{totalExpense.toLocaleString('en-IN').split('.')[0]}</>  :""}</span>:""} 
          {day}
        </div>
      );
    })}
  </div>
  )
}

export default Calendar