import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const Modal = ({ setShowModal, addTodo, editTodoInfo , editTodo}) => {
  const [modalTodo, setModalTodo] = useState(editTodoInfo?.todo?.name || '');


  function handleSubmit() {
  

    if(editTodoInfo?.todo?.name){
      editTodo( {name:modalTodo, status:editTodoInfo.todo.status  }  )
    }else if (modalTodo) {
      addTodo(modalTodo);
    } else {
      setModalTodo(false);
    }
  }

  return (
    <div className="h-52 bg-gray-50 py-20 px-16">
      <div
        onClick={() => setShowModal(false)}
        className="absolute right-3 top-3 text-black text-lg cursor-pointer"
      >
        <AiFillCloseCircle />
      </div>
      <div className="text-black">Enter todo</div>
      <input
        className="px-1 py-1 text-black border border-black"
        type="text"
        name="todo"
        id="todo"
        value={modalTodo}
        onChange={(e) => setModalTodo(e.target.value)}
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
