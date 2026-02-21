import { LOCAL_STORAGE_KEYS, SCHEMA_VERSION, SERVICE_GROUPS } from './constants';
import type { StoredServiceGroup } from './types';

export const runMigrations = () => {
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
