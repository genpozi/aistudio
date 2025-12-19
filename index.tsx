import React, { Component, ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LOCAL_STORAGE_KEYS, SCHEMA_VERSION, SERVICE_GROUPS } from './constants';
import type { StoredServiceGroup } from './types';

// --- Start of Data Migration Logic ---
const runMigrations = () => {
    try {
        const storedVersionStr = localStorage.getItem(LOCAL_STORAGE_KEYS.DATA_SCHEMA_VERSION);
        const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 1;

        if (storedVersion < SCHEMA_VERSION) {
            console.log(`Schema version mismatch. Upgrading from v${storedVersion} to v${SCHEMA_VERSION}.`);

            // Migration path for any version < 19: Refresh core categories while maintaining custom ones.
            if (storedVersion < 19) {
                console.log("Running migration to schema v19 (Ecosystem Realignment)...");
                const rawGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS);
                try {
                    const correctedDefaults: StoredServiceGroup[] = SERVICE_GROUPS.map(dg => ({
                        category: dg.category,
                        services: dg.services.map(s => ({
                            name: s.name,
                            url: s.url,
                            iconKey: s.iconKey,
                            inProduction: s.inProduction
                        }))
                    }));
                    
                    if (rawGroups) {
                        const userGroups = JSON.parse(rawGroups) as StoredServiceGroup[];
                        const defaultCategories = new Set(SERVICE_GROUPS.map(g => g.category));
                        // Keep user-added custom categories, but refresh the default ones to apply layout overhaul
                        const customGroups = userGroups.filter(g => !defaultCategories.has(g.category));
                        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, JSON.stringify([...correctedDefaults, ...customGroups]));
                    } else {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, JSON.stringify(correctedDefaults));
                    }
                } catch (e) {
                    console.error("Migration logic error:", e);
                }
            }

            localStorage.setItem(LOCAL_STORAGE_KEYS.DATA_SCHEMA_VERSION, String(SCHEMA_VERSION));
            console.log("Migrations check completed.");
        }
    } catch (e) {
        console.error("Critical error during data migration:", e);
    }
};

runMigrations();
// --- End of Data Migration Logic ---

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Fix: Use imported 'Component' to correctly inherit state, setState, and props.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fix: Correctly initialize state on the inherited Component class.
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      window.location.reload();
    } catch (e) {
      // Fix: Use setState from inherited Component class.
      this.setState({ error: new Error("Recovery failed. Please clear site data manually.") });
    }
  }

  render() {
    // Fix: Access state and props from inherited Component class.
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm text-white flex flex-col justify-center items-center z-[100] p-6 text-center">
          <div className="max-w-xl bg-black/50 border border-orange-500/50 rounded-lg p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-orange-400">A Quick Tune-Up is Needed!</h1>
              <p className="mt-4 text-white/90">Layout data mismatch detected. Click below to refresh your dashboard.</p>
              {error && <p className="text-xs text-orange-300 font-mono mt-4 opacity-50">{error.toString()}</p>}
              <button onClick={this.handleReset} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded font-semibold transition-colors">
                Let's Get Tuned Up!
              </button>
          </div>
        </div>
      );
    }
    return children || null;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}