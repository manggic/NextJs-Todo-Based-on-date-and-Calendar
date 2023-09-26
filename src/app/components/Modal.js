import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = ({
  setShowModal,
  addTodo,
  editTodoInfo,
  editTodo,
  setEditTodoInfo,
}) => {
  const [modalTodo, setModalTodo] = useState(editTodoInfo?.todo?.name || "");

  function handleSubmit() {
    if (editTodoInfo?.todo?.name) {
      editTodo({ name: modalTodo, status: editTodoInfo.todo.status });
    } else if (modalTodo) {
      addTodo(modalTodo);
    } else {
      toast.error("Pls enter todo");
    }
  }

  const closePopup = () => {
    setShowModal(false);
    setEditTodoInfo({
      index: null,
      todo: null,
    });
  };

  return (
    <div className="fixed w-full h-screen	flex justify-center items-center z-20 backdrop-blur-lg">
      <div
        className="bg-[#f7f7f7] pt-8 pb-5 px-4 rounded"
        style={{ width: "350px", backdropFilter: blur("5px") }}
      >
        <Toaster />
        <div className="text-black text-md pb-2">Enter todo</div>

        <div className="flex items-center">
          <input
            className="px-1 py-1 text-black border border-black outline-[#2f363b]"
            type="text"
            name="todo"
            id="todo"
            value={modalTodo}
            onChange={(e) => setModalTodo(e.target.value)}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => handleSubmit()}
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
      </div>
     </div> 
  );
};

export default Modal;
