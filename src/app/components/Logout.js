import React from 'react'
import { MdLogout } from "react-icons/md";
const Logout = ({handleLogout}) => {
  return (
    <div
    onClick={handleLogout}
    className=" cursor-pointer absolute left-5 bottom-6 text-xl	"
  >
    <MdLogout />
  </div>
  )
}

export default Logout