import { LOCAL_STORAGE_KEYS, SCHEMA_VERSION, SERVICE_GROUPS } from './constants';
import type { StoredServiceGroup } from './types';

export const runMigrations = () => {
    try {
        const storedVersionStr = localStorage.getItem(LOCAL_STORAGE_KEYS.DATA_SCHEMA_VERSION);
        const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 1;

        if (storedVersion < SCHEMA_VERSION) {
            console.log(`Schema version mismatch. Upgrading from v${storedVersion} to v${SCHEMA_VERSION}.`);

            // Migration path for any version < 20: Refresh core categories while maintaining custom ones.
            if (storedVersion < 20) {
                console.log("Running migration to schema v20 (Card Cleanup & Maeple Update)...");
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

            // Migration path for any version < 21: Remove WIDGETS, COLLECTIVE, 0RELIANCE LAB, and REMEMBERY
            if (storedVersion < 21) {
                console.log("Running migration to schema v21 (Remove specific categories)...");
                const rawGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS);
                try {
                    if (rawGroups) {
                        const userGroups = JSON.parse(rawGroups) as StoredServiceGroup[];
                        const categoriesToRemove = new Set(['WIDGETS', 'COLLECTIVE', '0RELIANCE LAB', 'REMEMBERY']);
                        const updatedGroups = userGroups.filter(g => !categoriesToRemove.has(g.category));
                        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, JSON.stringify(updatedGroups));
                    }
                } catch (e) {
                    console.error("Migration logic error:", e);
                }
            }

            // Migration path for any version < 22: Clear TOOLBOX and PROJECT SPACE
            if (storedVersion < 22) {
                console.log("Running migration to schema v22 (Clear TOOLBOX and PROJECT SPACE)...");
                const rawGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS);
                try {
                    if (rawGroups) {
                        const userGroups = JSON.parse(rawGroups) as StoredServiceGroup[];
                        const updatedGroups = userGroups.map(g => {
                            if (g.category === 'TOOLBOX' || g.category === 'PROJECT SPACE' || g.category === 'POZIVERSE') {
                                return { ...g, category: g.category === 'POZIVERSE' ? 'PROJECT SPACE' : g.category, services: [] };
                            }
                            return g;
                        });
                        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, JSON.stringify(updatedGroups));
                    }
                } catch (e) {
                    console.error("Migration logic error:", e);
                }
            }

            // Migration path for any version < 23: Force clear TOOLBOX and PROJECT SPACE and remove duplicates
            if (storedVersion < 23) {
                console.log("Running migration to schema v23 (Force clear TOOLBOX and PROJECT SPACE and remove duplicates)...");
                const rawGroups = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS);
                try {
                    if (rawGroups) {
                        const userGroups = JSON.parse(rawGroups) as StoredServiceGroup[];
                        const updatedGroups: StoredServiceGroup[] = [];
                        const seenCategories = new Set<string>();

                        for (const g of userGroups) {
                            let cat = g.category;
                            if (cat === 'POZIVERSE') {
                                cat = 'PROJECT SPACE';
                            }
                            
                            if (seenCategories.has(cat)) {
                                continue; // Skip duplicates
                            }
                            seenCategories.add(cat);

                            if (cat === 'TOOLBOX' || cat === 'PROJECT SPACE') {
                                updatedGroups.push({ ...g, category: cat, services: [] });
                            } else {
                                updatedGroups.push({ ...g, category: cat });
                            }
                        }

                        // Ensure TOOLBOX and PROJECT SPACE exist
                        if (!seenCategories.has('TOOLBOX')) {
                            updatedGroups.unshift({ category: 'TOOLBOX', services: [] });
                        }
                        if (!seenCategories.has('PROJECT SPACE')) {
                            updatedGroups.unshift({ category: 'PROJECT SPACE', services: [] });
                        }

                        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, JSON.stringify(updatedGroups));
                    }
                } catch (e) {
                    console.error("Migration logic error:", e);
                }
            }

            // Migration path for any version < 24: Collapse calculator by default
            if (storedVersion < 24) {
                console.log("Running migration to schema v24 (Collapse calculator by default)...");
                const rawCollapsed = localStorage.getItem(LOCAL_STORAGE_KEYS.COLLAPSED_CATEGORIES);
                try {
                    if (rawCollapsed) {
                        const collapsed = JSON.parse(rawCollapsed) as string[];
                        if (!collapsed.includes('__CALCULATOR__')) {
                            collapsed.push('__CALCULATOR__');
                            localStorage.setItem(LOCAL_STORAGE_KEYS.COLLAPSED_CATEGORIES, JSON.stringify(collapsed));
                        }
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
