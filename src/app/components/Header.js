import React from "react";
import { FaUserAlt } from "react-icons/fa";

const Header = ({ currentUser = {}, currentDate = {}, selectedMonth, openCurrentDate, monthExpense }) => {
  return (
    <div className="flex justify-between pt-5 items-center">
      <div className="flex pl-4 items-center">
        <FaUserAlt />
        <span className="pl-2"> {currentUser.name}</span>
      </div>
      <div>
        <h1 className="text-xl">{  selectedMonth? selectedMonth?.[0]?.toUpperCase()+selectedMonth.slice(1) : ''}  <span className="bg-black px-2 py-1 rounded">₹ {monthExpense.toLocaleString('en-IN').split('.')[0]}</span></h1>
      </div>

      <div className="flex text-rose-200 pr-4 cursor-pointer" onClick={openCurrentDate}>
        <div className="text-5xl pr-1 pt-1 leading-10">{currentDate.day}</div>
        <div>
          <div className="text-sm">{currentDate.month}</div>
          <div>{currentDate.year}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
