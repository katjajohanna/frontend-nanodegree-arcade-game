var block_width = 101,
    y_first_road_block = 60,
    y_second_road_block = 145,
    y_third_road_block = 225,
    block_height = 83,
    rocks = [];

// Enemies our player must avoid
var Enemy = function(x_location, y_location, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.initial_x = x_location;
    this.x = x_location;
    this.y = y_location;
    this.speed = speed;
    this.width = 100;
    this.height = 70;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.real_x = this.x;
    this.real_y = this.y + 75;
    this.right = this.real_x + this.width;
    this.left = this.real_x;
    this.top = this.real_y;
    this.bottom = this.real_y + this.height;

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (is_on_rock(this.left, this.right, this.real_y)) {
        this.x += (this.speed * dt) / 2;
    } else {
        this.x += this.speed * dt;
    }

    if (this.x > 505) {
        this.moveToBeginning();
    }

    this.checkCollision();
};

Enemy.prototype.moveToBeginning = function() {
    this.x = this.initial_x;

    if (this.x > -100) {
        this.x = this.x - 505;
    }
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

Enemy.prototype.destroy = function() {
    this.moveToBeginning();
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
    this.win = false;
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
        this.win = true;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    if (this.win) {
        return;
    }

    switch (key) {
        case 'left':
            if (this.x >= block_width * 1 && !is_rock_blocking_left(this.x, this.real_y)) {
                this.x -= block_width;
            }
            break;
        case 'right':
            if (this.x < block_width * 4 && !is_rock_blocking_right(this.x, this.real_y)) {
                this.x += block_width;
            }
            break;
        case 'up':
            if (this.y >= 0 && !is_rock_blocking_top(this.x, this.real_y)) {
                this.y -= block_height;
            }
            break;
        case 'down':
            if (this.y <= 300 && !is_rock_blocking_bottom(this.x, this.real_y)) {
                this.y += block_height;
            }
            break;
        case 'space':
            if (!is_rock_blocking_top(this.x, this.real_y)) {
                rocks.push(new Rock(this.x, this.y));
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

var Rock = function(x, y) {
    this.sprite = 'images/Rock.png';
    this.x = x;
    this.y = y - 30;
    this.initial_y = this.y;
};

Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Rock.prototype.update = function(dt) {
    if (this.y > this.initial_y - 55) {
        this.y -= 80 * dt;
        this.real_y = this.y + 65;

        destroy_enemies(this.x, this.y);
    }
}

function is_rock_blocking_top(x, y) {
    for (var i = 0; i < rocks.length; i++) {
        y_difference = y - rocks[i].real_y;

        if (rocks[i].x == x && y_difference < 150 && y_difference > 20) {
            return true;
        }
    }

    return false;
};

function is_rock_blocking_bottom(x, y) {
    for (var i = 0; i < rocks.length; i++) {
        y_difference = rocks[i].real_y - y;

        if (rocks[i].x == x && y_difference < 140 && y_difference > 20) {
            return true;
        }
    }

    return false;
};

function is_rock_blocking_left(x, y) {
    for (var i = 0; i < rocks.length; i++) {
        x_difference = x - rocks[i].x;
        y_difference = rocks[i].real_y - y;

        if (x_difference > 0 && x_difference <= block_width &&
            y_difference > -20 && y_difference < 20
        ) {
            return true;
        }
    }

    return false;
};

function is_rock_blocking_right(x, y) {
    for (var i = 0; i < rocks.length; i++) {
        x_difference = rocks[i].x - x;
        y_difference = rocks[i].real_y - y;

        if (x_difference > 0 && x_difference <= block_width &&
            y_difference > -20 && y_difference < 20
        ) {
            return true;
        }
    }

    return false;
};

function is_on_rock(left, right, y) {
    for (var i = 0; i < rocks.length; i++) {
        y_difference = rocks[i].real_y - y;

        if (y_difference > -40 && y_difference < 40 &&
            right >= rocks[i].x && left <= rocks[i].x + block_width
        ) {
            return true;
        }
    }

    return false;
}

function destroy_enemies(x, y) {
    for (var i = 0; i < allEnemies.length; i++) {
        y_difference = allEnemies[i].real_y - y;

        if (y_difference > 10 && y_difference < 50 &&
            allEnemies[i].right >= x && allEnemies[i].left <= x + block_width
        ) {
            allEnemies[i].destroy();
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [];

for (var i = 0; i < 18; i++) {
    x = Math.random() * 500;
    x = x - Math.random() * 100 * i * i;

    line = Math.random() * 3;
    if (line < 1) {
        y = y_first_road_block;
    } else if (line < 2) {
        y = y_second_road_block;
    } else {
        y = y_third_road_block;
    }

    speed = Math.random() * 100 + 100;

    allEnemies.push(new Enemy(x, y, speed));
}

player = new Player();
victory = new Victory();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
