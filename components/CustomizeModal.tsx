import React, { useState } from 'react';
// FIX: Import the new FlatIconKey type for safer icon selection.
import type { ServiceGroup, Service, IconKey, FlatIconKey } from '../types';
import { ICONS, SERVICE_GROUPS } from '../constants';

interface CustomizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentGroups: ServiceGroup[];
    onSave: (newGroups: ServiceGroup[]) => void;
}

// FIX: Use a type predicate to correctly type the filtered icon keys, ensuring only valid ReactNodes are used.
const iconOptions = Object.keys(ICONS).filter(
    (key): key is FlatIconKey => key !== 'GOOGLE' && key !== 'POZI'
);

const IconSelector: React.FC<{ selected: React.ReactNode; onSelect: (icon: React.ReactNode) => void; }> = ({ selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-2 bg-white/10 rounded h-full flex items-center">
                <div className="w-5 h-5">{selected}</div>
            </button>
            {isOpen && (
                <div className="absolute z-10 bottom-full mb-2 left-0 grid grid-cols-6 gap-1 bg-black/80 backdrop-blur-md border border-white/20 rounded p-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {iconOptions.map(key => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => { onSelect(ICONS[key]); setIsOpen(false); }}
                            className="p-1 rounded hover:bg-white/20"
                        >
                           <div className="w-5 h-5">{ICONS[key]}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const CustomizeModal: React.FC<CustomizeModalProps> = ({ isOpen, onClose, currentGroups, onSave }) => {
    const [groups, setGroups] = useState<ServiceGroup[]>(JSON.parse(JSON.stringify(currentGroups)));
    const [newServiceForms, setNewServiceForms] = useState<Record<string, {name: string, url: string}>>({});

    if (!isOpen) return null;

    const handleSave = () => {
        // Filter out any empty services that might have been added
        const cleanedGroups = groups.map(group => ({
            ...group,
            services: group.services.filter(service => service.name.trim() && service.url.trim()),
        }));
        onSave(cleanedGroups);
        onClose();
    };
    
    const handleResetToDefault = () => {
        if (window.confirm("Are you sure you want to reset all links and categories to the application defaults? This cannot be undone.")) {
            setGroups(JSON.parse(JSON.stringify(SERVICE_GROUPS)));
        }
    };

    const addCategory = () => {
        const newCategoryName = prompt("Enter new category name:");
        if (newCategoryName && !groups.find(g => g.category === newCategoryName)) {
            setGroups([...groups, { category: newCategoryName, services: [] }]);
        } else if (newCategoryName) {
            alert("A category with this name already exists.");
        }
    };

    const updateCategoryName = (oldName: string, newName: string) => {
        setGroups(groups.map(g => g.category === oldName ? { ...g, category: newName.trim() } : g));
    };

    const deleteCategory = (categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete the "${categoryName}" category and all its links?`)) {
            setGroups(groups.filter(g => g.category !== categoryName));
        }
    };
    
    const addService = (categoryName: string) => {
        const formState = newServiceForms[categoryName];
        if (!formState || !formState.name.trim() || !formState.url.trim()) {
            alert("Please provide a name and a URL for the new link.");
            return;
        }

        try {
            const url = formState.url;
            new URL(url.startsWith('http') ? url : `https://${url}`);
            const newService: Service = { name: formState.name, url, icon: ICONS.Globe };

            setGroups(groups.map(g => 
                g.category === categoryName 
                ? { ...g, services: [...g.services, newService] }
                : g
            ));
            // Reset form
            setNewServiceForms({...newServiceForms, [categoryName]: { name: '', url: '' }});
        } catch (e) {
            alert("Invalid URL provided. Please enter a full, valid URL (e.g., https://google.com)");
        }
    };
    
    const updateService = (categoryName: string, serviceIndex: number, newService: Partial<Service>) => {
        setGroups(groups.map(g => {
            if (g.category === categoryName) {
                const updatedServices = [...g.services];
                updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], ...newService };
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
    
    const handleNewServiceFormChange = (categoryName: string, field: 'name' | 'url', value: string) => {
        setNewServiceForms(prev => ({
            ...prev,
            [categoryName]: {
                ...prev[categoryName],
                [field]: value
            }
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
                    {groups.map((group) => (
                        <div key={group.category} className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <input
                                    type="text"
                                    value={group.category}
                                    onBlur={(e) => updateCategoryName(group.category, e.target.value)}
                                    onChange={(e) => setGroups(groups.map(g => g.category === group.category ? {...g, category: e.target.value} : g))}
                                    className="text-xl font-bold uppercase tracking-wider bg-transparent border-b-2 border-transparent focus:border-[var(--text-highlight)] focus:outline-none transition"
                                />
                                <button onClick={() => deleteCategory(group.category)} className="text-red-400 hover:text-red-300">
                                    <div className="w-5 h-5">{ICONS.Trash}</div>
                                </button>
                            </div>
                            <div className="space-y-2">
                                {group.services.map((service, serviceIndex) => (
                                    <div key={serviceIndex} className="flex items-center space-x-2 bg-black/20 p-2 rounded">
                                        <IconSelector selected={service.icon} onSelect={(icon) => updateService(group.category, serviceIndex, { icon })} />
                                        <input 
                                            type="text"
                                            value={service.name}
                                            onChange={(e) => updateService(group.category, serviceIndex, { name: e.target.value })}
                                            className="bg-white/10 p-2 rounded w-1/3 placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                            placeholder="Link Name"
                                        />
                                        <input 
                                            type="text"
                                            value={service.url}
                                            onChange={(e) => updateService(group.category, serviceIndex, { url: e.target.value })}
                                            className="bg-white/10 p-2 rounded flex-grow placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                            placeholder="Link URL"
                                        />
                                        <button onClick={() => deleteService(group.category, serviceIndex)} className="text-red-400 hover:text-red-300 p-2">
                                            <div className="w-5 h-5">{ICONS.Trash}</div>
                                        </button>
                                    </div>
                                ))}
                                {/* Add New Service Form */}
                                <form onSubmit={(e) => { e.preventDefault(); addService(group.category); }} className="flex items-center space-x-2 bg-black/20 p-2 rounded border-2 border-dashed border-white/20">
                                   <div className="p-2 h-full flex items-center text-white/50"><div className="w-5 h-5">{ICONS.Plus}</div></div>
                                   <input 
                                       type="text"
                                       value={newServiceForms[group.category]?.name || ''}
                                       onChange={(e) => handleNewServiceFormChange(group.category, 'name', e.target.value)}
                                       className="bg-white/10 p-2 rounded w-1/3 placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                       placeholder="New Link Name"
                                   />
                                   <input 
                                       type="text"
                                       value={newServiceForms[group.category]?.url || ''}
                                       onChange={(e) => handleNewServiceFormChange(group.category, 'url', e.target.value)}
                                       className="bg-white/10 p-2 rounded flex-grow placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                       placeholder="New Link URL"
                                   />
                                   <button type="submit" className="text-green-400 hover:text-green-300 p-2 font-bold text-sm">
                                       ADD
                                   </button>
                               </form>
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
