import React, { useState } from 'react';
import type { Todo } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { ICONS, LOCAL_STORAGE_KEYS } from '../constants';

const TodoWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [todos, setTodos] = useLocalStorage<Todo[]>(LOCAL_STORAGE_KEYS.USER_TODOS, []);
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
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      setJustAddedTodoId(newTodo.id);
      setTimeout(() => {
        setJustAddedTodoId(null);
      }, 500); // Duration of animation
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };
  
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTodoText('');
    }
  };

  return (
    <div>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
        aria-expanded={isOpen}
        aria-label="Toggle task list"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span className="text-white text-sm font-semibold">Todo</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-4 w-80 bg-black/50 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl p-4 text-white max-h-[50vh] flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-[var(--text-highlight)]">My Tasks</h3>
          <ul className="space-y-2 overflow-y-auto flex-grow custom-scrollbar -mr-2 pr-2">
            {todos.map(todo => (
              <li 
                key={todo.id} 
                className={`group flex items-center justify-between hover:bg-white/10 p-2 rounded ${justAddedTodoId === todo.id ? 'animate-add-todo' : ''}`}
              >
                <div 
                  className="flex items-center cursor-pointer flex-grow" 
                  onClick={() => toggleTodo(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleTodo(todo.id);
                    }
                  }}
                  role="checkbox"
                  aria-checked={todo.completed}
                  tabIndex={0}
                  aria-labelledby={`todo-label-${todo.id}`}
                >
                  <div 
                    className={`w-5 h-5 border-2 rounded ${todo.completed ? 'border-[var(--text-highlight)]' : 'border-white/50'} flex items-center justify-center mr-3 flex-shrink-0 transition-colors`}
                    style={{ backgroundColor: todo.completed ? 'var(--text-highlight)' : 'transparent' }}
                  >
                    {todo.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                  </div>
                  <span 
                    id={`todo-label-${todo.id}`}
                    className={`truncate ${todo.completed ? 'line-through opacity-50' : ''}`}
                  >
                    {todo.text}
                  </span>
                </div>
                 <button 
                    onClick={() => deleteTodo(todo.id)} 
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0"
                    aria-label={`Delete todo: ${todo.text}`}
                 >
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
              onKeyDown={handleInputKeyDown}
              className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]"
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoWidget;