


import React from 'react'

const DataDropDown = ({dataToShow, handleEventChange}) => {
  return (
    <>
    <div className="dropdown text-black pt-6  flex flex-col justify-center items-center">
         <div className="pb-1 text-sm text-white">Select Event</div>
         <select
           name="year"
           id="year"
           value={dataToShow}
           onChange={handleEventChange}
           className="w-32 p-1 outline-none classic"
         >
           <option value="todo">todo</option>
           <option value="expenses">expenses</option>
         </select>
       </div>
   </>
  )
}

export default DataDropDown