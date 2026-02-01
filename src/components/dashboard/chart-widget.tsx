"use client";
import React from 'react';
export const ChartWidget = () => {
    return (<div className="w-full h-[400px] bg-card border border-border rounded-lg overflow-hidden relative flex items-center justify-center">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-primary font-bold">XAUUSD</span>
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-0.5 rounded">H1</span>
            </div>
            <div className="text-muted-foreground text-sm">
                Chart visualization (install lightweight-charts to enable)
            </div>
        </div>);
};
