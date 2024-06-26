import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTodoList,
  addTodo,
  updateTodo,
  sortTodo,
  toggleCompleted,
} from "../ToDoSlice";

import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";

function ToDoList() {
  const dispatch = useDispatch();
  const todoList = useSelector((state) => state.todo.todoList);
  const sortCriteria = useSelector((state) => state.todo.sortCriteria);

  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentToDO] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (todoList.length > 0) {
      localStorage.setItem("todolist", JSON.stringify(todoList));
    }
  }, [todoList]);

  useEffect(() => {
    const localToDoList = localStorage.getItem("todolist");

    if (localToDoList) {
      const data = JSON.parse(localToDoList);
      dispatch(setTodoList(data));
    }
  }, []);

  // Add todo to store
  const handleAddToDo = (task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(
        addTodo({
          task: task,
          id: Date.now(),
        })
      );
    }
    setNewTask("");
    setShowModal(false);
  };

  // onEnter task add
  const handleKeyPress = (e,task) => {
    console.log(e.key);
    if(e.key === 'Enter'){
      if (task.trim().length === 0) {
        alert("Please enter a task");
      } else {
        dispatch(
          addTodo({
            task: task,
            id: Date.now(),
          })
        );
      }
      setNewTask("");
      setShowModal(false);
    }
  }

  // update todo
  const handleUpdateTodoList = (id, task) => {
    if (task.trim().length === 0) {
      alert("Please enter a task");
    } else {
      dispatch(updateTodo({ task: task, id: id }));
    }
    setShowModal(false);
  };

  // delete todo
  const handleDeleteTodo = (id) => {
    const updatedTodoList = todoList.filter((todo) => todo.id != id);
    dispatch(setTodoList(updatedTodoList));
    localStorage.setItem("todolist", updatedTodoList);
  };

  // sort todo [completed, All, Not completed]
  const handleSort = (sortCriteria) => {
    dispatch(sortTodo(sortCriteria));
  };

  const sortTodoList = todoList.filter((todo) => {
    if (sortCriteria == "All") {
      return true;
    }
    if (sortCriteria === "Completed" && todo.completed) return true;
    if (sortCriteria === "Not Completed" && !todo.completed) return true;
    return false;
  });

  // complete todo
  const handleToggleCompleted = (id) => {
    dispatch(toggleCompleted(id));
  };

  return (
    <div>
      {showModal && (
        <div className="fixed w-full left-0 top-0 h-full bg-transparentBlack flex items-center justify-center">
          <div className="bg-white p-8 w-[400px] rounded-md flex flex-col">
            <input
              className="border p-2 rounded-md outline-none mb-8"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, newTask) }
              type="text"
              placeholder={
                currentTodo ? "Update your task here" : "Enter your task here"
              }
            />

            <div className="flex justify-between">
              {currentTodo ? (
                <>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-sunsetOrange text-white p-1 px-2 rounded-md ml-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleUpdateTodoList(currentTodo.id, newTask);
                    }}
                    className="bg-blue-500 text-white p-1 px-2 rounded-md ml-2"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white bg-Tangaroa rounded-md py-3 px-10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleAddToDo(newTask);
                    }}
                    className="text-white bg-sunsetOrange rounded-md py-3 px-10"
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col justify-center items-center">
        {todoList.length === 0 ? (
          <>
            <div className="mb-8">
              <div className="sm:w-[400px] sm:h-[400px] min-w-[250px]">
                <img
                  className="object-contain w-full h-full"
                  src="https://cdn.pixabay.com/photo/2022/05/22/17/22/to-do-7214069_1280.png"
                  alt="todoimage"
                />
              </div>
              <p className="text-center text-gray-400 font-semibold text-2xl mt-5">
                You have no todo's
              </p>
            </div>
          </>
        ) : (
          <div className="container mx-auto mt-6">
            <div className="flex justify-center mb-6">
              <select onClick={e => handleSort(e.target.value)} className="p-1 outline-none text-sm">
                <option className="text-sm" value="All">All</option>
                <option className="text-sm" value="Completed">Completed</option>
                <option className="text-sm" value="Not Completed">Not Completed</option>
              </select>
            </div>
            <div>
              {sortTodoList.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between mb-6 bg-[#edede9] mx-auto w-full md:w-[75%] rounded-md p-4"
                >
                  <div
                    onClick={() => handleToggleCompleted(todo.id)}
                    className={`${
                      todo.completed
                        ? "line-through text-xl font-semibold opacity-50"
                        : "text-black text-xl font-semibold"
                    }`}
                  >
                    {todo.task}
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCurrentToDO(todo);
                        setNewTask(todo.task);
                      }}
                      className="bg-blue-500 text-white p-1 rounded-md ml-2"
                    >
                      <TiPencil />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="bg-blue-50 text-sunsetOrange p-1 rounded-md ml-2"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="bg-sunsetOrange text-center text-white py-3 px-10 rounded-md"
        >
          Add Task
        </button>
      </div>
    </div>
  );
}

export default ToDoList;
