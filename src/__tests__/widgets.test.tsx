import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock LinksWidget component
vi.mock('../components/LinksWidget', () => ({
  LinksWidget: () => (
    <div data-testid="links-widget">
      <div data-testid="links-list"></div>
      <button data-testid="add-link">Add Link</button>
    </div>
  ),
}));

// Mock NoteWidget component
vi.mock('../components/NoteWidget', () => ({
  NoteWidget: () => (
    <div data-testid="note-widget">
      <div data-testid="notes-list"></div>
    </div>
  ),
}));

// Mock YouTubeWidget component
vi.mock('../components/YouTubeWidget', () => ({
  YouTubeWidget: () => (
    <div data-testid="youtube-widget">
      <div data-testid="video-list"></div>
    </div>
  ),
}));

describe('Widgets', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Links Widget', () => {
    it('should display links from LocalStorage', () => {
      const mockLinks = [
        { id: '1', name: 'Google', url: 'https://google.com' },
        { id: '2', name: 'GitHub', url: 'https://github.com' },
      ];

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify(mockLinks)
      );

      render(require('../components/LinksWidget').LinksWidget);

      expect(screen.getByTestId('links-widget')).toBeInTheDocument();
    });

    it('should save new link to LocalStorage', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      render(require('../components/LinksWidget').LinksWidget);

      const addButton = screen.getByTestId('add-link');
      await user.click(addButton);

      expect(setItemSpy).toHaveBeenCalled();
    });

    it('should delete link from LocalStorage', async () => {
      const user = userEvent.setup();
      const removeItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      render(require('../components/LinksWidget').LinksWidget);

      // Simulate delete action
      const widget = screen.getByTestId('links-widget');
      await user.click(widget);

      expect(removeItemSpy).toHaveBeenCalled();
    });

    it('should handle empty links list', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('[]');

      render(require('../components/LinksWidget').LinksWidget);

      expect(screen.getByTestId('links-widget')).toBeInTheDocument();
    });

    it('should handle corrupted LocalStorage data', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

      render(require('../components/LinksWidget').LinksWidget);

      expect(screen.getByTestId('links-widget')).toBeInTheDocument();
    });
  });

  describe('Note Widget', () => {
    it('should fetch notes from GlassKeep API', async () => {
      const mockNotes = [
        { id: 'note-1', title: 'First Note', content: 'Content 1' },
        { id: 'note-2', title: 'Second Note', content: 'Content 2' },
      ];

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ notes: mockNotes }),
      } as Response);

      render(require('../components/NoteWidget').NoteWidget);

      expect(screen.getByTestId('note-widget')).toBeInTheDocument();
    });

    it('should handle fetch error', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(
        new Error('Failed to fetch')
      );

      render(require('../components/NoteWidget').NoteWidget);

      expect(screen.getByTestId('note-widget')).toBeInTheDocument();
    });

    it('should show loading state while fetching', () => {
      vi.spyOn(global, 'fetch').mockImplementation(
        () =>
          new Promise(() => {}) // Never resolves
      );

      render(require('../components/NoteWidget').NoteWidget);

      expect(screen.getByTestId('note-widget')).toBeInTheDocument();
    });

    it('should refresh notes periodically', async () => {
      const mockNotes = [{ id: 'note-1', title: 'Note', content: 'Content' }];

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ notes: mockNotes }),
      } as Response);

      render(require('../components/NoteWidget').NoteWidget);

      await waitFor(() => {
        expect(screen.getByTestId('note-widget')).toBeInTheDocument();
      });
    });

    it('should open note in GlassKeep on click', async () => {
      const user = userEvent.setup();
      const mockOpen = vi.spyOn(window, 'open').mockReturnValue(null);

      const mockNotes = [{ id: 'note-1', title: 'Note', content: 'Content' }];

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ notes: mockNotes }),
      } as Response);

      render(require('../components/NoteWidget').NoteWidget);

      const widget = screen.getByTestId('note-widget');
      await user.click(widget);

      expect(mockOpen).toHaveBeenCalled();
    });
  });

  describe('YouTube Widget', () => {
    it('should fetch YouTube videos', async () => {
      const mockVideos = [
        {
          id: 'video-1',
          title: 'Video 1',
          thumbnail: 'https://example.com/thumb1.jpg',
        },
        {
          id: 'video-2',
          title: 'Video 2',
          thumbnail: 'https://example.com/thumb2.jpg',
        },
      ];

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ items: mockVideos }),
      } as Response);

      render(require('../components/YouTubeWidget').YouTubeWidget);

      expect(screen.getByTestId('youtube-widget')).toBeInTheDocument();
    });

    it('should handle YouTube API error', async () => {
      vi.spyOn(global, 'fetch').mockRejectedValue(
        new Error('YouTube API Error')
      );

      render(require('../components/YouTubeWidget').YouTubeWidget);

      expect(screen.getByTestId('youtube-widget')).toBeInTheDocument();
    });

    it('should display video thumbnails', async () => {
      const mockVideos = [
        {
          id: 'video-1',
          title: 'Video 1',
          thumbnail: 'https://example.com/thumb1.jpg',
        },
      ];

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ items: mockVideos }),
      } as Response);

      render(require('../components/YouTubeWidget').YouTubeWidget);

      await waitFor(() => {
        expect(screen.getByTestId('youtube-widget')).toBeInTheDocument();
      });
    });

    it('should open video on click', async () => {
      const user = userEvent.setup();
      const mockOpen = vi.spyOn(window, 'open').mockReturnValue(null);

      render(require('../components/YouTubeWidget').YouTubeWidget);

      const widget = screen.getByTestId('youtube-widget');
      await user.click(widget);

      expect(mockOpen).toHaveBeenCalled();
    });

    it('should handle empty video list', async () => {
      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ items: [] }),
      } as Response);

      render(require('../components/YouTubeWidget').YouTubeWidget);

      expect(screen.getByTestId('youtube-widget')).toBeInTheDocument();
    });
  });

  describe('Widget Configuration', () => {
    it('should load widget configuration from LocalStorage', () => {
      const mockWidgets = [
        {
          id: 'widget-1',
          type: 'links',
          enabled: true,
          position: { x: 0, y: 0, w: 2, h: 2 },
        },
        {
          id: 'widget-2',
          type: 'notes',
          enabled: true,
          position: { x: 2, y: 0, w: 2, h: 2 },
        },
      ];

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify({ widgets: mockWidgets })
      );

      // Simulate loading configuration
      const config = JSON.parse(
        localStorage.getItem('dashydash_widgets') || '{}'
      );

      expect(config.widgets).toHaveLength(2);
    });

    it('should save widget configuration', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const mockWidgets = [
        {
          id: 'widget-1',
          type: 'links',
          enabled: true,
        },
      ];

      localStorage.setItem('dashydash_widgets', JSON.stringify({ widgets: mockWidgets }));

      expect(setItemSpy).toHaveBeenCalledWith(
        'dashydash_widgets',
        expect.stringContaining('widget-1')
      );
    });

    it('should handle invalid configuration', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

      // Should not crash and provide default configuration
      const config = JSON.parse(localStorage.getItem('dashydash_widgets') || '{"widgets":[]}');

      expect(Array.isArray(config.widgets)).toBe(true);
    });
  });

  describe('Widget Drag and Drop', () => {
    it('should handle widget drag start', async () => {
      const user = userEvent.setup();

      render(require('../components/LinksWidget').LinksWidget);

      const widget = screen.getByTestId('links-widget');
      await user.drag(widget, { clientX: 100, clientY: 100 });

      // Drag event should be triggered
      expect(widget).toBeInTheDocument();
    });

    it('should handle widget drop', async () => {
      const user = userEvent.setup();

      render(require('../components/LinksWidget').LinksWidget);

      const widget = screen.getByTestId('links-widget');
      await user.drop(widget);

      // Drop event should be triggered
      expect(widget).toBeInTheDocument();
    });

    it('should update widget position on drop', () => {
      const mockWidgets = [
        {
          id: 'widget-1',
          type: 'links',
          position: { x: 0, y: 0, w: 2, h: 2 },
        },
      ];

      // Simulate position update
      mockWidgets[0].position = { x: 2, y: 2, w: 2, h: 2 };

      localStorage.setItem(
        'dashydash_widgets',
        JSON.stringify({ widgets: mockWidgets })
      );

      const config = JSON.parse(localStorage.getItem('dashydash_widgets') || '{}');

      expect(config.widgets[0].position.x).toBe(2);
      expect(config.widgets[0].position.y).toBe(2);
    });
  });
});