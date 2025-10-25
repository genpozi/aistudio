
import React, { ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LOCAL_STORAGE_KEYS, SCHEMA_VERSION } from './constants';
import type { StoredServiceGroup } from './types';

// --- Start of Data Migration Logic ---
const runMigrations = () => {
    try {
        const storedVersion = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.DATA_SCHEMA_VERSION) || '1', 10);

        if (storedVersion < SCHEMA_VERSION) {
            console.log(`Schema version mismatch. Upgrading from v${storedVersion} to v${SCHEMA_VERSION}.`);

            // --- Migration from v1 to v2 ---
            // Goal: Remove non-serializable 'icon' property from services and ensure 'iconKey' exists.
            if (storedVersion < 2) {
                console.log("Running migration to schema v2 for 'userServiceGroups'...");
                const rawGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS);
                if (rawGroups) {
                    try {
                        const groups = JSON.parse(rawGroups);
                        if (!Array.isArray(groups)) throw new Error("Service groups data is not an array.");

                        const migratedGroups: StoredServiceGroup[] = groups.map((group: any) => ({
                            category: group.category || "Untitled",
                            services: (Array.isArray(group.services) ? group.services : []).map((service: any) => {
                                // Create a new object with only the properties we want to keep.
                                const migratedService = {
                                    name: service.name || 'Unnamed Link',
                                    url: service.url || '',
                                    // Use existing iconKey, or default to 'Globe'. This is the core fix.
                                    iconKey: typeof service.iconKey === 'string' ? service.iconKey : 'Globe',
                                    inProduction: !!service.inProduction,
                                };
                                return migratedService;
                            }),
                        }));

                        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, JSON.stringify(migratedGroups));
                        console.log("Successfully migrated service groups to v2 schema.");
                    } catch (e) {
                        console.error("Migration failed for 'userServiceGroups'. Data may be corrupt. If the app fails to load, the ErrorBoundary will offer a reset.", e);
                        // Do not update schema version if a critical migration fails.
                        return;
                    }
                }
            }

            // --- Future migrations would go here in `if (storedVersion < 3) { ... }` blocks ---

            // If all migrations succeed, update the schema version.
            localStorage.setItem(LOCAL_STORAGE_KEYS.DATA_SCHEMA_VERSION, String(SCHEMA_VERSION));
            console.log("All migrations completed successfully.");
        }
    } catch (e) {
        console.error("A critical error occurred during the migration process:", e);
    }
};

runMigrations();
// --- End of Data Migration Logic ---


// --- Start of ErrorBoundary implementation ---
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// FIX: The `ErrorBoundary` class component must extend `React.Component` to gain access to component features like `state`, `props`, and lifecycle methods. This resolves the errors regarding missing `setState` and `props`.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm text-white flex flex-col justify-center items-center z-[100] p-6 text-center"
          style={{ fontFamily: 'sans-serif' }}
        >
          <div className="max-w-xl bg-black/50 border border-orange-500/50 rounded-lg p-8 shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.658c-.007.379.137.753.43.992l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.075.124a6.57 6.57 0 0 1-.22.127c-.332.183-.582.495-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-1.658c.007-.379-.137-.753-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.431l1.296-2.247a1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.075-.124.072-.044.146-.087.22-.127.332-.183.582-.495-.645-.87l.213-1.281Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              <h1 className="text-3xl font-bold text-orange-400">A Quick Tune-Up is Needed!</h1>
              <p className="mt-4 text-white/90">
                Whoops! It looks like we've rolled out some awesome updates, but your dashboard's old settings are a bit confused by the new layout.
              </p>
              <p className="mt-2 text-white/90">
                This is perfectly normal after an upgrade! Just hit the button below to get everything synced up and back in hyperspeed.
              </p>
              {this.state.error && (
                <div className="mt-4 text-left bg-black/40 p-3 rounded-md">
                    <p className="text-xs text-orange-300 font-mono break-words">{this.state.error.toString()}</p>
                </div>
              )}
              <button 
                onClick={this.handleReset} 
                className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded font-semibold transition-colors"
              >
                Let's Get Tuned Up!
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
