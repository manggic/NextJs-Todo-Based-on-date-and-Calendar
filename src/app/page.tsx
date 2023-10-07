"use client";

import { useEffect, useState } from "react";

import Modal from "./components/Modal";

import { Toaster, toast } from "react-hot-toast";
import { months } from "./../constant";

import { useRouter } from "next/navigation";

import {
  Header,
  MonthDropDown,
  TodoList,
  Logout,
  Calendar,
} from "./components/index";

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({});

  // all todos data from json
  const [todosData, setTodosData] = useState<any[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  // single todo to show on lhs
  const [lhsTodo, setLhsTodo] = useState<any[]>([]);

  // current date
  const [currentDate, setCurrentDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  // month selected
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [selectedDay, setSelectedDay] = useState<null | string>(null);

  const [showTooltipOn, setShowTooltipOn] = useState<string>("");

  const [editTodoInfo, setEditTodoInfo] = useState({
    index: null,
    todo: null,
  });

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

    setSelectedDay(currentDay.toString());
    setCurrentDate({
      day: currentDay.toString(),
      month: currentMonth.toString(),
      year: currentYear.toString(),
    });
  }

  function settingTodosData(data: any, selMonth: any) {
    let todosData: any[] = [];

    let calendarData = data.calendar;
    calendarData.map((year: any) => {
      if (year.year == currentDate.year) {
        year.months.map((month: any) => {
          if (month.name == selMonth) {
            todosData = month.dates;
          }
        });
      }
    });

    setTodosData(todosData);
  }

  function settingLhsTodo(data: any, selMonth: any, selDay: any) {
    let todo: any[] = [];
    let calendarData = data.calendar;
    calendarData.map((year: any) => {
      if (year.year == currentDate.year) {
        year.months.map((month: any) => {
          if (month.name == selMonth) {
            month.dates.map((day: any) => {
              if (day.day == selDay) {
                todo = day.tasks;
              }
            });
          }
        });
      }
    });

    setLhsTodo(todo);
  }

  const handleSelectChange = (event: any) => {
    setSelectedMonth(event.target.value);

    setSelectedDay("1");

    settingTodosData(currentUser, event.target.value);

    settingLhsTodo(currentUser, event.target.value, 1);
  };

  useEffect(() => {
    fetchCurrentDate();
    // fetchTodoData();
  }, []);

  const getUser = async () => {
    const { signal } = new AbortController();
    const res = await fetch("/api/get_user", { signal });

    const resJson = await res.json();

    if (resJson.success) {
      setCurrentUser(resJson.data);

      settingTodosData(resJson.data, selectedMonth);

      settingLhsTodo(resJson.data, selectedMonth, selectedDay);
    } else {
      toast.error(`${resJson?.msg}`);

      setTimeout(() => {
        router.push("/signup");
      }, 3000);
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

  function handleDateClick(ele: any) {
    setSelectedDay(ele);
    settingLhsTodo(currentUser, selectedMonth, ele);
  }

  const checkIfTodoAlreadyPresent = (todo: string): boolean => {
    const value = lhsTodo.find((ele) => ele.name === todo);
    return value ? true : false;
  };

  async function addTodo(todo: any) {
    try {
      if (checkIfTodoAlreadyPresent(todo)) {
        toast.error(`${todo} already present`);
        return;
      }
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
    } catch (error) {
      console.log("ERROR ????", error);
    }
  }

  const deleteTodo = async (todo: any) => {
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

  async function updateTodoStatus(todo: any) {
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

  function handleHover(todo: any) {
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

  function ifSelectedDateisToday(): boolean {
    if (currentDate.day == selectedDay && currentDate.month === selectedMonth) {
      return true;
    }
    return false;
  }

  function isSelectedDatePrevoius(date2: any) {
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
    if (
      parseInt(months[m2 as keyof typeof months].number) <
      parseInt(months[m1 as keyof typeof months].number)
    ) {
      return true;
    }

    if (
      parseInt(months[m2 as keyof typeof months].number) >
      parseInt(months[m1 as keyof typeof months].number)
    ) {
      return false;
    }

    // days comparison
    if (parseInt(d2) < parseInt(d1)) {
      return true;
    }

    return false;
  }

  function handleEdit(todo: any, indexOfTodo: any) {
    setEditTodoInfo({ ...editTodoInfo, index: indexOfTodo, todo });
    setShowModal(true);
  }

  async function editTodo(todo: any) {

    if (checkIfTodoAlreadyPresent(todo.name)) {
      toast.error(`${todo.name} already present`);
      return;
    }

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
    });
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

  const openCurrentDate = () => {
    setSelectedMonth(currentDate.month);
    setSelectedDay(currentDate.day);
    settingLhsTodo(currentUser,currentDate.month, currentDate.day )
  };

  return (
    <div className="bg-[#2f363b] min-h-screen relative">
      <Toaster />

      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          editTodoInfo={editTodoInfo}
          editTodo={editTodo}
          addTodo={addTodo}
          setEditTodoInfo={setEditTodoInfo}
        />
      ) : (
        ""
      )}

      <Header
        openCurrentDate={openCurrentDate}
        currentUser={currentUser}
        currentDate={currentDate}
        selectedMonth={selectedMonth}
      />

      <div className="flex mt-5">
        <div className="left w-1/4">
          <MonthDropDown
            selectedMonth={selectedMonth}
            handleSelectChange={handleSelectChange}
          />

          <TodoList
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            currentDate={currentDate}
            addTodoInSelectedDate={addTodoInSelectedDate}
            isSelectedDatePrevoius={isSelectedDatePrevoius}
            deleteTodo={deleteTodo}
            updateTodoStatus={updateTodoStatus}
            deleteAllTodo={deleteAllTodo}
            todo={lhsTodo}
            showTooltipOn={showTooltipOn}
            setShowTooltipOn={setShowTooltipOn}
            handleHover={handleHover}
            handleEdit={handleEdit}
            ifSelectedDateisToday={ifSelectedDateisToday}
          />

          <Logout handleLogout={handleLogout} />
        </div>

        <div className="right w-full">
          <Calendar
            todosData={todosData}
            currentDate={currentDate}
            handleDateClick={handleDateClick}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
          />
        </div>
      </div>
    </div>
  );
}
