"use client";

import Matter from "matter-js";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { SkillItem } from "@/lib/content";
import { cn } from "@/lib/utils";

const TANK_H = 520;
const WALL = 120;

/**
 * Matter.js bubble tank: skills drop in, pile up, collide and can be
 * grabbed and flung. Category filter spotlights instead of removing.
 */
export function SkillsTank({
  skills,
  active,
}: {
  skills: SkillItem[];
  active: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef(new Map<string, HTMLDivElement>());
  const [selected, setSelected] = useState<SkillItem | null>(null);

  useEffect(() => {
    const boxEl = boxRef.current;
    if (!boxEl || skills.length === 0) return;
    const box = boxEl;

    const engine = Matter.Engine.create({ enableSleeping: true });
    engine.gravity.y = 1;
    const W = box.clientWidth;

    const opts = { isStatic: true, friction: 0.4 };
    const ground = Matter.Bodies.rectangle(W / 2, TANK_H + WALL / 2 - 4, W + WALL * 2, WALL, opts);
    const left = Matter.Bodies.rectangle(-WALL / 2 + 4, TANK_H / 2, WALL, TANK_H * 2, opts);
    const right = Matter.Bodies.rectangle(W + WALL / 2 - 4, TANK_H / 2, WALL, TANK_H * 2, opts);
    Matter.Composite.add(engine.world, [ground, left, right]);

    const bodies = skills.map((s, i) => {
      const r = 30 + ((s.level ?? 50) / 100) * 24;
      const b = Matter.Bodies.circle(
        60 + ((i * 137) % Math.max(W - 120, 200)),
        -80 - i * 70,
        r,
        { restitution: 0.55, friction: 0.15, frictionAir: 0.012, density: 0.0012 },
      );
      b.plugin = { name: s.name };
      return b;
    });
    // staggered drop-in
    const timers: ReturnType<typeof setTimeout>[] = [];
    bodies.forEach((b, i) => {
      timers.push(setTimeout(() => Matter.Composite.add(engine.world, b), 350 + i * 110));
    });

    // custom grab: mousedown on a bubble pins it to the cursor
    let grab: Matter.Constraint | null = null;
    const mouse = { x: 0, y: 0 };
    function track(e: MouseEvent) {
      const r = box.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      if (grab) {
        grab.pointA.x = mouse.x;
        grab.pointA.y = mouse.y;
      }
    }
    function release() {
      if (grab) {
        Matter.Composite.remove(engine.world, grab);
        grab = null;
      }
    }
    function press(e: MouseEvent) {
      const t = (e.target as HTMLElement).closest?.("[data-body]");
      if (!t) return;
      const body = bodies.find((b) => (b.plugin as { name: string }).name === t.getAttribute("data-body"));
      if (!body) return;
      Matter.Sleeping.set(body, false);
      grab = Matter.Constraint.create({
        pointA: { x: mouse.x, y: mouse.y },
        bodyB: body,
        stiffness: 0.12,
        damping: 0.08,
        length: 0,
      });
      Matter.Composite.add(engine.world, grab);
    }
    box.addEventListener("mousemove", track);
    box.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);

    let raf = 0;
    function frame() {
      Matter.Engine.update(engine, 1000 / 60);
      for (const b of bodies) {
        const el = elsRef.current.get((b.plugin as { name: string }).name);
        if (!el) continue;
        el.style.transform = `translate(${b.position.x}px, ${b.position.y}px) rotate(${b.angle}rad)`;
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onResize() {
      const w = box.clientWidth;
      Matter.Body.setPosition(ground, { x: w / 2, y: TANK_H + WALL / 2 - 4 });
      Matter.Body.setPosition(right, { x: w + WALL / 2 - 4, y: TANK_H / 2 });
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(box);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      timers.forEach(clearTimeout);
      box.removeEventListener("mousemove", track);
      box.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  return (
    <div>
      <div
        ref={boxRef}
        className="border-ink bg-white/60 shadow-brutal rounded-brutal-md relative mt-8 w-full overflow-hidden border-2 select-none"
        style={{ height: TANK_H }}
      >
        <p className="pointer-events-none absolute top-3 left-4 font-mono text-xs font-bold text-black/30">
          GRAVITY: ON — GRAB &amp; FLING
        </p>
        {skills.map((s) => {
          const r = 30 + ((s.level ?? 50) / 100) * 24;
          const dim = active !== "all" && s.cat !== active;
          return (
            <div
              key={s.name}
              data-body={s.name}
              data-cursor="GRAB"
              ref={(el) => {
                if (el) elsRef.current.set(s.name, el);
                else elsRef.current.delete(s.name);
              }}
              onClick={() => setSelected(s)}
              style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r }}
              className={cn(
                "absolute top-0 left-0 flex cursor-grab items-center justify-center rounded-full border-2 border-ink text-center active:cursor-grabbing",
                s.color,
                dim && "opacity-20 saturate-0",
              )}
            >
              <span
                className="px-1 font-mono font-bold break-words"
                style={{ fontSize: Math.max(10, Math.min(14, r * 0.3)) }}
              >
                {s.name.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 min-h-24">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="border-ink bg-white shadow-brutal rounded-brutal-md flex flex-wrap items-center gap-x-6 gap-y-2 border-2 p-4"
            >
              <span className={cn("rounded border-2 border-ink px-2 py-0.5 font-mono text-sm font-bold", selected.color)}>
                {selected.name.toUpperCase()}
              </span>
              <span className="font-mono text-xs text-black/40 uppercase">{selected.cat}</span>
              <span className="text-sm text-black/70">{selected.desc}</span>
              <span className="ml-auto flex min-w-40 flex-1 items-center gap-2">
                <span className="h-3 flex-1 overflow-hidden rounded-full border-2 border-ink bg-cream">
                  <span className={cn("block h-full", selected.color)} style={{ width: `${selected.level}%` }} />
                </span>
                <span className="font-mono text-xs font-bold">{selected.level}</span>
              </span>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4 text-center font-mono text-sm text-black/40"
            >
              ↑ balls fall in — grab one, click it for details
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
