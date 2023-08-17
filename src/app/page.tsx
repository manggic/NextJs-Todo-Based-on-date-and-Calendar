"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";

import Modal from "./components/Modal";

import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Toaster, toast } from "react-hot-toast";
// import { cookies } from 'next/headers'

import { FaUserAlt } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({});

  // all todos data from json
  const [todosData, setTodosData] = useState<any[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  // single todo to show on lhs
  const [todo, setTodo] = useState<any[]>([]);

  // current date
  const [currentDate, setCurrentDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  // month selected
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [selectedDay, setSelectedDay] = useState<null | number>(null);

  const [showTooltipOn, setShowTooltipOn] = useState<string>("");

  const [editTodoInfo, setEditTodoInfo] = useState({
    index: null,
    todo: null,
  });

  // function range(no) {
  //   let arr = [];
  //   for (let i = 1; i <= no; i++) {
  //     arr.push(i);
  //   }
  //   return arr;
  // }

  let months = {
    january: {
      number: "01",
      shortName: "jan",
      fullName: "January",
    },
    february: {
      number: "02",
      shortName: "feb",
      fullName: "February",
    },
    march: {
      number: "03",
      shortName: "mar",
      fullName: "March",
    },
    april: {
      number: "04",
      shortName: "apr",
      fullName: "April",
    },
    may: {
      number: "05",
      shortName: "may",
      fullName: "May",
    },
    june: {
      number: "06",
      shortName: "jun",
      fullName: "June",
    },
    july: {
      number: "07",
      shortName: "jul",
      fullName: "July",
    },
    august: {
      number: "08",
      shortName: "aug",
      fullName: "August",
    },
    september: {
      number: "09",
      shortName: "sep",
      fullName: "September",
    },
    october: {
      number: "10",
      shortName: "oct",
      fullName: "October",
    },
    november: {
      number: "11",
      shortName: "nov",
      fullName: "November",
    },
    december: {
      number: "12",
      shortName: "dec",
      fullName: "December",
    },
  };

  function fetchCurrentDate() {
    // Get the current date
    const currentDate = new Date();

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // Get the current month (0 - January, 1 - February, ..., 11 - December)
    let currentMonth = months[currentDate.getMonth()].toLowerCase();
    const currentDay = currentDate.getDate();
    let currentYear = currentDate.getFullYear();

    // Get the number of days in the current month
    let daysInCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    setSelectedMonth(currentMonth);

    setSelectedDay(currentDay);
    setCurrentDate({
      day: currentDay.toString(),
      month: currentMonth.toString(),
      year: currentYear.toString(),
    });
  }

  function settingTodosData(data:any, selMonth:any) {
    let todosData:any[] = [];

    let calendarData = data.calendar;
    calendarData.map((year:any) => {
      if (year.year == currentDate.year) {
        year.months.map((month:any) => {
          if (month.name == selMonth) {
            todosData = month.dates;
          }
        });
      }
    });

    setTodosData(todosData);
  }

  function settingLhsTodo(data:any, selMonth:any, selDay:any) {
    let todo:any[] = [];
    let calendarData = data.calendar;
    calendarData.map((year:any) => {
      if (year.year == currentDate.year) {
        year.months.map((month:any) => {
          if (month.name == selMonth) {
            month.dates.map((day:any) => {
              if (day.day == selDay) {
                todo = day.tasks;
              }
            });
          }
        });
      }
    });

    setTodo(todo);
  }

  const handleSelectChange = (event :any) => {
    setSelectedMonth(event.target.value);

    setSelectedDay(1);

    settingTodosData(currentUser, event.target.value);

    settingLhsTodo(currentUser, event.target.value, 1);
  };

  useEffect(() => {
    fetchCurrentDate();
    // fetchTodoData();
  }, []);

  const getUser = async () => {
    const res = await fetch("/api/get_user");

    const resJson = await res.json();

    if (resJson.success) {
      setCurrentUser(resJson.data);

      settingTodosData(resJson.data, selectedMonth);

      settingLhsTodo(resJson.data, selectedMonth, selectedDay);
    } else {

      console.log(resJson?.msg);
      
      toast.error("Get User failed");
    }
  };

  useEffect(() => {
    if (selectedMonth) {
      getUser();
    }

    return () => {};
  }, [selectedMonth]);

  function addTodoInSelectedDate() {
    setShowModal(true);
  }

  function handleDateClick(ele:any) {
    setSelectedDay(ele);

    settingLhsTodo(currentUser, selectedMonth, ele);
  }

  async function addTodo(todo:any) {
    try {
      let fetchData = await fetch("/api/add_todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: currentDate.year,
          month: selectedMonth,
          day: selectedDay,
          todo,
          email: currentUser.email,
        }),
      });

      const resJson = await fetchData.json();

      setCurrentUser(resJson.data);

      settingTodosData(resJson.data, selectedMonth);

      settingLhsTodo(resJson.data, selectedMonth, selectedDay);

      setShowModal(false);
      // console.log('response  ????',await res.json());
    } catch (error) {
      console.log("ERROR ????", error);
    }
  }

  const deleteTodo = async (todo:any) => {
    try {
      let fetchData = await fetch("/api/delete_todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: currentDate.year,
          month: selectedMonth,
          day: selectedDay,
          todo: todo.name,
          email: currentUser.email,
        }),
      });

      const resJson = await fetchData.json();

      setCurrentUser(resJson.data);

      settingTodosData(resJson.data, selectedMonth);

      settingLhsTodo(resJson.data, selectedMonth, selectedDay);
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  async function updateTodoStatus(todo:any) {
    try {
      const fetchData = await fetch("/api/edit_todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: currentDate.year,
          month: selectedMonth,
          day: selectedDay,
          newTodo: { ...todo, status: !todo.status },
          previousTodo: todo,
          email: currentUser.email,
        }),
      });

      const resJson = await fetchData.json();

      setCurrentUser(resJson.data);

      settingTodosData(resJson.data, selectedMonth);

      settingLhsTodo(resJson.data, selectedMonth, selectedDay);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  function handleHover(todo :any) {
    setShowTooltipOn(todo.name);
  }

  async function deleteAllTodo() {
    const fetchData = await fetch("api/delete_all_todo", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: currentDate.year,
        month: selectedMonth,
        day: selectedDay,
        email: currentUser.email,
      }),
    });

    const resJson = await fetchData.json();

    setCurrentUser(resJson.data);
    settingTodosData(resJson.data, selectedMonth);

    settingLhsTodo(resJson.data, selectedMonth, selectedDay);
  }

  function isSelectedDatePrevoius(date2 :any) {
    // today date - date1
    // date1 - [04,august,2023]

    // date to check - date2
    // date2 - [21,july,2024]

    let date1 = [currentDate.day, currentDate.month, currentDate.year];

    let [d1, m1, y1] = date1;
    let [d2, m2, y2] = date2;

    // year comparison
    if (parseInt(y2) < parseInt(y1)) {
      return true;
    }
    if (parseInt(y2) > parseInt(y1)) {
      return false;
    }

    // month comparison
    if (parseInt(months[m2 as keyof typeof months].number) < parseInt(months[m1 as keyof typeof months].number)) {
      return true;
    }

    if (parseInt(months[m2 as keyof typeof months].number) > parseInt(months[m1 as keyof typeof months].number)) {
      return false;
    }

    // days comparison
    if (parseInt(d2) < parseInt(d1)) {
      return true;
    }

    return false;
  }

  function handleEdit(todo :any, indexOfTodo :any) {
    setEditTodoInfo({ ...editTodoInfo, index: indexOfTodo, todo });

    console.log({ ...editTodoInfo, index: indexOfTodo, todo });

    setShowModal(true);
  }

  async function editTodo(todo :any) {
    const fetchData = await fetch("/api/edit_todo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: currentDate.year,
        month: selectedMonth,
        day: selectedDay,
        email: currentUser.email,
        previousTodo: editTodoInfo.todo,
        newTodo: todo,
      }),
    });

    const resJson = await fetchData.json();

    setCurrentUser(resJson.data);

    settingLhsTodo(resJson.data, selectedMonth, selectedDay);

    setShowModal(false);

    setEditTodoInfo({
      index: null,
      todo: null,
    })
  }

  async function handleLogout() {
    try {
      const res = await fetch("/api/signout");

      const resJson = await res.json();

      if (resJson.success) {
        router.push("/login");
      } else {
        toast.error("log out failed");
      }
    } catch (error) {
      toast.error("log out failed");
    }
  }

  return (
    <div className="main flex">
      <Toaster />
      <div className="left_bar w-1/4 min-h-screen">
        <div className="mt-4">
          <div className="flex items-center pl-4">
            <FaUserAlt />
            <span className="pl-2"> {currentUser.name}</span>
          </div>
          {/* <button
            onClick={handleLogout}
            className="bg-slate-300 text-sm px-3 rounded text-black p-1 ml-4"
          >
            log out
          </button> */}
        </div>
        {showModal ? (
          <div className="absolute left-1/3 z-30 top-0">
            <Modal
              setShowModal={setShowModal}
              editTodoInfo={editTodoInfo}
              editTodo={editTodo}
              addTodo={addTodo}
              setEditTodoInfo={setEditTodoInfo}
            />
          </div>
        ) : (
          ""
        )}

        <div className="dropdown text-black pt-12 flex flex-col justify-center items-center">
          <div className="pb-1 text-sm text-white">Select month</div>
          <select
            name="year"
            id="year"
            value={selectedMonth}
            onChange={handleSelectChange}
            className="w-32 p-1"
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
        <div className="todos">
          <div className="text-white pt-20 pl-7 font-bold flex items-center">
            <div>
              Todos{" "}
              {selectedDay
                ? `(${selectedDay} ${months[selectedMonth as keyof typeof months].shortName} ${currentDate.year})`
                : ""}
            </div>

            {selectedDay &&
            !isSelectedDatePrevoius([
              selectedDay,
              selectedMonth,
              currentDate.year,
            ]) ? (
              <div
                className="pl-3 cursor-pointer text-lg"
                onClick={addTodoInSelectedDate}
              >
                <AiOutlinePlusCircle />
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
              <div
                onClick={() => deleteAllTodo()}
                className="pl-3 cursor-pointer"
              >
                <RiDeleteBin6Line />
              </div>
            ) : (
              ""
            )}
          </div>

          {todo?.length ? (
            <div className="text-white">
              <ul>
                {todo.map((t, index) => {
                  return (
                    <li
                      className="px-7 my-3 flex items-center relative"
                      key={t.name}
                    >
                      {showTooltipOn == t.name ? (
                        <span className="top">
                          {t.name}
                          <i></i>
                        </span>
                      ) : (
                        ""
                      )}

                      <span
                        onMouseEnter={() => handleHover(t)}
                        onMouseLeave={() => setShowTooltipOn("")}
                        className="text-sm todo_text"
                      >
                        {t.name.length > 10
                          ? t.name.slice(0, 10) + "..."
                          : t.name}
                      </span>

                      {!isSelectedDatePrevoius([
                        selectedDay,
                        selectedMonth,
                        currentDate.year,
                      ]) ? (
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
                      ]) ? (
                        <div
                          className="ml-3 cursor-pointer"
                          onClick={() => deleteTodo(t)}
                        >
                          <MdDelete />
                        </div>
                      ) : (
                        ""
                      )}

                      {!isSelectedDatePrevoius([
                        selectedDay,
                        selectedMonth,
                        currentDate.year,
                      ]) ? (
                        <button
                          className="ml-3 bg-orange-200	 cursor-pointer rounded-lg p-1 text-xs border border-purple-400 text-black"
                          onClick={() => updateTodoStatus(t)}
                        >
                          {!t.status ? "Not Done" : "Done"}
                        </button>
                      ) : (
                        <span
                          className="ml-3 bg-orange-200	 p-1 rounded-lg text-xs border border-purple-400 text-black"
                          // onClick={()=>updateTodoStatus(t)}
                        >
                          {!t.status ? "Not Done" : "Done"}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-white px-7 my-3">Empty!!!!</div>
          )}
        </div>

        <div
          onClick={handleLogout}
          className=" cursor-pointer absolute left-5 bottom-6 text-xl	"
        >
          <MdLogout />
        </div>
      </div>

      <div className="right_bar w-full">
        <div className="h-24 flex justify-center items-center text-xl">
          <h1>Calendar</h1>
          <div className="absolute right-6 flex text-rose-200">
            <div className="text-5xl pr-1 pt-1 leading-10">
              {currentDate.day}
            </div>
            <div>
              <div className="text-sm">{currentDate.month}</div>
              <div>{currentDate.year}</div>
            </div>
          </div>
        </div>

        <div className="flex content-start flex-wrap">
          {todosData.map((todo, index) => {
            let { day, tasks } = todo;

            let classname =
              "h-16 w-1/4 border flex justify-center items-center cursor-pointer";

            if (day == currentDate.day && selectedMonth == currentDate.month) {
              classname += " bg-blue-600";
            } else if (day == selectedDay) {
              classname += " bg-rose-400";
            } else if (tasks?.length) {
              classname += " text-pink-300	drop-shadow-2xl text-xl ";
            } else {
              classname += "";
            }
            return (
              <div
                className={classname}
                onClick={() => handleDateClick(day)}
                key={index}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
