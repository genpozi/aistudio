import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// --- Start of ErrorBoundary implementation ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: Initialized state as a class property instead of in the constructor.
  // This is a more modern syntax and resolves the suite of errors related to `this.state`,
  // `this.props`, and `this.setState` not being found on the component instance.
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    try {
      console.warn("Attempting to recover from critical error by clearing localStorage.");
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error("Failed to clear localStorage during recovery.", e);
      this.setState({ error: new Error("Automatic recovery failed. Please clear your browser's site data and refresh manually.") });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm text-white flex flex-col justify-center items-center z-[100] p-6 text-center"
          style={{ fontFamily: 'sans-serif' }}
        >
          <div className="max-w-xl bg-black/50 border border-red-500/50 rounded-lg p-8 shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-3xl font-bold text-red-400">Application Error</h1>
              <p className="mt-4 text-white/90">
                Sorry, the application has encountered a problem and cannot start. This sometimes happens after an update if the stored data is in an old format.
              </p>
              <p className="mt-2 text-white/90">
                Clicking the button below will reset your dashboard settings and reload the page, which should fix the issue.
              </p>
              {this.state.error && (
                <div className="mt-4 text-left bg-black/40 p-3 rounded-md">
                    <p className="text-xs text-red-300 font-mono break-words">{this.state.error.toString()}</p>
                </div>
              )}
              <button 
                onClick={this.handleReset} 
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white text-lg px-6 py-3 rounded font-semibold transition-colors"
              >
                Reset and Reload Application
              </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
// --- End of ErrorBoundary implementation ---

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
