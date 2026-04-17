"use client";

import { useEffect, useState } from "react";
import { DraftingCompass, Brush, Star, LineSquiggle, MoonStar, Hamburger, NotebookPen, PartyPopper } from "lucide-react";

const icons = [DraftingCompass, Brush, Star, LineSquiggle, MoonStar, Hamburger, NotebookPen, PartyPopper];
const colors = ["text-primary", "text-secondary", "text-tertiary", "text-stone-800", "text-yellow-500"];

interface DoodleProps {
  Icon: React.ElementType;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotate: number;
  size: number;
  color: string;
}

export default function DoodleDecor() {
  const [doodles, setDoodles] = useState<DoodleProps[]>([]);

  useEffect(() => {
    // Generate randomized doodles only on the client
    const generated: DoodleProps[] = [];
    const count = 5 + Math.floor(Math.random() * 4); // 5 to 8 doodles

    const positions: { x: number, y: number }[] = [];
    const minDistance = 15; // 15% minimum distance between any two doodles

    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      let valid = false;
      let attempts = 0;

      while (!valid && attempts < 50) {
        attempts++;
        // Force them to the far left (<20%) or far right (>80%) to avoid overlapping center content
        const isLeft = Math.random() > 0.5;
        x = isLeft ? 2 + Math.random() * 16 : 82 + Math.random() * 16;
        y = 5 + Math.random() * 85;

        valid = true;
        for (const p of positions) {
          const dx = p.x - x;
          const dy = p.y - y;
          if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        positions.push({ x, y });
        generated.push({
          Icon: icons[Math.floor(Math.random() * icons.length)],
          rotate: -30 + Math.floor(Math.random() * 60),
          size: 40 + Math.floor(Math.random() * 50), // slightly smaller to be unobtrusive
          color: colors[Math.floor(Math.random() * colors.length)],
          left: `${x}%`,
          top: `${y}%`
        });
      }
    }

    setDoodles(generated);
  }, []);

  if (doodles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {doodles.map((d, i) => {
        const { Icon, size, color, rotate, top, bottom, left, right } = d;
        return (
          <div
            key={i}
            className={`absolute opacity-20 pointer-events-none ${color}`}
            style={{
              top,
              bottom,
              left,
              right,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Icon size={size} strokeWidth={1} />
          </div>
        );
      })}
    </div>
  );
}
