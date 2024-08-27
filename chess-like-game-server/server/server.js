const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let gameState = {
  currentPlayer: 'A',
  board: [
    ['A-P1', 'A-H1', 'A-H2', 'A-H3', 'A-P2'],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['B-P1', 'B-H1', 'B-H2', 'B-H3', 'B-P2'],
  ],
};

const validateMove = (character, move) => {
  // Implement move validation logic here
  return true; // Placeholder
};

const processMove = (data) => {
  const { player, character, move } = data;
  if (player !== gameState.currentPlayer) {
    return { error: 'Not your turn!' };
  }

  if (!validateMove(character, move)) {
    return { error: 'Invalid move!' };
  }

  // Implement game logic here
  // Update the gameState with the new positions

  gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';

  return { success: true, gameState };
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    const response = processMove(data);

    ws.send(JSON.stringify(response));
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'update', gameState }));
      }
    });
  });

  ws.send(JSON.stringify({ type: 'init', gameState }));
});

console.log('WebSocket server is running on ws://localhost:8080');
