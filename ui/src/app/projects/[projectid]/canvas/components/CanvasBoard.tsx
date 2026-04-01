"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text } from "react-konva";
import { Pointer, Hand, Square, Circle as CircleIcon, Type } from "lucide-react";
import Konva from "konva";

type ToolType = "pointer" | "hand" | "rectangle" | "circle" | "text";

interface CanvasItem {
  id: string;
  type: "rectangle" | "circle" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  color: string;
}

export default function CanvasBoard() {
  const [activeTool, setActiveTool] = useState<ToolType>("hand");
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);
  
  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    // Initial size
    handleResize();
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Fix for next.js sometimes reporting 0 at initial mount due to CSS loading
    setTimeout(handleResize, 100);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: any) => {
    if (activeTool === "pointer" || activeTool === "hand") {
      return; 
    }

    const stage = e.target.getStage();
    const point = stage.getRelativePointerPosition();
    if (!point) return;

    setIsDrawing(true);
    const id = Date.now().toString();

    let newItem: CanvasItem = {
      id,
      type: "rectangle",
      x: point.x,
      y: point.y,
      color: "#2563eb", // Tailwind blue-600
    };

    if (activeTool === "rectangle") {
      newItem = { ...newItem, type: "rectangle", width: 0, height: 0 };
    } else if (activeTool === "circle") {
      newItem = { ...newItem, type: "circle", radius: 0 };
    } else if (activeTool === "text") {
      newItem = { ...newItem, type: "text", text: "Double click to edit text", color: "#000000" };
      setIsDrawing(false); // Text is click-to-drop
    }

    setItems([...items, newItem]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing || activeTool === "pointer" || activeTool === "hand" || activeTool === "text") {
      return;
    }

    const stage = e.target.getStage();
    const point = stage.getRelativePointerPosition();
    if (!point) return;

    setItems((prevItems) => {
      const lastItem = { ...prevItems[prevItems.length - 1] };
      
      if (lastItem.type === "rectangle") {
        lastItem.width = point.x - lastItem.x;
        lastItem.height = point.y - lastItem.y;
      } else if (lastItem.type === "circle") {
        const dx = point.x - lastItem.x;
        const dy = point.y - lastItem.y;
        lastItem.radius = Math.sqrt(dx * dx + dy * dy);
      }
      
      const newItems = [...prevItems];
      newItems[newItems.length - 1] = lastItem;
      return newItems;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  
  // Add a simple zoom feature via trackpad or mouse wheel
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Zoom speed
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Set boundaries
    newScale = Math.max(0.1, Math.min(newScale, 10));

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] min-h-[600px] overflow-hidden bg-slate-50 border border-slate-200 rounded-lg shadow-inner" ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          draggable={activeTool === "hand"}
          ref={stageRef}
          style={{ cursor: activeTool === "hand" ? "grab" : (activeTool === "pointer" ? "default" : "crosshair") }}
        >
          <Layer>
            {items.map((item) => {
              const isDraggable = activeTool === "pointer";
              
              if (item.type === "rectangle") {
                return (
                  <Rect
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    width={item.width || 0}
                    height={item.height || 0}
                    fill={item.color}
                    draggable={isDraggable}
                  />
                );
              }
              if (item.type === "circle") {
                return (
                  <Circle
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    radius={item.radius || 0}
                    fill={item.color}
                    draggable={isDraggable}
                  />
                );
              }
              if (item.type === "text") {
                return (
                  <Text
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    text={item.text}
                    fontSize={24}
                    fill={item.color}
                    draggable={isDraggable}
                    onDblClick={(e) => {
                       if (activeTool === "pointer") {
                           const newText = prompt("Enter text:", item.text);
                           if (newText !== null) {
                               setItems(prev => prev.map(i => i.id === item.id ? { ...i, text: newText } : i));
                           }
                       }
                    }}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      )}

      {/* Hotbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-2 py-2 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-1">
        <ToolButton 
          icon={<Pointer size={20} />} 
          label="Select" 
          isActive={activeTool === "pointer"} 
          onClick={() => setActiveTool("pointer")} 
        />
        <ToolButton 
          icon={<Hand size={20} />} 
          label="Pan" 
          isActive={activeTool === "hand"} 
          onClick={() => setActiveTool("hand")} 
        />
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <ToolButton 
          icon={<Square size={20} />} 
          label="Rectangle" 
          isActive={activeTool === "rectangle"} 
          onClick={() => setActiveTool("rectangle")} 
        />
        <ToolButton 
          icon={<CircleIcon size={20} />} 
          label="Circle" 
          isActive={activeTool === "circle"} 
          onClick={() => setActiveTool("circle")} 
        />
        <ToolButton 
          icon={<Type size={20} />} 
          label="Text" 
          isActive={activeTool === "text"} 
          onClick={() => setActiveTool("text")} 
        />
      </div>
    </div>
  );
}

function ToolButton({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center
        ${isActive ? "bg-indigo-50 text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}
      `}
    >
      {icon}
    </button>
  );
}
