var dirtColor = 0x652A00; // Brown color for dirt
var ironColor = 0x7B7B7B; // Darker gray for iron
var silverColor = 0xC0C0C0; // Shiny light gray for silver
var goldColor = 0xFFD700; // Bright gold for gold

var config = {
    type: Phaser.AUTO,
    width: 1920, // Grid width: 24 blocks * 20 pixels each
    height: 1080, // Grid height: 18 blocks * 20 pixels each
    backgroundColor: dirtColor, // Brown background
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var cursors;
var blockSize = 4; // Size of each block in pixels
var mapWidth = 500;
var mapHeight = 200;
var grid; // To store the grid state
var score = 0;
var size = 1;


function preload() {
    // No assets to preload
}

function create() {
    // Initialize a 100x100 grid
    grid = Array(mapWidth).fill().map(() => Array(mapHeight).fill(dirtColor));

    // Randomly distribute resources
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            let randomVal = Math.random();
            if (randomVal < 0.01) { // 1% chance of gold
                grid[x][y] = goldColor;
            } else if (randomVal < 0.03) { // 2% chance of silver
                grid[x][y] = silverColor;
            } else if (randomVal < 0.08) { // 5% chance of iron
                grid[x][y] = ironColor;
            }
            // The rest remains dirt
        }
    }

    // Render the grid
    renderGrid.call(this);

    // Create a player (represented by a blue square)
    player = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    player.fillRect(blockSize / 2 - (blockSize / 2), blockSize / 2 - (blockSize / 2), blockSize*size, blockSize*size);

    // Finally, create the score text
    this.scoreText = this.add.text(config.width / 2, 16, 'Score: 0', {
        fontSize: '32px', 
        fill: '#FFF',
        backgroundColor: '#000', 
        padding: 10,
        align: 'center'
    }).setOrigin(0.5, 0);
    this.scoreText.setScrollFactor(0);


    // Create cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Initialize lastPosition
    lastPosition = { x: player.x, y: player.y };

    // Set the camera to follow the player
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, mapWidth * blockSize, mapHeight * blockSize);

    // Bind the mineBlock function to 'this' (the scene)
    this.mineBlock = mineBlock.bind(this);

    // Bind the mineBlocks function to 'this' (the scene)
    this.mineBlocks = mineBlocks.bind(this);

    // Mine the initial block
    this.mineBlock(0, 0);
}

function renderGrid() {
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            let color;
            switch(grid[x][y]) {
                case ironColor:
                    color = ironColor;
                    break;
                case silverColor:
                    color = silverColor;
                    break;
                case goldColor:
                    color = goldColor;
                    break;
                default:
                    color = dirtColor;
            }
            var block = this.add.graphics({ fillStyle: { color: color } });
            block.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
    }
}

function update() {
    // Discrete player movement with mining
    let moved = "nowhere";
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && player.x > 0) {
        player.x -= blockSize;
        moved = "left";
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right) && player.x < (mapWidth - 1) * blockSize) {
        player.x += blockSize;
        moved = "right";
    }
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.y > 0) {
        player.y -= blockSize;
        moved = "up";
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && player.y < (mapHeight - 1) * blockSize) {
        player.y += blockSize;
        moved = "down";
    }

    if (moved !== "nowhere") {
        // this.mineBlock(player.x / blockSize, player.y / blockSize);
        this.mineBlocks(player.x / blockSize, player.y / blockSize, size, moved);
    }

    player.fillRect(blockSize / 2 - (blockSize / 2), blockSize / 2 - (blockSize / 2), blockSize*size, blockSize*size);
    player.setDepth(1);
}

function checkBlockType(x, y) {

}

// Define the scores for each block type
const blockScores = {
    [ironColor]: 5,
    [silverColor]: 10,
    [goldColor]: 25,
    'default': 0  // dirt
};

// Function to mine multiple blocks based on the size of the player
function mineBlocks(x, y, size, moved) {
    this.mineBlock(x, y);
    if (moved === "left") {
        for (let j = 0; j < size; j++) {
            this.mineBlock(x, y + j);
        }
    } else if (moved === "right") {
        for (let j = 0; j < size; j++) {
            this.mineBlock(x + size - 1, y + j);
        }
    } else if (moved === "up") {
        for (let i = 0; i < size; i++) {
            this.mineBlock(x + i, y);
        }
    } else if (moved === "down") {
        for (let i = 0; i < size; i++) {
            this.mineBlock(x + i, y + size - 1);
        }
    }
}

function mineBlock(x, y) {
    var gridX = Math.floor(x);
    var gridY = Math.floor(y);
    var blockType = grid[gridX][gridY];

    if (blockType !== 'player') {
        // Update the score based on block type
        score += blockScores[blockType] || blockScores['default'];

        // Update the score text + Bring the score text to the top
        this.scoreText.setText('Score: ' + score);
        this.scoreText.setDepth(1);

        // Log the score and size for debugging (or display it on the screen)
        console.log("Score: " + score + ", Size: " + size);

        // Update the size of the player based on the score
        size = Math.floor(Math.sqrt(Math.floor(score/10)));
    }

    // Change the previous block to black
    if (grid[lastPosition.x][lastPosition.y] === 'player') {
        var previousBlock = this.add.graphics({ fillStyle: { color: 0x000000 } });
        previousBlock.fillRect(lastPosition.x * blockSize, lastPosition.y * blockSize, blockSize, blockSize);
        grid[lastPosition.x][lastPosition.y] = 'air';
    }

    grid[gridX][gridY] = 'player';
    var currentBlock = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    currentBlock.fillRect(gridX * blockSize, gridY * blockSize, blockSize, blockSize);

    // Update the last position
    lastPosition.x = gridX;
    lastPosition.y = gridY;
}

