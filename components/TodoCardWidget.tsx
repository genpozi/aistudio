import React, { useState } from 'react';
import type { Todo } from '../types';
import { ICONS } from '../constants';

interface TodoCardWidgetProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isCollapsed: boolean;
  onToggle: () => void;
}

const TodoCardWidget: React.FC<TodoCardWidgetProps> = ({ todos, setTodos, isCollapsed, onToggle }) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [justAddedTodoId, setJustAddedTodoId] = useState<number | null>(null);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoText.trim(),
        completed: false
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setNewTodoText('');
      setJustAddedTodoId(newTodo.id);
      setTimeout(() => setJustAddedTodoId(null), 500);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  
  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }

  const sortedTodos = [...todos].sort((a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1);

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-500">
      <div className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center">
        <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">TO-DO LIST</h3>
        <button 
          onClick={onToggle} 
          className="text-white/60 hover:text-white transition-colors"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? `Expand To-Do List section` : `Collapse To-Do List section`}
        >
          <div className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
              {ICONS.ChevronUp}
          </div>
        </button>
      </div>
      <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
        <div className="p-6 pt-4 flex flex-col">
          <div className="flex-grow overflow-y-auto max-h-60 custom-scrollbar pr-2 -mr-2 mb-4">
            {sortedTodos.length > 0 ? (
              <ul className="space-y-2">
                {sortedTodos.map((todo) => (
                  <li 
                    key={todo.id} 
                    className={`group flex items-center justify-between hover:bg-white/10 p-2 rounded ${justAddedTodoId === todo.id ? 'animate-add-todo' : ''}`}
                  >
                    <div 
                      className="flex items-center cursor-pointer flex-grow" 
                      onClick={() => toggleTodo(todo.id)}
                      role="checkbox"
                      aria-checked={todo.completed}
                      tabIndex={0}
                      aria-labelledby={`todo-label-${todo.id}`}
                    >
                      <div 
                        className={`w-5 h-5 border-2 rounded ${todo.completed ? 'border-[var(--text-highlight)] bg-[var(--text-highlight)]' : 'border-white/50'} flex items-center justify-center mr-3 flex-shrink-0 transition-colors`}
                      >
                        {todo.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span 
                        id={`todo-label-${todo.id}`}
                        className={`truncate transition-colors ${todo.completed ? 'line-through text-white/50' : 'text-white'}`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(todo.id)} 
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0"
                      aria-label={`Delete todo: ${todo.text}`}
                    >
                      <div className="w-5 h-5">{ICONS.Trash}</div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4 text-white/70">
                All done! Add a new task below.
              </div>
            )}
          </div>
          <form onSubmit={addTodo} className="mt-auto pt-4 border-t border-white/20">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTodoText}
              onChange={e => setNewTodoText(e.target.value)}
              className="w-full bg-white/10 p-3 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoCardWidget;