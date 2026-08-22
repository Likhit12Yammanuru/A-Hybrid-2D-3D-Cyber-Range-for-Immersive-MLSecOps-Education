// Utils.js — no external dependencies

class Utils {

  /**
   * Returns a random number between min and max.
   */
  static randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Returns a random position on a flat XZ plane within a radius.
   * Returns { x, z } — use y=0 or set y separately.
   */
  static randomPositionOnPlane(radius) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * radius;
    return {
      x: Math.cos(angle) * r,
      z: Math.sin(angle) * r,
    };
  }

  /**
   * Returns a random angle in radians (0 to 2π).
   */
  static randomAngle() {
    return Math.random() * Math.PI * 2;
  }

  /**
   * Returns a random position on the edge of a circle (for spawning attackers).
   * Returns { x, y } for use in Canvas 2D.
   */
  static randomPositionOnCircleEdge(cx, cy, radius) {
    const angle = Utils.randomAngle();
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  }

  /**
   * 2D distance between two objects with x/y properties.
   */
  static distance(obj1, obj2) {
    if (!obj1 || !obj2) return Infinity;
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.hypot(dx, dy);
  }

  /**
   * 2D distance between two plain coordinate pairs.
   */
  static distanceXY(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  /**
   * Normalizes a 2D direction vector { x, y }.
   * Returns { x, y } unit vector.
   */
  static normalize2D(dx, dy) {
    const len = Math.hypot(dx, dy);
    if (len === 0) return { x: 0, y: 0 };
    return { x: dx / len, y: dy / len };
  }

  /**
   * Moves obj toward target by speed units.
   * obj and target must have { x, y }.
   * Mutates obj.x and obj.y in place.
   */
  static moveToward(obj, target, speed) {
    const dx = target.x - obj.x;
    const dy = target.y - obj.y;
    const dir = Utils.normalize2D(dx, dy);
    obj.x += dir.x * speed;
    obj.y += dir.y * speed;
  }

  /**
   * Clamps a value between min and max.
   */
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linearly interpolates between a and b by t (0–1).
   */
  static lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /**
   * Formats seconds as M:SS string (e.g. 90 → "1:30").
   */
  static formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  /**
   * Returns true if point {x,y} is within radius of center {x,y}.
   */
  static isWithinRadius(point, center, radius) {
    return Utils.distance(point, center) < radius;
  }

  /**
   * Draws a glowing circle on a Canvas 2D context.
   */
  static drawGlowCircle(ctx, x, y, radius, color, glowBlur = 12) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = glowBlur;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  /**
   * Draws a simple grid on a Canvas 2D context.
   */
  static drawGrid(ctx, width, height, step = 50, color = 'rgba(0,80,160,0.12)') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
  }

  /**
   * Spawns a burst of particles into a particles array.
   * Each particle: { x, y, vx, vy, life, color }
   */
  static spawnParticles(particles, x, y, count = 12, speed = 4, color = '#ffffff') {
    for (let i = 0; i < count; i++) {
      const angle = Utils.randomAngle();
      const s = Utils.randomInRange(speed * 0.5, speed);
      particles.push({
        x, y,
        vx: Math.cos(angle) * s,
        vy: Math.sin(angle) * s,
        life: 1,
        color,
      });
    }
  }

  /**
   * Updates and draws all particles in a particles array.
   * Call once per frame inside your render loop.
   * Removes dead particles in place.
   */
  static updateParticles(ctx, particles, fadeSpeed = 0.04) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= fadeSpeed;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color.startsWith('rgba')
        ? p.color
        : Utils._hexOrNameToRgba(p.color, p.life);
      ctx.fill();
    }
  }

  /** Internal: converts a named/hex color + alpha into an rgba string. */
  static _hexOrNameToRgba(color, alpha) {
    // Simple passthrough — works for colors like '#ff4444', '#00ffcc', etc.
    return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }
}

export default Utils;