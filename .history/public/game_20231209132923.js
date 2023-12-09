var config = {
    type: Phaser.AUTO,
    width: 480, // Grid width: 24 blocks * 20 pixels each
    height: 360, // Grid height: 18 blocks * 20 pixels each
    backgroundColor: 0xA52A2A, // Brown background
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
var grid; // To store the grid state

function preload() {
    // No assets to preload
}

function create() {
    // Initialize the grid state
    grid = Array(24).fill().map(() => Array(18).fill('dirt'));

    // Create a player (represented by a blue square)
    player = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    player.fillRect(blockSize / 2 - (blockSize / 2), blockSize / 2 - (blockSize / 2), blockSize, blockSize);

    // Create cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();

    // Bind the mineBlock function to 'this' (the scene)
    this.mineBlock = mineBlock.bind(this);
}

function update() {
    // Discrete player movement with mining
    let moved = false;
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && player.x > 0) {
        player.x -= blockSize;
        moved = true;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right) && player.x < config.width - blockSize) {
        player.x += blockSize;
        moved = true;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.y > 0) {
        player.y -= blockSize;
        moved = true;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && player.y < config.height - blockSize) {
        player.y += blockSize;
        moved = true;
    }

    if (moved) {
        this.mineBlock(player.x / blockSize, player.y / blockSize);
    }
}

function mineBlock(x, y) {
    // Convert the coordinates to grid indexes
    var gridX = Math.floor(x);
    var gridY = Math.floor(y);

    // Change the previous block to black if it was air
    if (grid[gridX][gridY] === 'air') {
        var previousBlock = this.add.graphics({ fillStyle: { color: 0x000000 } });
        previousBlock.fillRect(gridX * blockSize, gridY * blockSize, blockSize, blockSize);
    }

    // Change the current block to blue (player's color)
    grid[gridX][gridY] = 'player';
    var currentBlock = this.add.graphics({ fillStyle: { color: 0x0000ff } });
    currentBlock.fillRect(gridX * blockSize, gridY * blockSize, blockSize, blockSize);
}
