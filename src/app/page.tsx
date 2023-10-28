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
  DataDropDown,
} from "./components/index";

import {monthDataType, DynamicTodo, EditTodoInfo} from '../types'

export default function Home() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({});

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

  const [selectedDay, setSelectedDay] = useState<string>('');

  const [showTooltipOn, setShowTooltipOn] = useState<string>("");

  const [editTodoInfo, setEditTodoInfo] = useState<EditTodoInfo>({
    index: null,
    todo: null,
  });

  const [dataToShow, setDataToShow] = useState("todo");

  const [ totolExpense, setTotalExpense ] = useState<Number>(0)

  const [monthExpense, setMonthExpense] = useState(0)

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

    setSelectedMonth(currentMonth);
    setSelectedDay(currentDay.toString());
    setCurrentDate({
      day: currentDay.toString(),
      month: currentMonth.toString(),
      year: currentYear.toString(),
    });
  }

  const handleSelectChange = (event: any) => {
    setSelectedMonth(event.target.value);

    setSelectedDay("1");

    // settingTodosData(currentUser.monthData, event.target.value);

    setLhsTodo(settingLhsTodo(currentUser.monthData, event.target.value));
  };

  const settingLhsTodo = (monthData:monthDataType, day:string, event = null) => {
    let checker = event ? event : dataToShow;

    for (let i = 0; i < monthData?.length; i++) {
      if (monthData[i].day == day) {
         setTotalExpense(monthData[i]?.totalExpense || 0) 
        return checker == "todo" ? monthData[i].tasks : monthData[i].expenses;
      }
    }
    return [];
  };

  const getUser = async () => {
    // const { signal } = new AbortController();
    const res = await fetch("/api/get_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ month: selectedMonth, year: currentDate.year }),
    });
    const resJson = await res.json();

    if (resJson.success) {
      setCurrentUser(resJson.data);
      setLhsTodo(settingLhsTodo(resJson.data.monthData, selectedDay));
      setMonthExpense(resJson.data.monthExpense)
    } else {
      toast.error(`${resJson?.msg}`);

      setTimeout(() => {
        router.push("/signup");
      }, 3000);
    }
  };

  useEffect(() => {
    fetchCurrentDate();
    // fetchTodoData();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      getUser();
    }

    return () => {};
  }, [selectedMonth]);

  useEffect(() => {
    console.log({currentUser});
    console.log({lhsTodo});
  }, [currentUser, lhsTodo]);



  function addTodoInSelectedDate() {
    setShowModal(true);
  }

  // done
  function handleDateClick(ele: any) {
    setSelectedDay(ele);
    setLhsTodo(settingLhsTodo(currentUser.monthData, ele));
  }

  const checkIfTodoAlreadyPresent = (todo: DynamicTodo): boolean => {
    const value = lhsTodo.find((ele) => todo._id!==ele._id && (ele.name === todo.name));
    return value ? true : false;
  };

  // done
  async function addTodo(todo: any) {
    try {
      if (checkIfTodoAlreadyPresent(todo)) {
        toast.error(`${todo.name} already present`);
        return;
      }
      let fetchData = await fetch(`/api/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: currentDate.year,
          month: selectedMonth,
          day: selectedDay,
          eventData: todo,
          email: currentUser.email,
          eventName: dataToShow,
        }),
      });

      const resJson = await fetchData.json();

      setCurrentUser(resJson?.data);

      setMonthExpense(resJson?.data?.monthExpense)

      setLhsTodo(settingLhsTodo(resJson.data.monthData, selectedDay));

      setShowModal(false);
    } catch (error) {
      console.log("ERROR ????", error);
    }
  }

  // done
  const deleteTodo = async (todo: any) => {
    try {
      let fetchData = await fetch("/api/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: currentDate.year,
          month: selectedMonth,
          day: selectedDay,
          eventData: todo,
          email: currentUser.email,
          eventName: dataToShow,
        }),
      });

      const resJson = await fetchData.json();

      setCurrentUser(resJson.data);
      setMonthExpense(resJson?.data?.monthExpense)
      setLhsTodo(settingLhsTodo(resJson.data.monthData, selectedDay));
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  // done
  async function updateTodoStatus(todo: any) {
    try {
      const fetchData = await fetch("/api/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: currentDate.year,
          month: selectedMonth,
          day: selectedDay,
          newEventData: { ...todo, status: todo.status == "1" ? "0" : "1" },
          previousEventData: { ...todo },
          email: currentUser.email,
          eventName: dataToShow,
        }),
      });

      const resJson = await fetchData.json();

      setCurrentUser(resJson.data);

      

      // settingTodosData(resJson.data, selectedMonth);

      setLhsTodo(settingLhsTodo(resJson.data.monthData, selectedDay));
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  function handleHover(todo: any) {
    setShowTooltipOn(todo.name);
  }

  // done
  async function deleteAllTodo(dayExpense:any) {    
    const fetchData = await fetch("api/delete_all", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: currentDate.year,
        month: selectedMonth,
        day: selectedDay,
        email: currentUser.email,
        eventName: dataToShow,
        expense: dayExpense || 0
      }),
    });

    const resJson = await fetchData.json();
    setMonthExpense(resJson?.data?.monthExpense)
    setCurrentUser(resJson.data);
    // settingTodosData(resJson.data, selectedMonth);
    setLhsTodo([]);
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

  // done
  async function editTodo(todo: DynamicTodo) {
    if (checkIfTodoAlreadyPresent(todo)) {
      toast.error(`${todo.name} already present`);
      return;
    }

    const fetchData = await fetch("/api/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        year: currentDate.year,
        month: selectedMonth,
        day: selectedDay,
        email: currentUser.email,
        previousEventData: { ...editTodoInfo?.todo },
        newEventData: todo,
        eventName: dataToShow,
      }),
    });

    const resJson = await fetchData.json();

    setCurrentUser(resJson.data);
    setMonthExpense(resJson?.data?.monthExpense)

    setLhsTodo(settingLhsTodo(resJson.data.monthData, selectedDay));

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

  // done
  const openCurrentDate = () => {
    setSelectedMonth(currentDate.month);
    setSelectedDay(currentDate.day);
    setLhsTodo(settingLhsTodo(currentUser.monthData, currentDate.day));
  };

  const handleEventChange = (e: any) => {
    setDataToShow(e.target.value);
    setLhsTodo(
      settingLhsTodo(currentUser.monthData, selectedDay, e.target.value)
    );
  };

  return (
    <div className="bg-[#2f363b] min-h-screen relative">

      { currentUser?.name ? <>
      <Toaster />

      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          editTodoInfo={editTodoInfo}
          editTodo={editTodo}
          addTodo={addTodo}
          setEditTodoInfo={setEditTodoInfo}
          dataToShow={dataToShow}
        />
      ) : (
        ""
      )}

      <Header
        openCurrentDate={openCurrentDate}
        currentUser={currentUser}
        currentDate={currentDate}
        selectedMonth={selectedMonth}
        monthExpense={monthExpense}
      />

      <div className="flex mt-5">
        <div className="left w-1/4">
          <MonthDropDown
            selectedMonth={selectedMonth}
            handleSelectChange={handleSelectChange}
          />

          <DataDropDown
            handleEventChange={handleEventChange}
            dataToShow={dataToShow}
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
            dataToShow={dataToShow}
            totalExpense={totolExpense}
          />

          <Logout handleLogout={handleLogout} />
        </div>

        <div className="right w-full">
          <Calendar
            todosData={currentUser?.monthData || []}
            currentDate={currentDate}
            handleDateClick={handleDateClick}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
          />
        </div>
      </div>
      </> : <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div >  }
      
    </div>
  );
}
