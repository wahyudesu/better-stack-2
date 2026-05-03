"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface Obstacle {
	x: number;
	height: number;
}

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const GROUND_HEIGHT = 40;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 44;
const MIN_OBSTACLE_GAP = 1500;

// Simple pixel art dino as base64
const DINO_IMAGE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqElEQVR4nO2WzUrDQBSGv01FWrVoFYLgRuhW6EaJg4t+AAVBZ+MdXIjyGtzcXVwJFxdnRSlCYbRAa6U8aYHQL7BA/IlpS7i7c2mhlNL7ctd7c/5z7t45BAbwV4J2u90XAIq+7ysA0FqLMebGGDP6K1b7fN8/B4DLOTejlJIMwyBnZ2eL6yqllH8A6Pn+i9PzfX+p67q7x+Nxq/eGYfP/hYe1dgLAl7E5Go1OG2MWDR42evG+AAiatnk2DEPfGPPkfQEAAK21ZBj+p1KKo5QSj4+PZ/cVQkAIIT8BeL73hdaPF0J8WWsXj43W4vsAfiildgB4xpinUmoXwNbvA2itRQBwD8AewD6AXQC2/s4ArZWi67oHAFcAzgAcAFj/PkDXdY8ADn9aw/9sAP/bBvxvG/D/2oD/1Qb8Vzfgf7cB/9MN+Gcb8E/bgP/qBvxXN+CfagP+qw34X23A/2oD/qkW4J9uA/5XG/B/24D/6gb80w1Q/rYB/3QDlH/rAP6D/4CI7DdY3vD0AAAAAElFTkSuQmCC";
const DINO_R_IMAGE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqElEQVR4nO2WzUrDQBSGv01FWrVoFYLgRuhW6EaJg4t+AAVBZ+MdXIjyGtzcXVwJFxdnRSlCYbRAa6U8aYHQL7BA/IlpS7i7c2mhlNL7ctd7c/5z7t45BAbwV4J2u90XAIq+7ysA0FqLMebGGDP6K1b7fN8/B4DLOTejlJIMwyBnZ2eL6yqllH8A6Pn+i9PzfX+p67q7x+Nxq/eGYfP/hYe1dgLAl7E5Go1OG2MWDR42evG+AAiadnk2DEPfGPPkfQEAAK21ZBj+p1KKo5QSj4+PZ/cVQkAIIT8BeL73hdaPF0J8WWsXj43W4vsAfiildgB4xpinUmoXwNbvA2itRQBwD8AewD6AXQC2/s4ArZWi67oHAFcAzgAcAFj/PkDXdY8ADn9aw/9sAP/bBvxvG/D/2oD/1Qb8Vzfgf7cB/9MN+Gcb8E/bgP/qBvxXN+CfagP+qw34X23A/2oD/qkW4J9uA/5XG/B/24D/6gb80w1Q/rYB/3QDlH/rAP6D/4CI7DdY3vD0AAAAAElFTkSuQmCC";
const CACTUS_IMAGE =
	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAABHElEQVR4nO2WwU7CQBCGf0MKFx0cHBwcdHDQxUURJ0U0NHR00MnJQScnHQj/ANwdXAgXHRx0cHJRROkiWqAQkpCEJIQQaYXg4eG+mV1aKLG85M18M/vN9qysrKys/mc0AKCqKgUgGo1GRQihlFIB4M5xHGdZlvM4juO7rusCEE3T/B5jTBzHcRzHuY7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOI7jOIP2eJ7X9H3f9H3fBELTNP8AEM1mswcAwzAMI4xZJEli+77fJISYQoip6zojhJimaZ4TQszJZDK5E0JM0zTN87xJCOGZpinf932TJEk8mUwmE0JMSinP9/05gLl/gqZpNgGglJq6rssB4Pm+3wRA13UdAKLrugiAFxYW5gCglJq6rhsAcF3X5QAwDMMQAK7rugCA7/tNAOA4TgIA13VdBMD3fZcBIISQABBdlxBCaJomAYDv+04DAJZlnQGglJqmaRIA+L7PAAhFUSQB8H2fARCCIAgBIITQ5JxTAHh9fdkEQLIsSwAQ+r7TAMh1XacB8H2fARCyLMsAEPq+UwEoFItFBkB0cXHOAIiapkkAYNs2AyBarZY4F+JcSBZl9Q98AJMkSaKmaTKGYRhGSZJYSqkBIYRlWZYQYiilRhzH8RzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzHcRzjvyPXddUYY5qu6zoA0DRN8wJAVBTFcQ3DMCzLsn4BMqJpmsYCgE6n0xQAzPT7/Q6ASL8/6AGIJIoiISL6lVKKlFJaa40xRkkpZa21xhhjjDFaaw0A0lrDGPNfG8QCaK21KIqiQQjRVxTFIIqiQQiRhRBZCJGl67qhruua0+l0lEKhYFBXKIoiIYQYUEoNTafTURzHaQJY8n1/kSTJKMdxHNd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xdd1Xf+IvwFPe7aH2qKQmwAAAABJRU5ErkJggg==";

type GameStatus = "idle" | "playing" | "gameover";

export function DinoGame() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [status, setStatus] = useState<GameStatus>("idle");
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);

	// Game state refs
	const gameRef = useRef({
		dinoY: 0,
		dinoVelocity: 0,
		isJumping: false,
		groundY: 0,
		speed: 6,
		obstacles: [] as Obstacle[],
		frame: 0,
		lastObstacleTime: 0,
		currentScore: 0,
	});

	// Refs for game loop
	const statusRef = useRef<GameStatus>("idle");
	const animationRef = useRef<number>(0);
	const scoreRef = useRef(0);
	const highScoreRef = useRef(0);

	// Keep refs in sync
	useEffect(() => {
		statusRef.current = status;
	}, [status]);

	useEffect(() => {
		scoreRef.current = score;
	}, [score]);

	useEffect(() => {
		highScoreRef.current = highScore;
	}, [highScore]);

	const startGame = useCallback(() => {
		const game = gameRef.current;
		game.dinoY = 0;
		game.dinoVelocity = 0;
		game.isJumping = false;
		game.obstacles = [];
		game.frame = 0;
		game.speed = 6;
		game.lastObstacleTime = Date.now();
		game.currentScore = 0;
		setScore(0);
		setStatus("playing");
	}, []);

	const jump = useCallback(() => {
		const game = gameRef.current;
		if (!game.isJumping && game.dinoY === 0) {
			game.isJumping = true;
			game.dinoVelocity = JUMP_FORCE;
		}
	}, []);

	const handleAction = useCallback(() => {
		if (statusRef.current === "idle" || statusRef.current === "gameover") {
			startGame();
		} else if (statusRef.current === "playing") {
			jump();
		}
	}, [startGame, jump]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Preload images
		const dinoImage = new Image();
		const dinoR = new Image();
		const cactusImage = new Image();

		dinoImage.src = DINO_IMAGE;
		dinoR.src = DINO_R_IMAGE;
		cactusImage.src = CACTUS_IMAGE;

		let imagesReady = false;
		const checkImages = () => {
			if (dinoImage.complete && dinoR.complete && cactusImage.complete) {
				imagesReady = true;
			}
		};
		checkImages();

		// Initialize ground
		const game = gameRef.current;
		game.groundY = canvas.height - GROUND_HEIGHT;

		const draw = () => {
			const currentStatus = statusRef.current;
			const currentGame = gameRef.current;

			// Clear canvas
			ctx.fillStyle = "#f7f7f7";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw ground
			ctx.fillStyle = "#b5b5b5";
			ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
			ctx.fillStyle = "#666";
			ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 2);

			// Draw dino
			const dinoX = 50;
			const dinoY = canvas.height - GROUND_HEIGHT + currentGame.dinoY;

			if (imagesReady) {
				const dinoImg = currentGame.frame % 10 < 5 ? dinoImage : dinoR;
				ctx.drawImage(dinoImg, dinoX, dinoY - DINO_HEIGHT, DINO_WIDTH, DINO_HEIGHT);
			} else {
				ctx.fillStyle = "#333";
				ctx.fillRect(dinoX, dinoY - DINO_HEIGHT, DINO_WIDTH, DINO_HEIGHT);
			}

			// Draw obstacles
			for (const obs of currentGame.obstacles) {
				if (imagesReady) {
					ctx.drawImage(
						cactusImage,
						obs.x,
						canvas.height - GROUND_HEIGHT - obs.height,
						20,
						obs.height
					);
				} else {
					ctx.fillStyle = "#2d5a27";
					ctx.fillRect(
						obs.x,
						canvas.height - GROUND_HEIGHT - obs.height,
						20,
						obs.height
					);
				}
			}

			// Draw UI based on status
			ctx.fillStyle = "#333";
			ctx.font = "bold 14px system-ui, -apple-system, sans-serif";

			if (currentStatus === "idle") {
				ctx.textAlign = "center";
				ctx.fillText("Press SPACE or Tap to Start", canvas.width / 2, canvas.height - GROUND_HEIGHT - 60);
			} else if (currentStatus === "gameover") {
				ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
				ctx.textAlign = "center";
				ctx.fillText("GAME OVER", canvas.width / 2, canvas.height - GROUND_HEIGHT - 60);
				ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
				ctx.fillText(
					`Score: ${scoreRef.current} | Best: ${highScoreRef.current}`,
					canvas.width / 2,
					canvas.height - GROUND_HEIGHT - 35
				);
				ctx.fillText("Press SPACE to Restart", canvas.width / 2, canvas.height - GROUND_HEIGHT - 10);
			} else {
				ctx.textAlign = "left";
				ctx.fillText(`Score: ${scoreRef.current}`, 10, 25);
				ctx.textAlign = "right";
				ctx.fillText(`Best: ${highScoreRef.current}`, canvas.width - 10, 25);
			}
		};

		const update = () => {
			if (statusRef.current !== "playing") return;

			const currentGame = gameRef.current;

			// Physics
			if (currentGame.isJumping) {
				currentGame.dinoY += currentGame.dinoVelocity;
				currentGame.dinoVelocity += GRAVITY;

				if (currentGame.dinoY >= 0) {
					currentGame.dinoY = 0;
					currentGame.dinoVelocity = 0;
					currentGame.isJumping = false;
				}
			}

			// Animation frame
			currentGame.frame++;

			// Score
			if (currentGame.frame % 5 === 0) {
				currentGame.currentScore++;
				setScore(currentGame.currentScore);
				if (currentGame.currentScore > highScoreRef.current) {
					highScoreRef.current = currentGame.currentScore;
					setHighScore(currentGame.currentScore);
				}
			}

			// Spawn obstacles
			const now = Date.now();
			const spawnInterval = MIN_OBSTACLE_GAP / currentGame.speed;
			if (now - currentGame.lastObstacleTime > spawnInterval) {
				const height = 30 + Math.random() * 30;
				currentGame.obstacles.push({ x: canvas.width, height });
				currentGame.lastObstacleTime = now;
			}

			// Move obstacles
			for (const obs of currentGame.obstacles) {
				obs.x -= currentGame.speed;
			}

			// Remove off-screen obstacles
			currentGame.obstacles = currentGame.obstacles.filter((obs) => obs.x > -30);

			// Collision detection
			const dinoLeft = 50;
			const dinoRight = 50 + DINO_WIDTH - 5;
			const dinoBottom = canvas.height - GROUND_HEIGHT + currentGame.dinoY;

			for (const obs of currentGame.obstacles) {
				const obsLeft = obs.x + 2;
				const obsRight = obs.x + 18;
				const obsTop = canvas.height - GROUND_HEIGHT - obs.height;

				if (dinoRight > obsLeft && dinoLeft < obsRight && dinoBottom > obsTop) {
					setStatus("gameover");
					return;
				}
			}
		};

		const gameLoop = () => {
			update();
			draw();
			animationRef.current = requestAnimationFrame(gameLoop);
		};

		// Initial draw
		draw();

		// Start game loop
		animationRef.current = requestAnimationFrame(gameLoop);

		// Event handlers
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space" || e.code === "ArrowUp") {
				e.preventDefault();
				handleAction();
			}
		};

		const handleClick = () => {
			handleAction();
		};

		const handleTouch = (e: TouchEvent) => {
			e.preventDefault();
			handleAction();
		};

		window.addEventListener("keydown", handleKeyDown);
		canvas.addEventListener("click", handleClick);
		canvas.addEventListener("touchstart", handleTouch, { passive: false });

		return () => {
			cancelAnimationFrame(animationRef.current);
			window.removeEventListener("keydown", handleKeyDown);
			canvas.removeEventListener("click", handleClick);
			canvas.removeEventListener("touchstart", handleTouch);
		};
	}, [handleAction]);

	return (
		<canvas
			ref={canvasRef}
			width={600}
			height={160}
			className="w-full max-w-xl cursor-pointer rounded-lg border border-border/30 bg-background/50"
		/>
	);
}
