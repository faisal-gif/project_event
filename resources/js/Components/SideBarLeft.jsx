import React from 'react'
import {
    Calendar,
    GraduationCap,
    Trophy,
    Music,
    Presentation,
    Dumbbell,
    Star,
    Grid3X3
} from "lucide-react";
import Card from './ui/Card';

function SideBarLeft({ setSelectedCategory, selectedCategory }) {

    const categories = [
        { id: 1, icon: Grid3X3, label: "Semua", count: null },
        { id: 2, icon: Trophy, label: "Kontes AI", count: null },
        { id: 3, icon: Dumbbell, label: "Hiburan & Olahraga", count: null },
        { id: 4, icon: Music, label: "Konser & Festival", count: null },
        { id: 5, icon: Presentation, label: "Seminar & Talkshow", count: null },
        { id: 6, icon: GraduationCap, label: "Training & Workshop", count: null },
        { id: 7, icon: Calendar, label: "Kuis", count: null },
        { id: 8, icon: Star, label: "Lain-lain", count: null }
    ];

    return (
        <aside>
            <Card className="hidden lg:block m-4 w-60 border border-base-300">
                <div className="p-4 mb-6">
                    <h2 className="text-lg font-semibold text-primary mb-4">Kategori</h2>

                    <div className="space-y-2">
                        {categories.map((category, index) => {
                            const Icon = category.icon;
                            const isActive = selectedCategory === category.id;
                            return (
                                <button
                                    key={index}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-base-200 transition-colors group ${isActive ? 'bg-secondary' : ''}`}
                                    onClick={() => setSelectedCategory(category.id)}
                                >
                                    <Icon className="w-4 h-4 text-primary" />
                                    <span className={`text-sm font-medium group-hover:text-primary ${isActive ? 'text-primary' : 'text-base-content'}`}>
                                        {category.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Card>



        </aside>


    )
}

export default SideBarLeft;