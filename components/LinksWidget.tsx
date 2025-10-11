import React, { useState, useRef } from 'react';
import type { Link } from '../types';
import useOnClickOutside from '../hooks/useOnClickOutside';
import Favicon from './Favicon';

const LinksWidget: React.FC<{ links: Link[]; onOpenSettings: () => void }> = ({ links, onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const widgetRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(widgetRef, () => setIsOpen(false), isOpen);

  const handleManageClick = () => {
    setIsOpen(false);
    onOpenSettings();
  };

  return (
    <div ref={widgetRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white text-lg font-medium hover:underline">
        Links
      </button>

      {isOpen && (
        <div className="absolute top-12 left-4 w-72 bg-black/50 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl p-4 text-white">
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {links.length > 0 ? links.map(link => (
              <li key={link.id} className="group flex justify-between items-center hover:bg-white/10 p-1 rounded">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow truncate flex items-center space-x-3">
                    <Favicon link={link} />
                    <span>{link.name}</span>
                </a>
              </li>
            )) : (
              <li className="text-white/60 text-center py-4">No links added yet.</li>
            )}
          </ul>
          <div className="mt-4 pt-4 border-t border-white/20">
            <button onClick={handleManageClick} className="w-full text-center bg-white/20 hover:bg-white/30 p-2 rounded font-semibold">
              Manage Links
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksWidget;