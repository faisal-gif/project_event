import React from 'react';
import { Grid3X3 } from "lucide-react";
import Card from './ui/Card';
import DynamicIcon from './DynamicIcon';

function SideBarLeft({ setSelectedCategory, selectedCategory, categories }) {

    const allCategories = [
        { id: 1, icon: 'Grid3x3', name: "Semua" },
        ...categories
    ];

    return (
        <aside>
            <Card className="hidden lg:block m-4 w-60 border border-base-300">
                <div className="p-4 mb-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">Kategori</h2>

                    <div className="space-y-2">
                        {allCategories.map((category, index) => {
                            const isActive = selectedCategory === category.id;
                            return (
                                <button
                                    key={index}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-base-200 transition-colors group ${isActive ? 'bg-secondary' : ''}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    <DynamicIcon name={category.icon} className="w-4 h-4 text-primary" />
                                    <span className={`text-sm font-medium group-hover:text-primary ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                        {category.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Card>
        </aside>
    );
}

export default SideBarLeft;