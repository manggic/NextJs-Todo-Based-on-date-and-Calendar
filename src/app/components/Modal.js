import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = ({ setShowModal, addTodo }) => {
  const [modalTodo, setModalTodo] = useState("");

  function handleSubmit() {
    if (modalTodo) {

      addTodo(modalTodo);
    } else {
      setModalTodo(false);
    }
  }

  return (
    <div className="h-52 bg-blue-300 py-20 px-16">
      <div
        onClick={() => setShowModal(false)}
        className="absolute right-3 top-3 text-black text-lg cursor-pointer"
      >
        <AiFillCloseCircle />
      </div>
      <div className="text-black">Enter todo</div>
      <input
        className="px-1 py-1 text-black"
        type="text"
        name="todo"
        id="todo"
        onChange={(e)=> setModalTodo(e.target.value)}
      />
      <button
        onClick={() => handleSubmit()}
        className="ml-2 border p-1 text-white-200 bg-gray-500"
        type="submit"
      >
        submit
      </button>
    </div>
  );
};

export default Modal;
