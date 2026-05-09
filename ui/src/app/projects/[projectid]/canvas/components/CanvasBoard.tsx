"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Text, RegularPolygon, Arrow } from "react-konva";
import { Pointer, Hand, Square, Circle as CircleIcon, Type, Triangle, MoveDiagonal } from "lucide-react";
import Konva from "konva";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

type ToolType = "pointer" | "hand" | "rectangle" | "circle" | "text" | "triangle" | "arrow";

interface CanvasItem {
  id: string;
  type: "rectangle" | "circle" | "text" | "triangle" | "arrow";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[]; // For arrows
  text?: string;
  color: string;
}

export default function CanvasBoard() {
  const [activeTool, setActiveTool] = useState<ToolType>("hand");
  const [selectedColor, setSelectedColor] = useState<string>("#2563eb");
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const stageRef = useRef<Konva.Stage>(null);

  // Inline Text Edit State
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [textEditValue, setTextEditValue] = useState("");
  const [textEditPos, setTextEditPos] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Use a ref to ensure event handlers have the very latest items without re-subscribing.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Router dynamics
  const params = useParams();
  const projectId = params?.projectid as string;
  const wsRef = useRef<WebSocket | null>(null);

  const { data: session } = useSession();

  // Initialization & WebSocket Setup
  useEffect(() => {
    if (!projectId || !session?.id_token) return;

    // Fetch initial state first from the DB
    fetch(`/backend-api/protected/api/canvas/${projectId}`, {
      headers: {
        "Authorization": `Bearer ${session.id_token}`
      }
    })
      .then(res => res.json())
      .then(resData => {
        if (resData?.data?.elements) {
          let parsed = [];
          if (typeof resData.data.elements === "string" && resData.data.elements.length > 0) {
            try { parsed = JSON.parse(resData.data.elements); } catch (e) { }
          } else if (Array.isArray(resData.data.elements)) {
            parsed = resData.data.elements;
          }
          if (parsed.length > 0) {
            setItems(parsed);
          }
        }

        // Initialize WebSockets connection directly to the protected wss route with token embedded in URL
        const ws = new WebSocket(`/backend-api/protected/ws/canvas/${projectId}?token=${session.id_token}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const incomingItems = JSON.parse(event.data);
            if (Array.isArray(incomingItems)) {
              setItems(incomingItems);
            }
          } catch (err) {
            console.error("Failed to parse incoming WS items:", err);
          }
        };
      })
      .catch(err => {
        console.error("Failed to load initial Canvas state:", err);
      });

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [projectId, session?.id_token]);

  // Function to push updates to the WebSocket server
  const wsBroadcast = (payloadItems: CanvasItem[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payloadItems));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
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
      color: selectedColor,
    };

    if (activeTool === "rectangle") {
      newItem = { ...newItem, type: "rectangle", width: 0, height: 0 };
    } else if (activeTool === "circle" || activeTool === "triangle") {
      newItem = { ...newItem, type: activeTool, radius: 0 };
    } else if (activeTool === "arrow") {
      newItem = { ...newItem, type: "arrow", points: [point.x, point.y, point.x, point.y] };
    } else if (activeTool === "text") {
      newItem = { ...newItem, type: "text", text: "Double click to edit text", color: selectedColor };
      setIsDrawing(false);

      const newItems = [...itemsRef.current, newItem];
      setItems(newItems);
      wsBroadcast(newItems); // Broadcast immediately since it is fire-and-forget
      return;
    }

    setItems([...itemsRef.current, newItem]);
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
      } else if (lastItem.type === "circle" || lastItem.type === "triangle") {
        const dx = point.x - lastItem.x;
        const dy = point.y - lastItem.y;
        lastItem.radius = Math.sqrt(dx * dx + dy * dy);
      } else if (lastItem.type === "arrow") {
        lastItem.points = [lastItem.points![0], lastItem.points![1], point.x, point.y];
      }

      const newItems = [...prevItems];
      newItems[newItems.length - 1] = lastItem;
      return newItems;
    });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      // Broadcast shapes that just finished being drawn
      wsBroadcast(itemsRef.current);
    }
    setIsDrawing(false);
  };

  const handleDragEnd = (e: any, id: string) => {
    const node = e.target;
    const newItems = itemsRef.current.map(item => {
      if (item.id === id) {
        return { ...item, x: node.x(), y: node.y() };
      }
      return item;
    });
    setItems(newItems);
    wsBroadcast(newItems);
  };

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

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

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
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
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
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
                  />
                );
              }
              if (item.type === "triangle") {
                return (
                  <RegularPolygon
                    key={item.id}
                    x={item.x}
                    y={item.y}
                    sides={3}
                    radius={item.radius || 0}
                    fill={item.color}
                    draggable={isDraggable}
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
                  />
                );
              }
              if (item.type === "arrow") {
                return (
                  <Arrow
                    key={item.id}
                    points={item.points || []}
                    stroke={item.color}
                    strokeWidth={4}
                    fill={item.color}
                    pointerLength={10}
                    pointerWidth={10}
                    draggable={isDraggable}
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
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
                    visible={editingTextId !== item.id}
                    onDragEnd={(e) => handleDragEnd(e, item.id)}
                    onDblClick={(e) => {
                      if (activeTool === "pointer") {
                        const textNode = e.target;
                        const stage = stageRef.current;
                        if (!stage) return;

                        const textPosition = textNode.absolutePosition();
                        setTextEditValue(item.text || "");
                        setEditingTextId(item.id);
                        setTextEditPos({
                          x: textPosition.x,
                          y: textPosition.y,
                          width: Math.max(textNode.width() * stage.scaleX(), 200),
                          height: Math.max(textNode.height() * stage.scaleY(), 40),
                        });
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

      {/* Inline Text Editor */}
      {editingTextId && (
        <textarea
          value={textEditValue}
          onChange={(e) => setTextEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setEditingTextId(null);
            }
          }}
          onBlur={() => {
            const newItems = itemsRef.current.map(i => i.id === editingTextId ? { ...i, text: textEditValue } : i);
            setItems(newItems);
            wsBroadcast(newItems);
            setEditingTextId(null);
          }}
          autoFocus
          className="absolute z-50 bg-transparent border border-teal-500 rounded p-1 outline-none resize-none font-sans"
          style={{
            top: `${textEditPos.y}px`,
            left: `${textEditPos.x}px`,
            width: `${textEditPos.width + 20}px`,
            height: `${textEditPos.height + 20}px`,
            fontSize: `${24 * (stageRef.current?.scaleX() || 1)}px`,
            color: itemsRef.current.find(i => i.id === editingTextId)?.color || "#000",
          }}
        />
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
        <div className="flex flex-row items-center max-md:hidden">
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
            icon={<Triangle size={20} />}
            label="Triangle"
            isActive={activeTool === "triangle"}
            onClick={() => setActiveTool("triangle")}
          />
          <ToolButton
            icon={<MoveDiagonal size={20} />}
            label="Arrow"
            isActive={activeTool === "arrow"}
            onClick={() => setActiveTool("arrow")}
          />
        </div>
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <ToolButton
          icon={<Type size={20} />}
          label="Text"
          isActive={activeTool === "text"}
          onClick={() => setActiveTool("text")}
        />
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <div className="flex items-center justify-center p-1">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
            title="Choose Color"
          />
        </div>
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
