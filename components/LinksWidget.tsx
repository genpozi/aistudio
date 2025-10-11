import React, { useState, useEffect } from 'react';
import type { Link } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { ICONS } from '../constants';

// An internal component to render a link's favicon with a fallback.
const Favicon: React.FC<{ link: Link }> = ({ link }) => {
    const [hasError, setHasError] = useState(false);

    // Reset error state if the icon URL changes
    useEffect(() => {
        setHasError(false);
    }, [link.iconUrl]);

    if (hasError || !link.iconUrl) {
        return (
            <div className="w-4 h-4 flex items-center justify-center text-white/80" title="Generic link icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m9 9a9 9 0 00-9-9" /></svg>
            </div>
        );
    }

    return (
        <img
            src={link.iconUrl}
            alt={`${link.name} favicon`}
            className="w-4 h-4 rounded-sm"
            onError={() => setHasError(true)}
        />
    );
};


const LinksWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useLocalStorage<Link[]>('userLinks', []);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [error, setError] = useState('');

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const urlInput = newLinkUrl.trim();

    if (!urlInput) {
      return; // Do nothing if input is empty
    }

    let urlObject: URL;
    try {
      // First, try parsing the URL as is (e.g., 'https://google.com')
      urlObject = new URL(urlInput);
    } catch (_) {
      try {
        // If that fails, it might be missing a protocol (e.g., 'google.com')
        urlObject = new URL(`https://${urlInput}`);
      } catch (err) {
        // If it still fails, the URL is genuinely invalid
        console.error("Invalid URL provided:", urlInput, err);
        setError("Please enter a valid URL (e.g., google.com).");
        return;
      }
    }

    const fullUrl = urlObject.href;

    // Additional validation: check for duplicates
    if (links.some(link => link.url === fullUrl)) {
      setError("This link has already been added.");
      return;
    }

    const hostname = urlObject.hostname;
    const iconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    
    const name = hostname.replace(/^www\./, '').split('.')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    const newLink: Link = {
      id: Date.now(),
      name: capitalizedName,
      url: fullUrl,
      iconUrl: iconUrl,
    };

    setLinks(prevLinks => [...prevLinks, newLink]);
    setNewLinkUrl('');
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
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {links.map(link => (
              <li key={link.id} className="group flex justify-between items-center hover:bg-white/10 p-1 rounded">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-grow truncate flex items-center space-x-3">
                    <Favicon link={link} />
                    <span>{link.name}</span>
                </a>
                <button onClick={() => deleteLink(link.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity ml-2">
                  {ICONS.Trash}
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addLink} className="mt-4 pt-4 border-t border-white/20">
            <input
              type="text"
              placeholder="Enter a URL to add..."
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="New link URL"
            />
             {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            <button type="submit" className="w-full bg-white/20 hover:bg-white/30 p-2 rounded mt-2 font-semibold">
              + Add New Link
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LinksWidget;