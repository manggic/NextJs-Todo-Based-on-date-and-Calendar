"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";

import Modal from "./components/Modal";

import { MdDelete, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlinePlusCircle } from "react-icons/ai";
export default function Home() {
  // all todos data from json
  const [todosData, setTodosData] = useState({});

  const [showModal, setShowModal] = useState(false);

  // single todo to show on lhs
  const [todo, setTodo] = useState([]);

  // current date
  const [currentDate, setCurrentDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  const [currentMonthData, setCurrentMonthData] = useState([]);

  // no of days in month
  const [daysInMonth, setDaysInMonth] = useState(null);

  // month selected
  const [selectedMonth, setSelectedMonth] = useState("");

  const [selectedDay, setSelectedDay] = useState("");

  const [showTooltipOn, setShowTooltipOn] = useState("");

  function range(no) {
    let arr = [];
    for (let i = 1; i <= no; i++) {
      arr.push(i);
    }
    return arr;
  }

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

    setDaysInMonth(daysInCurrentMonth);

    setSelectedMonth(currentMonth);

    setSelectedDay(currentDay);
    setCurrentDate({
      day: currentDay,
      month: currentMonth,
      year: currentYear,
    });
  }

  const handleSelectChange = (event) => {
    setSelectedMonth(event.target.value);

    setDaysInMonth(
      Object.keys(
        todosData?.[currentDate.year]?.[event.target.value.toLowerCase()]
      )?.length
    );

    setSelectedDay(null);

    setTodo(todosData?.[currentDate.year]?.[event.target.value]);

    setCurrentMonthData(todosData?.[currentDate.year]?.[event.target.value]);

    // console.log(event.target.value);

    // console.log('length', (Object.keys(todosData[currentDate.year][event.target.value.toLowerCase()]).length))
  };

  const fetchTodoData = async () => {
    try {
      let res = await fetch("/api/get_json_data");
      let respData = await res.json();

      if (respData.success) {
        setTodosData(respData.data);

        setTodo(
          respData.data?.[currentDate.year.toString()]?.[currentDate.month]?.[
            currentDate.day
          ]
        );

        setCurrentMonthData(respData.data[currentDate.year][currentDate.month]);
      } else {
        console.log("ERROR: something went wrong");

        return;
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    fetchCurrentDate();
    // fetchTodoData();
  }, []);

  useEffect(() => {
    // This useEffect monitors changes to currentDate and calls fetchTodoData
    fetchTodoData();
  }, [currentDate]); // Whenever currentDate changes, this useEffect will be triggered

  function addTodoInSelectedDate() {
    setShowModal(true);
  }

  function handleDateClick(ele) {
    setSelectedDay(ele);

    let toDo = todosData[currentDate.year][selectedMonth][ele];

    if (toDo) {
      setTodo(toDo);
    } else {
      setTodo([]);
    }
  }

  async function addTodo(todo) {
    try {
      let fetchData = await fetch("/api/get_json_data");

      let { data } = await fetchData.json();

      console.log(
        "fetch data res checking",
        data[currentDate.year][selectedMonth][selectedDay]
      );

      if (!data[currentDate.year][selectedMonth][selectedDay]) {
        data[currentDate.year][selectedMonth][selectedDay] = [
          {
            name: todo,
            status: "not done",
          },
        ];
      } else {
        console.log("history");
        data[currentDate.year][selectedMonth][selectedDay].push({
          name: todo,
          status: "not done",
        });
      }

      let updatedData = data;

      let res = await fetch("/api/update_json_data", {
        method: "POST",
        headers: {
          Content_Type: "application/json",
        },
        body: JSON.stringify(data),
      });

      let jsonRes = await res.json();

      console.log("jsonRes ????", jsonRes);

      if (jsonRes.success) {
        setTodo(data[currentDate.year][selectedMonth][selectedDay]);

        setTodosData(data);
      }

      setShowModal(false);
      // console.log('response  ????',await res.json());
    } catch (error) {
      console.log("ERROR ????", error);
    }
  }

  const deleteTodo = async (todo) => {
    try {
      let fetchData = await fetch("/api/get_json_data");

      let { data } = await fetchData.json();

      data[currentDate.year][selectedMonth][selectedDay] = data[
        currentDate.year
      ][selectedMonth][selectedDay].filter((t) => t.name !== todo.name);

      const res = await fetch("api/update_json_data", {
        method: "POST",
        headers: {
          Content_Type: "application/json",
        },
        body: JSON.stringify(data),
      });

      let jsonRes = await res.json();

      if (jsonRes.success) {
        setTodo(data[currentDate.year][selectedMonth][selectedDay]);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  async function updateTodoStatus(todo) {
    try {
      let fetchData = await fetch("/api/get_json_data");

      let { data } = await fetchData.json();

      let finalObj = [];

      console.log("todo ????", todo);

      data[currentDate.year][selectedMonth][selectedDay].forEach((t) => {
        if (todo.name === t.name) {
          finalObj.push({
            ...t,
            status: t.status === "not done" ? "done" : "not done",
          });
        } else {
          finalObj.push(t);
        }
      });

      data[currentDate.year][selectedMonth][selectedDay] = finalObj;

      let res = await fetch("api/update_json_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let resJson = await res.json();

      if (resJson.success) {
        setTodo(finalObj);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  function handleHover(todo) {
    setShowTooltipOn(todo.name);
  }

  async function deleteAllTodo() {
    //  setTodo([])

    let newTodosData = JSON.parse(JSON.stringify(todosData));

    newTodosData[currentDate.year][selectedMonth][selectedDay] = null;

    const res = await fetch("api/update_json_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodosData),
    });

    const resJson = await res.json();

    setCurrentMonthData(newTodosData[currentDate.year][selectedMonth]);
    setTodosData(newTodosData);

    setTodo([]);
  }

  // testing date
  // useEffect(() => {
  //      console.log('superman ?????',isSelectedDatePrevoius([2, "august", "2023"], [2, "september", "2023"])? "Your date is Prevoius" :"date is next")
  // }, []);

  function isSelectedDatePrevoius(date2) {
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
    if (parseInt(months[m2].number) < parseInt(months[m1].number)) {
      return true;
    }

    if (parseInt(months[m2].number) > parseInt(months[m1].number)) {
      return false;
    }

    // days comparison
    if (parseInt(d2) < parseInt(d1)) {
      return true;
    }

    return false;
  }

  return (
    <div className="main flex">
      <div className="left_bar w-1/4 min-h-screen">
        {showModal ? (
          <div className="absolute left-1/3 z-30">
            <Modal setShowModal={setShowModal} addTodo={addTodo} />
          </div>
        ) : (
          ""
        )}

        <div className="dropdown text-black pt-20 flex flex-col justify-center items-center">
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
        <div className="todos ">
          <div className="text-white pt-20 pl-7 font-bold flex items-center">
            <div>
              Todos{" "}
              {selectedDay
                ? `(${selectedDay} ${months[selectedMonth].shortName} ${currentDate.year})`
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
                {todo.map((t) => {
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
                        <div className="ml-1 cursor-pointer">
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

                      {selectedDay == currentDate.day ? (
                        <button
                          className="ml-3 bg-orange-200	 cursor-pointer rounded-lg p-1 text-xs border border-purple-400 text-black"
                          onClick={() => updateTodoStatus(t)}
                        >
                          {t.status === "not done" ? "Not Done" : "Done"}
                        </button>
                      ) : (
                        <span
                          className="ml-3 bg-orange-200	 p-1 rounded-lg text-xs border border-purple-400 text-black"
                          // onClick={()=>updateTodoStatus(t)}
                        >
                          {t.status === "not done" ? "Not Done" : "Done"}
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
          {Object.entries(currentMonthData).map((ele, index) => {
            const [key, value] = ele;

            let classname =
              "h-16 w-1/4 border flex justify-center items-center cursor-pointer";

            if (key == currentDate.day && selectedMonth == currentDate.month) {
              classname += " bg-blue-600";
            } else if (key == selectedDay) {
              classname += " bg-rose-400";
            } else if (value?.length) {
              classname += " text-pink-300	drop-shadow-2xl text-xl ";
            } else {
              classname += "";
            }
            return (
              <div
                key={index}
                className={classname}
                onClick={() => handleDateClick(key)}
              >
                {key}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
