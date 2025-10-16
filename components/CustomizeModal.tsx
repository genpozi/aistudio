import React, { useState } from 'react';
import type { ServiceGroup, Service } from '../types';
import { ICONS, SERVICE_GROUPS } from '../constants';

interface CustomizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentGroups: ServiceGroup[];
    onSave: (newGroups: ServiceGroup[]) => void;
}

const getIconForService = (): React.ReactNode => {
    const iconKeys = Object.keys(ICONS);
    const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    return ICONS[randomKey as keyof typeof ICONS];
};


const CustomizeModal: React.FC<CustomizeModalProps> = ({ isOpen, onClose, currentGroups, onSave }) => {
    const [groups, setGroups] = useState<ServiceGroup[]>(JSON.parse(JSON.stringify(currentGroups))); // Deep copy

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(groups);
        onClose();
    };
    
    const handleResetToDefault = () => {
        if (window.confirm("Are you sure you want to reset all links and categories to the application defaults? This cannot be undone.")) {
            setGroups(JSON.parse(JSON.stringify(SERVICE_GROUPS)));
        }
    };

    // Category CRUD
    const addCategory = () => {
        const newCategoryName = prompt("Enter new category name:");
        if (newCategoryName && !groups.find(g => g.category === newCategoryName)) {
            setGroups([...groups, { category: newCategoryName, services: [] }]);
        } else if (newCategoryName) {
            alert("A category with this name already exists.");
        }
    };

    const updateCategoryName = (oldName: string, newName: string) => {
        if (!newName.trim()) return;
        setGroups(groups.map(g => g.category === oldName ? { ...g, category: newName.trim() } : g));
    };

    const deleteCategory = (categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete the "${categoryName}" category and all its links?`)) {
            setGroups(groups.filter(g => g.category !== categoryName));
        }
    };

    // Service/Link CRUD
    const addService = (categoryName: string) => {
        const name = prompt("Enter link name:");
        if (!name) return;
        const url = prompt("Enter link URL:");
        if (!url) return;

        try {
            // Basic URL validation
            new URL(url.startsWith('http') ? url : `https://${url}`);
            const newService: Service = { name, url, icon: getIconForService() };

            setGroups(groups.map(g => 
                g.category === categoryName 
                ? { ...g, services: [...g.services, newService] }
                : g
            ));
        } catch (e) {
            alert("Invalid URL provided. Please enter a full, valid URL (e.g., https://google.com)");
        }
    };
    
    const updateService = (categoryName: string, serviceIndex: number, newService: Service) => {
        setGroups(groups.map(g => {
            if (g.category === categoryName) {
                const updatedServices = [...g.services];
                updatedServices[serviceIndex] = newService;
                return { ...g, services: updatedServices };
            }
            return g;
        }));
    };

    const deleteService = (categoryName: string, serviceIndex: number) => {
        setGroups(groups.map(g => {
            if (g.category === categoryName) {
                const updatedServices = g.services.filter((_, i) => i !== serviceIndex);
                return { ...g, services: updatedServices };
            }
            return g;
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-4xl bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between border-b border-white/20 p-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold">Customize Dashboard Links</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none">&times;</button>
                </header>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
                    {groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <input
                                    type="text"
                                    value={group.category}
                                    onChange={(e) => updateCategoryName(group.category, e.target.value)}
                                    className="text-xl font-bold uppercase tracking-wider bg-transparent border-b-2 border-transparent focus:border-[var(--text-highlight)] focus:outline-none transition"
                                />
                                <button onClick={() => deleteCategory(group.category)} className="text-red-400 hover:text-red-300">
                                    {ICONS.Trash}
                                </button>
                            </div>
                            <div className="space-y-2">
                                {group.services.map((service, serviceIndex) => (
                                    <div key={serviceIndex} className="flex items-center space-x-2 bg-black/20 p-2 rounded">
                                        <input 
                                            type="text"
                                            value={service.name}
                                            onChange={(e) => updateService(group.category, serviceIndex, {...service, name: e.target.value})}
                                            className="bg-white/10 p-2 rounded w-1/3 placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                            placeholder="Link Name"
                                        />
                                        <input 
                                            type="text"
                                            value={service.url}
                                            onChange={(e) => updateService(group.category, serviceIndex, {...service, url: e.target.value})}
                                            className="bg-white/10 p-2 rounded flex-grow placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                            placeholder="Link URL"
                                        />
                                        <button onClick={() => deleteService(group.category, serviceIndex)} className="text-red-400 hover:text-red-300 p-2">
                                            {ICONS.Trash}
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addService(group.category)} className="w-full text-center p-2 mt-2 rounded bg-white/10 hover:bg-white/20 transition-colors font-semibold">
                                    + Add Link
                                </button>
                            </div>
                        </div>
                    ))}
                     <button onClick={addCategory} className="w-full text-center p-3 mt-4 rounded bg-white/20 hover:bg-white/30 transition-colors font-bold text-lg">
                        + Add New Category
                    </button>
                </div>

                <footer className="p-4 border-t border-white/20 flex-shrink-0 flex justify-between items-center">
                    <button 
                        onClick={handleResetToDefault} 
                        className="bg-red-600/50 hover:bg-red-600/70 px-6 py-2 rounded font-semibold transition-colors"
                    >
                        Reset to Default Layout
                    </button>
                    <div className="space-x-4">
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded font-semibold transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-[var(--text-highlight)] hover:opacity-90 text-white px-6 py-2 rounded font-semibold transition-opacity">
                            Save & Close
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default CustomizeModal;