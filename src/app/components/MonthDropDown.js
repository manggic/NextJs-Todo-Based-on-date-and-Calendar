

import React from 'react'

const MonthDropDown = ({selectedMonth,handleSelectChange }) => {
  return (
    <>
     <div className="dropdown text-black pt-12 flex flex-col justify-center items-center">
          <div className="pb-1 text-sm text-white">Select month</div>
          <select
            name="year"
            id="year"
            value={selectedMonth}
            onChange={handleSelectChange}
            className="w-32 p-1 outline-none classic"
          >
            <option value="january">january</option>
            <option value="february">february</option>
            <option value="march">march</option>
            <option value="april">april</option>
            <option value="may">may</option>
            <option value="june">june</option>
            <option value="july">july</option>
            <option value="august">august</option>
            <option value="september">september</option>
            <option value="october">october</option>
            <option value="november">november</option>
            <option value="december">december</option>
          </select>
        </div>
    </>
  )
}

export default MonthDropDown