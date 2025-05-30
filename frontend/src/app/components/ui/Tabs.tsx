// components/Tabs.tsx
import { useState } from "react";
import { TabsProps } from "@/app/types/TabInterfaces";

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      <div className="flex space-x-4 border-b border-gray-600 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 text-sm font-medium transition-colors ${
              activeIndex === index
                ? "border-b-2 border-purple-500 text-purple-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-white">{tabs[activeIndex].content}</div>
    </div>
  );
}
