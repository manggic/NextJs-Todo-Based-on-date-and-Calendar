"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BiPlusCircle } from "react-icons/bi";

import Modal from "./components/Modal";

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

  // no of days in month
  const [daysInMonth, setDaysInMonth] = useState(null);

  // month selected
  const [selectedMonth, setSelectedMonth] = useState("");

  const [selectedDay, setSelectedDay] = useState("");

  function range(no) {
    let arr = [];
    for (let i = 1; i <= no; i++) {
      arr.push(i);
    }
    return arr;
  }

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

    // console.log(event.target.value);

    // console.log('length', (Object.keys(todosData[currentDate.year][event.target.value.toLowerCase()]).length))
  };

  const fetchTodoData = async () => {
    try {
      let res = await fetch("/api/get_json_data");
      let respData = await res.json();

      if (respData.success) {
        setTodosData(respData.data);

        console.log("current", currentDate);

        setTodo(
          respData.data?.[currentDate.year.toString()]?.[currentDate.month]?.[
            currentDate.day
          ]
        );
      } else {
        console.log("ERROR: something went wrong");

        return;
      }

      console.log("respData", respData);
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

  return (
    <div className="main flex">
      <div className="left_bar w-1/4 min-h-screen">
        {showModal ? (
          <div className="absolute left-1/3">
            <Modal setShowModal={setShowModal} addTodo={addTodo} />
          </div>
        ) : (
          ""
        )}

        <div className="dropdown text-black pt-20 flex flex-col justify-center items-center">
          <div className="pb-1 text-sm">Select month</div>
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
          <div className="text-black pt-20 pl-9 font-bold">
            Todos {`(${selectedDay} ${selectedMonth} ${currentDate.year})`}
            <button
              className="ml-1 bg-blue-700 rounded-lg p-1 text-xs border border-purple-400 text-white"
              onClick={addTodoInSelectedDate}
            >
              Add
            </button>
          </div>

          {todo?.length ? (
            <div className="text-black">
              <ul>
                {todo.map((t) => {
                  return (
                    <li className="px-9 my-3" key={t.name}>
                      {t.name}
                      <button
                        onClick={() => deleteTodo(t)}
                        className="ml-1 bg-red-600 rounded-lg p-1 text-xs border border-purple-400 text-white"
                      >
                        Delete
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-black px-9 my-3">Empty!!!!</div>
          )}
        </div>
      </div>

      <div className="right_bar w-full">
        <div className="h-24 flex justify-center items-center text-xl">
          <h1>Calendar</h1>
        </div>

        <div className="flex content-start flex-wrap">
          {range(daysInMonth).map((ele, index) => {
            return (
              <div
                key={index}
                className={
                  ele === currentDate.day
                    ? "bg-orange-500 h-16 w-1/4 border flex justify-center items-center cursor-pointer"
                    : "h-16 w-1/4 border flex justify-center items-center cursor-pointer"
                }
                onClick={() => handleDateClick(ele)}
              >
                {ele}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
