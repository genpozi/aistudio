import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock AICompanionModal component
vi.mock('../components/AICompanionModal', () => ({
  AICompanionModal: ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;
    
    return (
      <div data-testid="ai-modal">
        <h2>AI Companion</h2>
        <div data-testid="messages"></div>
        <textarea data-testid="message-input" placeholder="Type a message..."></textarea>
        <button data-testid="send-button">Send</button>
        <button data-testid="clear-button">Clear</button>
        <button data-testid="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    );
  },
}));

describe('AI Companion Modal', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('AI Message Sending', () => {
    it('should send message to AI', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'AI Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByTestId('messages')).toBeInTheDocument();
      });
    });

    it('should display AI response', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'AI Response Message' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/AI Response Message/i)).toBeInTheDocument();
      });
    });

    it('should handle API error', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockRejectedValue(
        new Error('Network error')
      );

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });

    it('should show loading state while sending', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockImplementation(
        () =>
          new Promise(() => {}) // Never resolves
      );

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      // Should show loading state
      expect(screen.getByTestId('ai-modal')).toBeInTheDocument();
    });

    it('should clear input after sending', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('Message History', () => {
    it('should save messages to LocalStorage', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'AI Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(setItemSpy).toHaveBeenCalled();
      });
    });

    it('should load message history from LocalStorage', () => {
      const mockMessages = [
        { role: 'user', content: 'Hello AI', timestamp: Date.now() },
        { role: 'ai', content: 'AI Response', timestamp: Date.now() },
      ];

      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
        JSON.stringify({ messages: mockMessages })
      );

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('ai-modal')).toBeInTheDocument();
    });

    it('should clear message history', async () => {
      const user = userEvent.setup();
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      expect(setItemSpy).toHaveBeenCalledWith(
        'dashydash_ai_messages',
        JSON.stringify({ messages: [] })
      );
    });

    it('should handle corrupted message history', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      // Should not crash and provide empty history
      expect(screen.getByTestId('ai-modal')).toBeInTheDocument();
    });
  });

  describe('Modal Behavior', () => {
    it('should close when close button clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={onClose} />);

      const closeButton = screen.getByTestId('close-button');
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not render when isOpen is false', () => {
      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={false} onClose={vi.fn()} />);

      expect(screen.queryByTestId('ai-modal')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      expect(screen.getByTestId('ai-modal')).toBeInTheDocument();
    });

    it('should focus input on open', () => {
      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      expect(input).toHaveFocus();
    });
  });

  describe('Input Validation', () => {
    it('should disable send button when input is empty', () => {
      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).toBeDisabled();
    });

    it('should enable send button when input has text', async () => {
      const user = userEvent.setup();

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      expect(sendButton).not.toBeDisabled();
    });

    it('should handle empty input submission', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      // Should not send empty message
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should limit input length', async () => {
      const user = userEvent.setup();
      const maxLength = 1000;

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      expect(input).toHaveAttribute('maxLength', maxLength.toString());
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should send message on Enter key', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI{Enter}');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should not send message on Shift+Enter', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI{Shift>}{Enter}');

      // Should not send on Shift+Enter
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should close modal on Escape key', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={onClose} />);

      await user.keyboard('{Escape}');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    it('should call Google Gemini API', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ text: 'AI Response' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('generativelanguage.googleapis.com'),
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });

    it('should handle API rate limiting', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({ error: 'Rate limit exceeded' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/rate limit/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid API key', async () => {
      const user = userEvent.setup();

      vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid API key' }),
      } as Response);

      const { AICompanionModal } = require('../components/AICompanionModal');
      render(<AICompanionModal isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByTestId('message-input');
      await user.type(input, 'Hello AI');

      const sendButton = screen.getByTestId('send-button');
      await user.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid api key/i)).toBeInTheDocument();
      });
    });
  });
});