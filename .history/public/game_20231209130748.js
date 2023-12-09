var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

function preload() {
    // Preload assets
}

function create() {
    // Create game world
    player = this.physics.add.sprite(400, 300, 'pixel').setOrigin(0.5, 0.5);
    // We can create a simple square graphic for the pixel
    this.add.graphics({ fillStyle: { color: 0x0000ff } })
        .fillRect(player.x - 2, player.y - 2, 4, 4);

    // Create cursor keys for movement
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Game loop
}
