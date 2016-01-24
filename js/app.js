var block_width = 101,
    y_first_road_block = 60,
    y_second_road_block = 145,
    y_third_road_block = 225,
    block_height = 83;

// Enemies our player must avoid
var Enemy = function(x_location, y_location, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x_location;
    this.y = y_location;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.real_x = this.x;
    this.real_y = this.y + 75;
    this.width = 100;
    this.height = 70;
    this.right = this.real_x + this.width;
    this.left = this.real_x;
    this.top = this.real_y;
    this.bottom = this.real_y + this.height;

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    if (this.x > 505) {
        this.x = -110;
    }

    this.checkCollision();
};

Enemy.prototype.checkCollision = function() {
    if (player.right >= this.left && player.left <= this.right &&
        player.bottom >= this.top && player.top <= this.bottom
    ) {
        player.x = player.initial_x;
        player.y = player.initial_y;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-cat-girl.png';
    this.initial_x = block_width * 2;
    this.initial_y = 300;
    this.x = this.initial_x;
    this.y = this.initial_y;
    this.width = 70;
    this.height = 60;
};

Player.prototype.update = function(dt) {
    this.real_x = this.x + 16;
    this.real_y = this.y + 80;
    this.right = this.real_x + this.width;
    this.left = this.real_x;
    this.top = this.real_y;
    this.bottom = this.real_y + this.height;

    if (this.bottom < 140) {
        allEnemies = [];
        victory.x = 2 * 101;
        victory.y = 2 * 83;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x >= block_width * 1) {
                this.x -= block_width;
            }
            break;
        case 'right':
            if (this.x < block_width * 4) {
                this.x += block_width;
            }
            break;
        case 'up':
            if (this.y >= 0) {
                this.y -= block_height;
            }
            break;
        case 'down':
            if (this.y <= 300) {
                this.y += block_height;
            }
            break;
    }
};

var Victory = function() {
    this.sprite = 'images/Star.png';
    this.x = -200;
    this.y = -200;
    this.height = 171;
};

Victory.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    ctx.font = 'bold 36pt Helvetica';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(249, 243, 32, 0.7)';
    ctx.strokeStyle = 'rgba(243, 132, 19, 0.6)';
    ctx.lineWidth = 2;

    win_text = 'You win!';
    ctx.fillText(win_text, 505 / 2, this.y + this.height + 20);
    ctx.strokeText(win_text, 505 / 2, this.y + this.height + 20);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [
    new Enemy(block_width, y_first_road_block, 100),
    new Enemy(0, y_second_road_block, 140),
    new Enemy(block_width*2, y_third_road_block, 90)
];
player = new Player();
victory = new Victory();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
