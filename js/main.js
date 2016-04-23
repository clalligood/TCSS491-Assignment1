var AM = new AssetManager();

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

// inheritance 
function Cheetah(game, idle_sheet, walk_sheet) {
    this.idleAnimation = new Animation(idle_sheet, 288, 311, 5, 0.075, 16, true, 0.5);
    this.walkAnimation = new Animation(walk_sheet, 288, 311, 5, 0.075, 16, true, 0.5);
    this.animation = this.walkAnimation;
    this.speed = 200;
    this.ctx = game.ctx;
    this.game = game;
    Entity.call(this, game, 0, 250);
}

Cheetah.prototype = new Entity();
Cheetah.prototype.constructor = Cheetah;

Cheetah.prototype.update = function () {
    if (this.game.left) {
        this.animation = this.walkAnimation;
        this.x -= this.game.clockTick * this.speed;
    }
    if (this.game.right) {
        this.animation = this.walkAnimation;
        this.x += this.game.clockTick * this.speed;
    }
    if (!this.game.right && !this.game.left) {
        this.animation = this.idleAnimation;
    }
}

Cheetah.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("/img/skeleton-idle_0-test.png");
AM.queueDownload("/img/fghjkl.png");
AM.queueDownload("/img/background.jpg");

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("/img/background.jpg")));
    gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("/img/skeleton-idle_0-test.png"), AM.getAsset("/img/fghjkl.png")));

    console.log("All Done!");
});