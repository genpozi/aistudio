
import React, { useState } from 'react';
import type { Todo } from '../types';
import { ICONS } from '../constants';

interface TodoCardWidgetProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isCollapsed: boolean;
  onToggleIndividual: () => void;
  onToggleRow: () => void;
}

const TodoCardWidget: React.FC<TodoCardWidgetProps> = ({ todos, setTodos, isCollapsed, onToggleIndividual, onToggleRow }) => {
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
    <div className="relative group/card h-full">
      <div className="absolute -inset-[1px] rounded-xl bg-amber-500/20 opacity-0 group-hover/card:opacity-100 blur-[1px] transition-opacity duration-500"></div>

      <div className="relative h-full bg-amber-900/10 backdrop-blur-xl rounded-xl border border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-500">
        <div 
            className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center cursor-pointer select-none group/header"
            onClick={onToggleRow}
            title="Click to toggle entire row"
        >
          <h3 className="text-amber-400 font-black text-lg uppercase tracking-wider drop-shadow-sm group-hover/header:text-amber-200 transition-colors">TO-DO LIST</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleIndividual(); }} 
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-expanded={!isCollapsed}
            title="Toggle this card only"
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
                      className={`group/item flex items-center justify-between hover:bg-amber-400/10 p-2 rounded transition-colors ${justAddedTodoId === todo.id ? 'animate-add-todo' : ''}`}
                    >
                      <div 
                        className="flex items-center cursor-pointer flex-grow" 
                        onClick={() => toggleTodo(todo.id)}
                        role="checkbox"
                        aria-checked={todo.completed}
                      >
                        <div 
                          className={`w-5 h-5 border-2 rounded ${todo.completed ? 'border-amber-400 bg-amber-400' : 'border-amber-400/40'} flex items-center justify-center mr-3 flex-shrink-0 transition-all`}
                        >
                          {todo.completed && (
                            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={`truncate transition-colors font-medium ${todo.completed ? 'line-through text-white/40' : 'text-white'}`}>
                          {todo.text}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteTodo(todo.id)} 
                        className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0"
                      >
                        <div className="w-5 h-5">{ICONS.Trash}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4 text-white/50 italic">
                  All done! Add a task below.
                </div>
              )}
            </div>
            <form onSubmit={addTodo} className="mt-auto pt-4 border-t border-amber-500/20">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodoText}
                onChange={e => setNewTodoText(e.target.value)}
                className="w-full bg-black/40 border border-amber-500/20 p-3 rounded-lg text-white placeholder:text-amber-100/30 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCardWidget;
