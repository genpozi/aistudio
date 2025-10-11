
import React, { useState } from 'react';
import type { Todo } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { ICONS } from '../constants';

const TodoWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useLocalStorage<Todo[]>('userTodos', []);
  const [newTodoText, setNewTodoText] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white text-lg font-medium hover:underline">
        Todo
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-4 w-80 bg-black/50 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl p-4 text-white max-h-[50vh] flex flex-col">
          <h3 className="text-xl font-bold mb-4">My Tasks</h3>
          <ul className="space-y-2 overflow-y-auto flex-grow">
            {todos.map(todo => (
              <li key={todo.id} className="group flex items-center justify-between hover:bg-white/10 p-2 rounded">
                <div className="flex items-center cursor-pointer" onClick={() => toggleTodo(todo.id)}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="h-5 w-5 rounded bg-transparent border-2 border-white/50 text-blue-500 focus:ring-0"
                  />
                  <span className={`ml-3 ${todo.completed ? 'line-through opacity-50' : ''}`}>{todo.text}</span>
                </div>
                 <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                  {ICONS.Trash}
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addTodo} className="mt-4 pt-4 border-t border-white/20">
            <input
              type="text"
              placeholder="New Todo"
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoWidget;
