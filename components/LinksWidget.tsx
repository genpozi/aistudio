import React from 'react';
import type { Link } from '../types';
import Favicon from './Favicon';
import { ICONS } from '../constants';

const LinksWidget: React.FC<{ links: Link[]; onOpenSettings: () => void }> = ({ links, onOpenSettings }) => {
  const hasLinks = links.length > 0;

  return (
    <div className="flex items-center space-x-4">
      <h3 className="text-white font-bold text-lg uppercase tracking-wider">
        Links
      </h3>
      <div className="flex items-center flex-wrap gap-2">
        {hasLinks ? (
          links.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
              title={link.name}
            >
              <Favicon link={link} />
              <span className="text-white text-sm font-semibold leading-tight truncate pr-1">{link.name}</span>
            </a>
          ))
        ) : (
          <button
            onClick={onOpenSettings}
            className="group flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)] border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_15px_-5px_var(--color-glow)]"
          >
            <span className="w-4 h-4 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">{ICONS.Plus}</span>
            <span className="text-white text-sm font-semibold leading-tight">Add Link</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LinksWidget;
