import React from "react";
import { FaUserAlt } from "react-icons/fa";

const Header = ({ currentUser = {}, currentDate = {} }) => {
  return (
    <div className="flex justify-between pt-5 items-center">
      <div className="flex pl-4 items-center">
        <FaUserAlt />
        <span className="pl-2"> {currentUser.name}</span>
      </div>
      <div>
        <h1 className="text-xl">Calendar</h1>
      </div>

      <div className="flex text-rose-200 pr-4">
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