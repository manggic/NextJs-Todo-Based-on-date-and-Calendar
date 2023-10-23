import { events, checkIfObjectAndHasData } from "@/constant";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = ({
  setShowModal,
  addTodo,
  editTodoInfo,
  editTodo,
  setEditTodoInfo,
  dataToShow,
}) => {
  const [modalTodo, setModalTodo] = useState(editTodoInfo?.todo?.name || "");

  const field = events[dataToShow].formfields;

  const [formData, setFormData] = useState(editTodoInfo?.todo || {});

  function handleSubmit(e) {
    e.preventDefault();

    if (
      editTodoInfo?.todo?.name &&
      Object.keys(formData)?.length == field?.length + 1
    ) {
      editTodo(formData);
    } else if (
      Object.keys(formData)?.length == field?.length
    ) {
      addTodo(formData);
    } else {
      toast.error("Pls fill complete data");
    }
  }

  const closePopup = () => {
    setShowModal(false);
    setEditTodoInfo({
      index: null,
      todo: null,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed w-full h-screen	flex justify-center items-center z-20 backdrop-blur-lg">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-[#f7f7f7] pt-6 pb-5 px-4 rounded"
        style={{ width: "350px", backdropFilter: blur("5px") }}
      >
        <Toaster />
        <div className="text-black capitalize text-center text-md pb-5">Enter {dataToShow}</div>

        <div className="flex flex-col items-center">
          {events[dataToShow].formfields.map((ele) => {
            return (
              <>
                <input
                  className="p-1 mb-2 text-black border border-black outline-[#2f363b]"
                  type="text"
                  name={ele}
                  id={ele}
                  placeholder={ele}
                  value={formData?.[ele] || ""}
                  onChange={(e) => handleChange(e)}
                />
              </>
            );
          })}
        </div>
        <div className="flex justify-end mt-4">
          <button
            // onClick={() => handleSubmit()}
            className="ml-2 text-sm border px-4 py-2 text-white-200 bg-[#2f363b]  rounded-md"
            type="submit"
          >
            Submit
          </button>
          <button
            onClick={() => closePopup()}
            className="ml-2 text-sm border py-2 px-4 text-white-200 bg-[#2f363b]  rounded-md"
            type="submit"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default Modal;
