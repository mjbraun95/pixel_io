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
}

function update() {
    // Discrete player movement
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && player.x > 0) {
        mineBlock(player.x / blockSize, player.y / blockSize);
        player.x -= blockSize;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right) && player.x < config.width - blockSize) {
        mineBlock(player.x / blockSize, player.y / blockSize);
        player.x += blockSize;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.y > 0) {
        mineBlock(player.x / blockSize, player.y / blockSize);
        player.y -= blockSize;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && player.y < config.height - blockSize) {
        mineBlock(player.x / blockSize, player.y / blockSize);
        player.y += blockSize;
    }
}

function mineBlock(x, y) {
    if (grid[Math.floor(x)][Math.floor(y)] === 'dirt') {
        grid[Math.floor(x)][Math.floor(y)] = 'air';
        var minedBlock = this.add.graphics({ fillStyle: { color: 0x000000 } });
        minedBlock.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }
}
