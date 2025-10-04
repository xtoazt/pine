const fs = require('fs');
const path = require('path');

// Create public/games directory
const gamesDir = path.join(__dirname, '../public/games');
if (!fs.existsSync(gamesDir)) {
  fs.mkdirSync(gamesDir, { recursive: true });
}

// Simple HTML5 game templates
const gameTemplates = {
  snake: `
<!DOCTYPE html>
<html>
<head>
    <title>Snake Game</title>
    <style>
        body { margin: 0; padding: 20px; background: #000; color: #0f0; font-family: monospace; }
        canvas { border: 2px solid #0f0; background: #000; }
        .score { font-size: 20px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="score">Score: <span id="score">0</span></div>
    <canvas id="gameCanvas" width="400" height="400"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        
        let snake = [{x: 10, y: 10}];
        let food = {x: 15, y: 15};
        let dx = 0;
        let dy = 0;
        let score = 0;
        
        function drawGame() {
            clearCanvas();
            drawSnake();
            drawFood();
        }
        
        function clearCanvas() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        function drawSnake() {
            ctx.fillStyle = '#0f0';
            for (let segment of snake) {
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            }
        }
        
        function drawFood() {
            ctx.fillStyle = '#f00';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
        }
        
        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            snake.unshift(head);
            
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                generateFood();
            } else {
                snake.pop();
            }
        }
        
        function generateFood() {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        }
        
        function checkCollision() {
            const head = snake[0];
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                return true;
            }
            for (let segment of snake.slice(1)) {
                if (head.x === segment.x && head.y === segment.y) {
                    return true;
                }
            }
            return false;
        }
        
        function gameLoop() {
            if (checkCollision()) {
                alert('Game Over! Score: ' + score);
                location.reload();
                return;
            }
            moveSnake();
            drawGame();
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && dy !== 1) { dx = 0; dy = -1; }
            if (e.key === 'ArrowDown' && dy !== -1) { dx = 0; dy = 1; }
            if (e.key === 'ArrowLeft' && dx !== 1) { dx = -1; dy = 0; }
            if (e.key === 'ArrowRight' && dx !== -1) { dx = 1; dy = 0; }
        });
        
        setInterval(gameLoop, 100);
        drawGame();
    </script>
</body>
</html>`,

  pong: `
<!DOCTYPE html>
<html>
<head>
    <title>Pong Game</title>
    <style>
        body { margin: 0; padding: 20px; background: #000; color: #fff; font-family: Arial; }
        canvas { border: 2px solid #fff; background: #000; }
        .score { font-size: 24px; margin-bottom: 10px; text-align: center; }
    </style>
</head>
<body>
    <div class="score">Player: <span id="playerScore">0</span> | Computer: <span id="computerScore">0</span></div>
    <canvas id="gameCanvas" width="600" height="400"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const playerScoreElement = document.getElementById('playerScore');
        const computerScoreElement = document.getElementById('computerScore');
        
        const paddleHeight = 80;
        const paddleWidth = 15;
        const ballSize = 10;
        
        let playerY = canvas.height / 2 - paddleHeight / 2;
        let computerY = canvas.height / 2 - paddleHeight / 2;
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        let ballSpeedX = 5;
        let ballSpeedY = 3;
        let playerScore = 0;
        let computerScore = 0;
        
        function draw() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw paddles
            ctx.fillStyle = 'white';
            ctx.fillRect(10, playerY, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - 25, computerY, paddleWidth, paddleHeight);
            
            // Draw ball
            ctx.fillRect(ballX - ballSize/2, ballY - ballSize/2, ballSize, ballSize);
        }
        
        function update() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            
            // Ball collision with top/bottom
            if (ballY <= ballSize/2 || ballY >= canvas.height - ballSize/2) {
                ballSpeedY = -ballSpeedY;
            }
            
            // Ball collision with paddles
            if (ballX <= 25 && ballY >= playerY && ballY <= playerY + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballX >= canvas.width - 25 && ballY >= computerY && ballY <= computerY + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            }
            
            // Computer AI
            if (computerY + paddleHeight/2 < ballY) {
                computerY += 4;
            } else {
                computerY -= 4;
            }
            
            // Scoring
            if (ballX < 0) {
                computerScore++;
                computerScoreElement.textContent = computerScore;
                resetBall();
            }
            if (ballX > canvas.width) {
                playerScore++;
                playerScoreElement.textContent = playerScore;
                resetBall();
            }
        }
        
        function resetBall() {
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = -ballSpeedX;
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && playerY > 0) {
                playerY -= 10;
            }
            if (e.key === 'ArrowDown' && playerY < canvas.height - paddleHeight) {
                playerY += 10;
            }
        });
        
        function gameLoop() {
            update();
            draw();
        }
        
        setInterval(gameLoop, 16);
        draw();
    </script>
</body>
</html>`,

  tetris: `
<!DOCTYPE html>
<html>
<head>
    <title>Tetris Game</title>
    <style>
        body { margin: 0; padding: 20px; background: #000; color: #fff; font-family: Arial; }
        canvas { border: 2px solid #fff; background: #000; }
        .score { font-size: 20px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="score">Score: <span id="score">0</span> | Lines: <span id="lines">0</span></div>
    <canvas id="gameCanvas" width="300" height="600"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const linesElement = document.getElementById('lines');
        
        const blockSize = 30;
        const cols = canvas.width / blockSize;
        const rows = canvas.height / blockSize;
        
        let board = Array(rows).fill().map(() => Array(cols).fill(0));
        let currentPiece = null;
        let score = 0;
        let lines = 0;
        
        const pieces = [
            { shape: [[1,1,1,1]], color: '#00f' },
            { shape: [[1,1],[1,1]], color: '#ff0' },
            { shape: [[1,1,1],[0,1,0]], color: '#0f0' },
            { shape: [[1,1,1],[1,0,0]], color: '#f00' },
            { shape: [[1,1,1],[0,0,1]], color: '#f0f' }
        ];
        
        function createPiece() {
            const piece = pieces[Math.floor(Math.random() * pieces.length)];
            return {
                shape: piece.shape,
                color: piece.color,
                x: Math.floor(cols / 2) - Math.floor(piece.shape[0].length / 2),
                y: 0
            };
        }
        
        function draw() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw board
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    if (board[y][x]) {
                        ctx.fillStyle = board[y][x];
                        ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                    }
                }
            }
            
            // Draw current piece
            if (currentPiece) {
                ctx.fillStyle = currentPiece.color;
                for (let y = 0; y < currentPiece.shape.length; y++) {
                    for (let x = 0; x < currentPiece.shape[y].length; x++) {
                        if (currentPiece.shape[y][x]) {
                            ctx.fillRect(
                                (currentPiece.x + x) * blockSize,
                                (currentPiece.y + y) * blockSize,
                                blockSize - 1,
                                blockSize - 1
                            );
                        }
                    }
                }
            }
        }
        
        function movePiece(dx, dy) {
            if (currentPiece && isValidMove(currentPiece.x + dx, currentPiece.y + dy, currentPiece.shape)) {
                currentPiece.x += dx;
                currentPiece.y += dy;
                return true;
            }
            return false;
        }
        
        function isValidMove(x, y, shape) {
            for (let py = 0; py < shape.length; py++) {
                for (let px = 0; px < shape[py].length; px++) {
                    if (shape[py][px]) {
                        const nx = x + px;
                        const ny = y + py;
                        if (nx < 0 || nx >= cols || ny >= rows || (ny >= 0 && board[ny][nx])) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        
        function placePiece() {
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x]) {
                        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
                    }
                }
            }
            clearLines();
            currentPiece = createPiece();
        }
        
        function clearLines() {
            for (let y = rows - 1; y >= 0; y--) {
                if (board[y].every(cell => cell !== 0)) {
                    board.splice(y, 1);
                    board.unshift(Array(cols).fill(0));
                    score += 100;
                    lines++;
                    scoreElement.textContent = score;
                    linesElement.textContent = lines;
                }
            }
        }
        
        function gameLoop() {
            if (!currentPiece) {
                currentPiece = createPiece();
            }
            
            if (!movePiece(0, 1)) {
                placePiece();
            }
            
            draw();
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') movePiece(-1, 0);
            if (e.key === 'ArrowRight') movePiece(1, 0);
            if (e.key === 'ArrowDown') movePiece(0, 1);
            if (e.key === ' ') {
                while (movePiece(0, 1)) {}
            }
        });
        
        setInterval(gameLoop, 500);
        draw();
    </script>
</body>
</html>`,

  breakout: `
<!DOCTYPE html>
<html>
<head>
    <title>Breakout Game</title>
    <style>
        body { margin: 0; padding: 20px; background: #000; color: #fff; font-family: Arial; }
        canvas { border: 2px solid #fff; background: #000; }
        .score { font-size: 20px; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="score">Score: <span id="score">0</span> | Lives: <span id="lives">3</span></div>
    <canvas id="gameCanvas" width="600" height="400"></canvas>
    <script>
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const livesElement = document.getElementById('lives');
        
        const paddleWidth = 100;
        const paddleHeight = 15;
        const ballSize = 10;
        const brickWidth = 60;
        const brickHeight = 20;
        const brickRows = 5;
        const brickCols = 10;
        
        let paddleX = canvas.width / 2 - paddleWidth / 2;
        let ballX = canvas.width / 2;
        let ballY = canvas.height - 50;
        let ballSpeedX = 4;
        let ballSpeedY = -4;
        let score = 0;
        let lives = 3;
        
        let bricks = [];
        for (let row = 0; row < brickRows; row++) {
            bricks[row] = [];
            for (let col = 0; col < brickCols; col++) {
                bricks[row][col] = { x: col * brickWidth, y: row * brickHeight + 50, visible: true };
            }
        }
        
        function draw() {
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw paddle
            ctx.fillStyle = 'white';
            ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            
            // Draw ball
            ctx.fillRect(ballX - ballSize/2, ballY - ballSize/2, ballSize, ballSize);
            
            // Draw bricks
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    if (bricks[row][col].visible) {
                        ctx.fillStyle = \`hsl(\${row * 60}, 70%, 50%)\`;
                        ctx.fillRect(bricks[row][col].x, bricks[row][col].y, brickWidth - 2, brickHeight - 2);
                    }
                }
            }
        }
        
        function update() {
            ballX += ballSpeedX;
            ballY += ballSpeedY;
            
            // Ball collision with walls
            if (ballX <= ballSize/2 || ballX >= canvas.width - ballSize/2) {
                ballSpeedX = -ballSpeedX;
            }
            if (ballY <= ballSize/2) {
                ballSpeedY = -ballSpeedY;
            }
            
            // Ball collision with paddle
            if (ballY >= canvas.height - paddleHeight - ballSize/2 && 
                ballX >= paddleX && ballX <= paddleX + paddleWidth) {
                ballSpeedY = -ballSpeedY;
            }
            
            // Ball collision with bricks
            for (let row = 0; row < brickRows; row++) {
                for (let col = 0; col < brickCols; col++) {
                    if (bricks[row][col].visible) {
                        const brick = bricks[row][col];
                        if (ballX >= brick.x && ballX <= brick.x + brickWidth &&
                            ballY >= brick.y && ballY <= brick.y + brickHeight) {
                            bricks[row][col].visible = false;
                            ballSpeedY = -ballSpeedY;
                            score += 10;
                            scoreElement.textContent = score;
                        }
                    }
                }
            }
            
            // Ball out of bounds
            if (ballY > canvas.height) {
                lives--;
                livesElement.textContent = lives;
                if (lives <= 0) {
                    alert('Game Over! Score: ' + score);
                    location.reload();
                } else {
                    ballX = canvas.width / 2;
                    ballY = canvas.height - 50;
                    ballSpeedX = 4;
                    ballSpeedY = -4;
                }
            }
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && paddleX > 0) {
                paddleX -= 20;
            }
            if (e.key === 'ArrowRight' && paddleX < canvas.width - paddleWidth) {
                paddleX += 20;
            }
        });
        
        function gameLoop() {
            update();
            draw();
        }
        
        setInterval(gameLoop, 16);
        draw();
    </script>
</body>
</html>`
};

// Generate local games
const localGames = [];
const gameTypes = Object.keys(gameTemplates);

for (let i = 1; i <= 1000; i++) {
  const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
  const gameId = `local-${gameType}-${i}`;
  const gameTitle = `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} ${i}`;
  
  // Create the game HTML file
  const gameHtml = gameTemplates[gameType];
  const gamePath = path.join(gamesDir, `${gameId}.html`);
  fs.writeFileSync(gamePath, gameHtml);
  
  // Add to games list
  localGames.push({
    id: gameId,
    title: gameTitle,
    description: `Play ${gameTitle} - a classic ${gameType} game with engaging gameplay.`,
    thumbnail: `/games/${gameId}.png`, // We'll create placeholder images
    category: gameType === 'snake' ? 'arcade' : 
              gameType === 'pong' ? 'sports' :
              gameType === 'tetris' ? 'puzzle' : 'arcade',
    tags: [gameType, 'classic', 'local'],
    playUrl: `/play/${gameId}`,
    upvotes: Math.floor(Math.random() * 1000) + 100,
    downvotes: Math.floor(Math.random() * 50) + 5,
    playCount: Math.floor(Math.random() * 10000) + 1000,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    source: 'local'
  });
}

// Write the local games data
const outputPath = path.join(__dirname, '../src/data/local-games.json');
fs.writeFileSync(outputPath, JSON.stringify(localGames, null, 2));

console.log(`Generated ${localGames.length} local games and saved to ${outputPath}`);
console.log('Game files created in:', gamesDir);
console.log('Sample games:', localGames.slice(0, 5).map(g => g.title));
