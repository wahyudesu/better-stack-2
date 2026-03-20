"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingToolbar = ({ 
  items = [], 
  className = "",
  onSelect
}) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState(items[0]?.id);
  const [direction, setDirection] = useState(0);

  const handleHover = (id) => {
    if (hoveredTab !== null && id !== null) {
      const prevIndex = items.findIndex((item) => item.id === hoveredTab);
      const nextIndex = items.findIndex((item) => item.id === id);
      setDirection(nextIndex > prevIndex ? 1 : -1);
    }
    setHoveredTab(id);
  };

  const handleSelect = (id) => {
    setActiveTab(id);
    if (onSelect) {
      onSelect(id);
    }
  }

  const hoveredItem = items.find((item) => item.id === hoveredTab);
  const hoveredIndex = items.findIndex((item) => item.id === hoveredTab);

  const ITEM_WIDTH = 44;
  const GAP = 4;
  const PADDING = 6;

  const tooltipX = hoveredItem ? PADDING + hoveredIndex * (ITEM_WIDTH + GAP) + ITEM_WIDTH / 2 : 0;
  const bgX = hoveredItem ? PADDING + hoveredIndex * (ITEM_WIDTH + GAP) : 0;

  return (
    <div className={`flex flex-col items-center justify-center w-full ${className}`}>
      <div 
        className="relative flex items-center gap-1 p-1.5 rounded-full bg-zinc-950 border border-zinc-800 shadow-xl shadow-black/20"
        onMouseLeave={() => setHoveredTab(null)}
      >
        <AnimatePresence>
          {hoveredTab && (
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-0 h-11 w-11 bg-zinc-900 rounded-full"
              initial={{ opacity: 0, x: bgX, scale: 0.95 }}
              animate={{ opacity: 1, x: bgX, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </AnimatePresence>

        {items.map((item) => (
          <ToolbarItem 
            key={item.id}
            item={item}
            hoveredTab={hoveredTab}
            setHoveredTab={handleHover}
            isActive={activeTab === item.id}
            setActiveTab={handleSelect}
          />
        ))}

        <AnimatePresence>
          {hoveredItem && (
             <motion.div
              key="tooltip"
              className="absolute -top-12 left-0 flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none overflow-hidden"
              initial={{ opacity: 0, y: 10, scale: 0.95, x: tooltipX, translateX: "-50%" }}
              animate={{ opacity: 1, y: 0, scale: 1, x: tooltipX, translateX: "-50%" }}
              exit={{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ 
                  type: "spring", stiffness: 300, damping: 25
              }}
            >
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div 
                  key={hoveredItem.id}
                  className="flex items-center gap-2"
                  custom={direction}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <span className="text-xs font-medium text-zinc-100">
                    {hoveredItem.label}
                  </span>
                  <span className="text-[10px] font-medium text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                    {hoveredItem.shortcut}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


const ToolbarItem = ({ item, hoveredTab, setHoveredTab, isActive, setActiveTab }) => {
  return (
    <button
      onClick={() => setActiveTab(item.id)}
      onMouseEnter={() => setHoveredTab(item.id)}
      className={`
        relative flex cursor-pointer items-center justify-center w-11 h-11 rounded-full transition-colors duration-200 outline-none
        ${isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}
      `}
    >
      <span className="relative z-10 text-xl">
        {item.icon}
      </span>

      {/* Notification Dot */}
      {item.hasDot && (
        <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-blue-500 rounded-full border border-zinc-800 z-20" />
      )}
    </button>
  );
};
