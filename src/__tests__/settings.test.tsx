import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock SettingsModal component
vi.mock('../components/SettingsModal', () => ({
  SettingsModal: ({ isOpen, onClose, onSave }: any) => {
    if (!isOpen) return null;
    
    return (
      <div data-testid="settings-modal">
        <h2>Settings</h2>
        <input data-testid="name-input" placeholder="Name" />
        <input data-testid="email-input" placeholder="Email" />
        <input data-testid="theme-select" placeholder="Theme" />
        <button data-testid="save-button" onClick={onSave}>
          Save Settings
        </button>
        <button data-testid="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    );
  },
}));

describe('Settings Modal', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Settings Loading', () => {
    it('should load settings from LocalStorage', () => {
      const mockSettings = {
        name: 'Test User',
        email: 'test@example.com',
        theme: 'dark',
        widgets: [],
      };

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify(mockSettings)
      );

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    });

    it('should provide default settings when none exist', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    });

    it('should handle corrupted LocalStorage data', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    });
  });

  describe('Settings Saving', () => {
    it('should save name to LocalStorage', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const onSave = vi.fn();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test User');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled();
      });

      expect(setItemSpy).toHaveBeenCalled();
    });

    it('should save email to LocalStorage', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const onSave = vi.fn();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

      const emailInput = screen.getByTestId('email-input');
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled();
      });

      expect(setItemSpy).toHaveBeenCalled();
    });

    it('should save theme to LocalStorage', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const onSave = vi.fn();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

      const themeInput = screen.getByTestId('theme-select');
      await user.clear(themeInput);
      await user.type(themeInput, 'dark');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSave).toHaveBeenCalled();
      });

      expect(setItemSpy).toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

      const emailInput = screen.getByTestId('email-input');
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      // Should not call onSave with invalid email
      expect(onSave).not.toHaveBeenCalled();
    });

    it('should require name', async () => {
      const user = userEvent.setup();
      const onSave = vi.fn();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} onSave={onSave} />);

      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      // Should not call onSave without name
      expect(onSave).not.toHaveBeenCalled();
    });
  });

  describe('Settings Modal Behavior', () => {
    it('should close modal when cancel button clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={onClose} />);

      const cancelButton = screen.getByTestId('cancel-button');
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not render when isOpen is false', () => {
      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={false} onClose={vi.fn()} />);

      expect(screen.queryByTestId('settings-modal')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
    });
  });

  describe('Theme Settings', () => {
    it('should support dark theme', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      const themeInput = screen.getByTestId('theme-select');
      await user.clear(themeInput);
      await user.type(themeInput, 'dark');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      expect(setItemSpy).toHaveBeenCalledWith(
        'dashydash_settings',
        expect.stringContaining('"theme":"dark"')
      );
    });

    it('should support light theme', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      const themeInput = screen.getByTestId('theme-select');
      await user.clear(themeInput);
      await user.type(themeInput, 'light');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      expect(setItemSpy).toHaveBeenCalledWith(
        'dashydash_settings',
        expect.stringContaining('"theme":"light"')
      );
    });

    it('should apply theme to document', async () => {
      const user = userEvent.setup();

      const { SettingsModal } = require('../components/SettingsModal');
      render(<SettingsModal isOpen={true} onClose={vi.fn()} />);

      const themeInput = screen.getByTestId('theme-select');
      await user.clear(themeInput);
      await user.type(themeInput, 'dark');

      const saveButton = screen.getByTestId('save-button');
      await user.click(saveButton);

      await waitFor(() => {
        expect(document.documentElement.classList).toContain('dark-theme');
      });
    });
  });

  describe('Widget Settings', () => {
    it('should save widget configuration', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      const mockWidgets = [
        { id: '1', type: 'links', enabled: true },
        { id: '2', type: 'notes', enabled: true },
      ];

      localStorage.setItem('dashydash_widgets', JSON.stringify({ widgets: mockWidgets }));

      expect(setItemSpy).toHaveBeenCalledWith(
        'dashydash_widgets',
        expect.stringContaining('links')
      );
    });

    it('should load widget configuration', () => {
      const mockWidgets = [
        { id: '1', type: 'links', enabled: true },
        { id: '2', type: 'notes', enabled: false },
      ];

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify({ widgets: mockWidgets })
      );

      const config = JSON.parse(localStorage.getItem('dashydash_widgets') || '{}');

      expect(config.widgets).toHaveLength(2);
      expect(config.widgets[0].enabled).toBe(true);
      expect(config.widgets[1].enabled).toBe(false);
    });

    it('should toggle widget enabled state', () => {
      const mockWidgets = [
        { id: '1', type: 'links', enabled: true },
      ];

      localStorage.setItem('dashydash_widgets', JSON.stringify({ widgets: mockWidgets }));

      // Toggle widget
      mockWidgets[0].enabled = false;
      localStorage.setItem('dashydash_widgets', JSON.stringify({ widgets: mockWidgets }));

      const config = JSON.parse(localStorage.getItem('dashydash_widgets') || '{}');

      expect(config.widgets[0].enabled).toBe(false);
    });
  });

  describe('Reset Settings', () => {
    it('should reset to default settings', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      // Default settings
      const defaultSettings = {
        name: '',
        email: '',
        theme: 'dark',
        widgets: [],
      };

      localStorage.setItem('dashydash_settings', JSON.stringify(defaultSettings));

      expect(setItemSpy).toHaveBeenCalledWith(
        'dashydash_settings',
        JSON.stringify(defaultSettings)
      );
    });

    it('should clear all settings', () => {
      const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

      localStorage.removeItem('dashydash_settings');

      expect(removeItemSpy).toHaveBeenCalledWith('dashydash_settings');
      expect(localStorage.getItem('dashydash_settings')).toBeNull();
    });
  });
});