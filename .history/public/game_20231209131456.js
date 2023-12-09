var config = {
    type: Phaser.AUTO,
    width: 480, // Grid width: 24 blocks * 20 pixels each
    height: 360, // Grid height: 18 blocks * 20 pixels each
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

function preload() {
    // No assets to preload
}

function create() {
    // Create a grid background
    var graphics = this.add.graphics();
    graphics.lineStyle(1, 0x000000, 0.8);
    for (var x = 0; x < config.width; x += blockSize) {
        for (var y = 0; y < config.height; y += blockSize) {
            graphics.strokeRect(x, y, blockSize, blockSize);
        }
    }

    // Create a pixel (represented by a small square)
    player = this.physics.add.sprite(blockSize / 2, blockSize / 2, 'pixel').setOrigin(0.5, 0.5);
    this.add.graphics({ fillStyle: { color: 0x0000ff } })
        .fillRect(player.x - (blockSize / 2), player.y - (blockSize / 2), blockSize, blockSize);

    // Create cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Discrete player movement
    if (Phaser.Input.Keyboard.JustDown(cursors.left) && player.x > blockSize / 2) {
        player.x -= blockSize;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right) && player.x < config.width - blockSize / 2) {
        player.x += blockSize;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.y > blockSize / 2) {
        player.y -= blockSize;
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down) && player.y < config.height - blockSize / 2) {
        player.y += blockSize;
    }
}
