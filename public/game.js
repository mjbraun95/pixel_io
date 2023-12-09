var dirtColor = 0x652A00; // Brown color for dirt
var ironColor = 0x7B7B7B; // Darker gray for iron
var silverColor = 0xC0C0C0; // Shiny light gray for silver
var goldColor = 0xFFD700; // Bright gold for gold

var config = {
    type: Phaser.AUTO,
    width: 480, // Grid width: 24 blocks * 20 pixels each
    height: 360, // Grid height: 18 blocks * 20 pixels each
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
var blockSize = 20; // Size of each block in pixels
var mapWidth = 100;
var mapHeight = 100;
var grid; // To store the grid state
var score = 0;
var size = 0;


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
    player.fillRect(blockSize / 2 - (blockSize / 2), blockSize / 2 - (blockSize / 2), blockSize, blockSize);

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
    this.cameras.main.setBounds(0, 0, 100 * blockSize, 100 * blockSize);

    // Bind the mineBlock function to 'this' (the scene)
    this.mineBlock = mineBlock.bind(this);

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
    let moved = false;
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && player.x > 0) {
        player.x -= blockSize;
        moved = true;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right) && player.x < (mapWidth - 1) * blockSize) {
        player.x += blockSize;
        moved = true;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.y > 0) {
        player.y -= blockSize;
        moved = true;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && player.y < (mapHeight - 1) * blockSize) {
        player.y += blockSize;
        moved = true;
    }

    if (moved) {
        this.mineBlock(player.x / blockSize, player.y / blockSize);
    }
}

function mineBlock(x, y) {
    var gridX = Math.floor(x);
    var gridY = Math.floor(y);

    if (grid[gridX][gridY] !== 'player') {
        // Increment size
        size++;

        // Calculate score based on block type
        switch(grid[gridX][gridY]) {
            case ironColor:
                score += 5;
                break;
            case silverColor:
                score += 10;
                break;
            case goldColor:
                score += 25;
                break;
            default: // dirt
                score += 1;
        }

        // Update the score text
        this.scoreText.setText('Score: ' + score);
        // Bring the score text to the top
        this.scoreText.setDepth(1);

        // Log the score and size for debugging (or display it on the screen)
        console.log("Score: " + score + ", Size: " + size);
    }

    // Change the previous block to black
    if (grid[lastPosition.x][lastPosition.y] === 'player') {
        var previousBlock = this.add.graphics({ fillStyle: { color: 0x000000 } });
        previousBlock.fillRect(lastPosition.x * blockSize, lastPosition.y * blockSize, blockSize, blockSize);
        grid[lastPosition.x][lastPosition.y] = 'air';
    }

    // Update the current block to blue (player's color)
    grid[gridX][gridY] = 'player';
    var currentBlock = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    currentBlock.fillRect(gridX * blockSize, gridY * blockSize, blockSize, blockSize);

    // Update the last position
    lastPosition.x = gridX;
    lastPosition.y = gridY;
}

