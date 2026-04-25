"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Obstacle {
  x: number;
  height: number;
  passed: boolean;
}

interface GroundSegment {
  x: number;
}

export function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [_paused, setPaused] = useState(false);

  const gameStateRef = useRef({
    dinoY: 0,
    dinoVelocity: 0,
    isJumping: false,
    groundY: 0,
    speed: 6,
    obstacles: [] as Obstacle[],
    groundSegments: [] as GroundSegment[],
    frame: 0,
    animationId: 0 as number,
    lastObstacleTime: 0,
    currentScore: 0,
  });

  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const GROUND_HEIGHT = 40;
  const DINO_WIDTH = 40;
  const DINO_HEIGHT = 44;
  const MIN_OBSTACLE_GAP = 1500;

  const resetGame = useCallback(() => {
    const state = gameStateRef.current;
    state.dinoY = 0;
    state.dinoVelocity = 0;
    state.isJumping = false;
    state.obstacles = [];
    state.frame = 0;
    state.speed = 6;
    state.lastObstacleTime = Date.now();
    state.currentScore = 0;
    setScore(0);
    setGameOver(false);
    setPaused(false);
  }, []);

  const startGame = useCallback(() => {
    setStarted(true);
    setGameOver(false);
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dinoImage = new Image();
    const dinoR = new Image();
    const cactusImage = new Image();

    let imagesLoaded = false;

    const onImageLoad = () => {
      if (dinoImage.complete && dinoR.complete && cactusImage.complete) {
        imagesLoaded = true;
      }
    };

    dinoImage.onload = onImageLoad;
    dinoR.onload = onImageLoad;
    cactusImage.onload = onImageLoad;

    dinoImage.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqElEQVR4nO2WzUrDQBSGv01FWrVoFYLgRuhW6EaJg4t+AAVBZ+MdXIjyGtzcXVwJFxdnRSlCYbRAa6U8aYHQL7BA/IlpS7i7c2mhlNL7ctd7c/5z7t45BAbwV4J2u90XAIq+7ysA0FqLMebGGDP6K1b7fN8/B4DLOTejlJIMwyBnZ2eL6yqllH8A6Pn+i9PzfX+p67q7x+Nxq/eGYfP/hYe1dgLAl7E5Go1OG2NW3y1s9H0/BmBUVfVA0zTPiqI4qZTqGGNaxpjZ95a1VikAMMbM3ltaa5Uxxqy+H7TW4sIYO1NV9UpV1a8AVFWFV6VUlzHm3Bjz7H0BAGitJcMwPAHgCsC5tXbu3tZaEgBiAHgAsA9gH0ALwNbvA2itRQBwD8A+gGMAuwA2fxtAKyUGgDsAdgHsA9gCsPFDgL8GoLUWA8AdALsADgDsALB/eE4J/2wA/1wB/tmA/+0G/N8b+I9uwH9tA/6rG/C/2oD/6gb8Vzfgn24D/lc34L+6Af+qG/C/ugH/dAP+6Qb8rzfgv7YB/6sb8E83QPm3DuA/+A+I5H6j6Q1P3wAAAABJRU5ErkJggg==";
    dinoR.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqElEQVR4nO2WzUrDQBSGv01FWrVoFYLgRuhW6EaJg4t+AAVBZ+MdXIjyGtzcXVwJFxdnRSlCYbRAa6U8aYHQL7BA/IlpS7i7c2mhlNL7ctd7c/5z7t45BAbwV4J2u90XAIq+7ysA0FqLMebGGDP6K1b7fN8/B4DLOTejlJIMwyBnZ2eL6yqllH8A6Pn+i9PzfX+p67q7x+Nxq/eGYfP/hYe1dgLAl7E5Go1OG2MWDR42evG+AAiatnk2DEPfGPPkfQEAAK21ZBj+p1KKo5QSj4+PZ/cVQkAIIT8BeL73hdaPF0J8WWsXj43W4vsAfiildgB4xpinUmoXwNbvA2itRQBwD8AewD6AXQC2/s4ArZWi67oHAFcAzgAcAFj/PkDXdY8ADn9aw/9sAP/bBvxvG/D/2oD/1Qb8Vzfgf7cB/9MN+Gcb8E/bgP/qBvxXN+CfagP+qw34X23A/2oD/qkW4J9uA/5XG/B/24D/6gb80w1Q/rYB/3QDlH/rAP6D/4CI7DdY3vD0AAAAAElFTkSuQmCC";
    cactusImage.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABHElEQVR4nO2WwU7CQBCGf0MKFx0cHBwcdHDQxUURJ0U0NHR00MnJQScnHQj/ANwdXAgXHRx0cHJRROkiWqAQkpCEJIQQaYXg4eG+mV1aKLG85M18M/vN7qysrKys/mc0AKCqKgUgGo1GRQihlFIB4M5xHGdZlvM4juO7rusCEE3T/B5jTBzHcRzHuY7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOIP2eJ7X9H3f9H3fBELTNP8AEM1mswcAwzAMI4xZJEli+77fJISYQoip6zojhJimaZ4TQszJZDK5E0JM0zTN87xJCOGZpinf932TJEk8mUwmE0JMSinP9/05gLl/gqZpNgGglJq6rssB4Pm+3wRA13UdAKLrugiAFxYW5gCglJq6rhsAcF3X5QAwDMMQAK7rugCA7/tNAOA4TgIA13VdBMD3fZcBIISQABBdlxBCaJomAYDv+04DAJZlnQGglJqmaRIA+L7PAAhFUSQB8H2fARCCIAgBIITQ5JxTAHh9fdkEQLIsSwAQ+r7TAMh1XacB8H2fARCyLMsAEPq+UwEoFItFBkB0cXHOAIiapkkAYNs2AyBarZY4F+JcSBZl9Q98AJMkSaKmaTKGYRhGSZJYSqkBIYRlWZYQYiilRhzH8RzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzjvyPXddUYY5qu6zoA0DRN8wJAVBTFcQ3DMCzLsn4BMqJpmsYCgE6n0xQAzPT7/Q6ASL8/6AGIJIoiISL6lVKKlFJaa40xRkkpZa21xhhjjDFaaw0A0lrDGPNfG8QCaK21KIqiQQjRVxTFIIqiQQiRhRBZCJGl67qhruua0+l0lEKhYFBXKIoiIYQYUEoNTafTURzHaQJY8n1/kSTJKMdxHNd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xf+IvwFPe7aH2qKQmwAAAABJRU5ErkJggg==";

    const state = gameStateRef.current;
    state.groundY = canvas.height - GROUND_HEIGHT;

    const drawDino = (x: number, y: number, frame: number) => {
      const dino = frame % 2 === 0 ? dinoImage : dinoR;
      if (imagesLoaded) {
        ctx.drawImage(dino, x, y - DINO_HEIGHT, DINO_WIDTH, DINO_HEIGHT);
      } else {
        ctx.fillStyle = "#333";
        ctx.fillRect(x, y - DINO_HEIGHT, DINO_WIDTH, DINO_HEIGHT);
      }
    };

    const drawObstacle = (obstacle: Obstacle) => {
      if (imagesLoaded) {
        ctx.drawImage(
          cactusImage,
          obstacle.x,
          canvas.height - GROUND_HEIGHT - obstacle.height,
          20,
          obstacle.height
        );
      } else {
        ctx.fillStyle = "#2d5a27";
        ctx.fillRect(
          obstacle.x,
          canvas.height - GROUND_HEIGHT - obstacle.height,
          20,
          obstacle.height
        );
      }
    };

    const drawGround = () => {
      ctx.fillStyle = "#b5b5b5";
      state.groundSegments.forEach((seg) => {
        ctx.fillRect(
          seg.x,
          canvas.height - GROUND_HEIGHT,
          30,
          GROUND_HEIGHT
        );
      });
      ctx.fillRect(0, canvas.height - GROUND_HEIGHT + 5, canvas.width, 2);
    };

    const draw = () => {
      ctx.fillStyle = "#f7f7f7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const groundY = canvas.height - GROUND_HEIGHT;
      const currentState = gameStateRef.current;

      if (!started) {
        ctx.fillStyle = "#333";
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("Press SPACE or Tap to Start", canvas.width / 2, groundY - 60);
        drawDino(50, groundY, 0);
        drawGround();
        return;
      }

      if (gameOver) {
        ctx.fillStyle = "#333";
        ctx.font = "bold 24px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, groundY - 60);
        ctx.font = "bold 14px system-ui";
        ctx.fillText(`Score: ${score} | Best: ${highScore}`, canvas.width / 2, groundY - 35);
        ctx.fillText("Press SPACE to Restart", canvas.width / 2, groundY - 10);
        drawGround();
        return;
      }

      drawDino(50, groundY + currentState.dinoY, currentState.frame);
      currentState.obstacles.forEach(drawObstacle);
      drawGround();

      ctx.fillStyle = "#333";
      ctx.font = "bold 14px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${score}`, 10, 25);
      ctx.textAlign = "right";
      ctx.fillText(`Best: ${highScore}`, canvas.width - 10, 25);
    };

    const update = () => {
      if (!started || gameOver) return;

      const state = gameStateRef.current;

      if (!state.isJumping) {
        state.dinoY += state.dinoVelocity;
        state.dinoVelocity += GRAVITY;
        if (state.dinoY >= 0) {
          state.dinoY = 0;
          state.dinoVelocity = 0;
        }
      }

      state.frame++;
      if (state.frame % 5 === 0) {
        state.currentScore += 1;
        setScore(state.currentScore);
        setHighScore((h) =>
          state.currentScore > h ? state.currentScore : h
        );
      }

      const now = Date.now();
      if (now - state.lastObstacleTime > MIN_OBSTACLE_GAP / state.speed * 200) {
        const height = 30 + Math.random() * 30;
        state.obstacles.push({ x: canvas.width, height, passed: false });
        state.lastObstacleTime = now;
      }

      state.obstacles.forEach((obs) => {
        obs.x -= state.speed;
      });

      state.obstacles = state.obstacles.filter((obs) => obs.x > -30);

      const dinoLeft = 50;
      const dinoRight = 50 + DINO_WIDTH;
      const dinoBottom = state.groundY + state.dinoY;

      for (const obs of state.obstacles) {
        const obsTop = canvas.height - GROUND_HEIGHT - obs.height;
        if (
          dinoRight > obs.x &&
          dinoLeft < obs.x + 20 &&
          dinoBottom > obsTop
        ) {
          setGameOver(true);
          return;
        }
      }
    };

    const gameLoop = () => {
      update();
      draw();
      const newState = gameStateRef.current;
      newState.animationId = requestAnimationFrame(gameLoop);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        if (!started || gameOver) {
          startGame();
        } else {
          const s = gameStateRef.current;
          if (!s.isJumping && s.dinoY === 0) {
            s.isJumping = true;
            s.dinoVelocity = JUMP_FORCE;
          }
        }
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (!started || gameOver) {
        startGame();
      } else {
        const s = gameStateRef.current;
        if (!s.isJumping && s.dinoY === 0) {
          s.isJumping = true;
          s.dinoVelocity = JUMP_FORCE;
        }
      }
    };

    const handleClick = () => {
      if (!started || gameOver) {
        startGame();
      } else {
        const s = gameStateRef.current;
        if (!s.isJumping && s.dinoY === 0) {
          s.isJumping = true;
          s.dinoVelocity = JUMP_FORCE;
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("click", handleClick);

    const initialState = gameStateRef.current;
    for (let i = 0; i < canvas.width / 30 + 1; i++) {
      initialState.groundSegments.push({ x: i * 30 });
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(gameStateRef.current.animationId);
      window.removeEventListener("keydown", handleKey);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("click", handleClick);
    };
  }, [started, gameOver, startGame]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={160}
      className="w-full max-w-xl cursor-pointer rounded-lg border border-border/30 bg-background/50"
    />
  );
}
