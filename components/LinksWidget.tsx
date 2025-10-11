
import React, { useState } from 'react';
import type { Link } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { ICONS } from '../constants';

const LinksWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useLocalStorage<Link[]>('userLinks', []);
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLinkName.trim() && newLinkUrl.trim()) {
      const newLink: Link = {
        id: Date.now(),
        name: newLinkName.trim(),
        url: newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`
      };
      setLinks([...links, newLink]);
      setNewLinkName('');
      setNewLinkUrl('');
    }
  };

  const deleteLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white text-lg font-medium hover:underline">
        Links
      </button>

      {isOpen && (
        <div className="absolute top-12 left-4 w-72 bg-black/50 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl p-4 text-white">
          <ul className="space-y-2">
            {links.map(link => (
              <li key={link.id} className="group flex justify-between items-center hover:bg-white/10 p-1 rounded">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow truncate">{link.name}</a>
                <button onClick={() => deleteLink(link.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                  {ICONS.Trash}
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addLink} className="mt-4 pt-4 border-t border-white/20">
            <input
              type="text"
              placeholder="Name"
              value={newLinkName}
              onChange={e => setNewLinkName(e.target.value)}
              className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <input
              type="text"
              placeholder="URL"
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              className="w-full bg-white/10 p-2 rounded mt-2 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button type="submit" className="w-full bg-white/20 hover:bg-white/30 p-2 rounded mt-2 font-semibold">
              Add Link
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LinksWidget;
