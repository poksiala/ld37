var W = 400;
var H = 500;

var UL = [0, 0];
var LL = [0, H];
var UR = [W, 0];
var LR = [W, H];

var M = 50;

var DUL = [M, M];
var DLL = [M, H-M];
var DUR = [W-M, M];
var DLR = [W-M, H-M];

var DW = W/2 - M;
var FPS = 30;

var SPEED = 0;

var NUMFLOORS = 3;

var PLACES = [[50, 490],[100, 470],[150, 490],[200, 470],[250, 490],[300, 470],[350, 490]];

var dudes = [];

for (var i=0; i < PLACES.length; i++) {
    dudes.push(newDude(PLACES[i], Math.floor((Math.random() * NUMFLOORS) + 1)));
}

function newGame(c) {
    var newGame = {
        places: [[50, 490],[100, 470],[150, 490],[200, 470],[250, 490],[300, 470],[350, 490]],
        dudes: [],
        speed: 0,
        floorColor: "#4F1319",
        ceilingColor: "#BBBCBD",
        wallColor: "#4F4D4E",
        liftPos: 100,
        ctx: c.getContext("2d"),
        update: function (){
            this.liftPos += SPEED;
            this.doors.update();
            floors.forEach(function (f) {
                f.update();
            });

        },

        doors: {
            color: "#636062",
            status: 1.00,
            moving: 0,
            speed: 0.05,
            areClosed: function () {
                return this.status == 1.0;
            },
            areOpen: function () {
                return this.status == 0.0;
            },
            draw: function(ctx) {
                var leftDoor = [DUL,
                    [M + DW * this.status, M],
                    [M + DW * this.status, H - M],
                    DLL];
                var rightDoor = [DUR,
                    [W - M - DW * this.status, M],
                    [W - M - DW * this.status, H - M],
                    DLR];
                drawPoly(ctx, this.color, leftDoor);
                drawPoly(ctx, this.color, rightDoor);
            },
            update: function () {
                this.status += this.moving * this.speed;
                if (this.status <= 0.0) {
                    this.status = 0.0;
                    this.status = 0;
                }
                if (this.status >= 1.0) {
                    this.status = 1.0;
                    this.moving = 0;
                }
            },
            buttonPressed: function () {
                if (this.areOpen()) {
                    this.moving = 1;
                } else if (this.areClosed() && Math.abs(SPEED) <= 1) {
                    this.moving = -1;
                } else {
                    this.moving = this.moving * (-1);
                }
            }
        },

        draw: function() {
            this.ctx.beginPath();
            this.ctx.rect(0, 0, W, H);
            this.ctx.fillStyle = "black";
            this.ctx.fill();
            var that = this;
            floors.forEach(function (f) {
                f.draw(that.ctx, that.liftPos)
            });
            this.drawWalls();
            this.doors.draw(this.ctx);
            for (var i = 0; i < this.dudes.length; i++) {
                this.dudes[i].setPos(this.places[i]);
                this.dudes[i].draw(that.ctx);
            }
        },

        drawWalls: function() {
            var ceiling = [UL, UR, DUR, DUL];
            var leftWall = [UL, DUL, DLL, LL];
            var floor = [LL, DLL, DLR, LR];
            var rightWall = [UR, DUR, DLR, LR];
            drawPoly(this.ctx, this.ceilingColor, ceiling);
            drawPoly(this.ctx, this.floorColor, floor);
            drawPoly(this.ctx, this.wallColor, rightWall);
            drawPoly(this.ctx, this.wallColor, leftWall);
        },

        changeSpeed: function(amount) {
            if ((this.doors.areClosed() && Math.abs(SPEED + amount) <= 3)
                                        || Math.abs(SPEED + amount) <= 1) {
                SPEED += amount;
            }
        },
        /** Insert dude into lift
         *
         * @param dude
         * @returns {boolean} whether or not insertion was successful
         */
        dudeIn: function (dude) {
            if (this.dudes.length <7) {
                this.dudes.push(dude);
                return true;
            } else {
                return false;
            }
        }
    };
    return newGame
}


window.addEventListener('keydown', function (event) {
        switch (event.keyCode) {

            case 38: // Up
                Game.changeSpeed(1);
                break;

            case 40: // Down
                Game.changeSpeed(-1);
                break;

            case 32: // Space
                Game.doors.buttonPressed();
                break;
        }
    }, false);

function newDude(pos, f) {
    var dude = {
        x: 0,
        y: 0,
        legW: 20,
        legH: 100,
        bodyH: 100,
        armH: 90,
        armW: 20,
        headR: 20,
        color: "black",
        wantsTo: f,
        draw: function (ctx, x, y) {
            x = typeof x !== 'undefined' ? x : this.x;
            y = typeof y !== 'undefined' ? y : this.y;
            // head
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(x, y - this.legH - this.bodyH - this.headR/2, this.headR, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.font="20px Georgia";
            ctx.fillStyle = "white";
            ctx.fillText(this.wantsTo,x -5,y - this.legH - this.bodyH - this.headR/3);

            ctx.beginPath();
            // body
            ctx.moveTo(x, y - this.legH);
            ctx.lineTo(x, y - this.legH - this.bodyH);
            // arms
            ctx.moveTo(x - this.armW, y - this.legH);
            ctx.lineTo(x, y - this.legH - this.armH);
            ctx.lineTo(x + this.armW, y - this.legH);
            // legs
            ctx.moveTo(x - this.legW, y);
            ctx.lineTo(x, y - this.legH);
            ctx.lineTo(x + this.legW, y);
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.color;
            ctx.stroke();
        },
        setPos: function (cords) {
            this.x = cords[0];
            this.y = cords[1];
        }

    };
    dude.setPos(pos);
    return dude
}

function newFloor(color, pos) {
    return {
        dudes: [],
        color: color,
        h: 500,
        num: NUMFLOORS - pos,
        pos: pos * 500,

        update: function () {
            if (Math.abs(this.pos - (-1 * Game.liftPos)) <=5) {
                // lift is on the floor
                if (Game.doors.areOpen()) {
                    var insertedDudes = [];

                    for (var i = 0; i < this.dudes.length; i++) {
                        if (Game.dudeIn(this.dudes[i])) {
                            insertedDudes.push(this.dudes[i]);
                        }
                    }
                    for (var i = 0; i < insertedDudes.length; i++) {
                        var ii = this.dudes.indexOf(insertedDudes[i]);
                        this.dudes.splice(ii, 1);
                    }

                }
            }
        },

        draw: function (ctx, y) {
            // helping variables
            var top = y + this.pos;
            var bottom = y + this.pos + this.h;
            // floor backgorund
            drawPoly(ctx, "black", [[0, top], [W, top], [W, bottom], [0, bottom]]);
            drawPoly(ctx, this.color, [[0, top+50], [W, top+50], [W, bottom-50], [0, bottom-50]]);

            // dudes

            this.dudes.forEach(function (d) {
                d.draw(ctx, 250, bottom - 70);
            });

            // floor number
            ctx.font="30px Georgia";
            ctx.fillStyle = "white";
            ctx.fillText(this.num, W - 100, top + 100);
        },
        addDude: function () {
            var n = -1;
            while (n < 0 || n == this.num) {
                n = Math.floor((Math.random() * NUMFLOORS) + 1);
            }
            this.dudes.push(newDude([-100,-100], n));
        }
    };
}

var floors = [];

for (var n = 0; n < NUMFLOORS; n++) {
    floors.push(newFloor(getRandomColor(), n));
}
floors[0].addDude();


function drawPoly(ctx, fillStyle, corners) {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    var x = corners[0][0];
    var y = corners[0][1];
    corners.shift();
    ctx.moveTo(x, y);
    for (var i = 0; i < corners.length; i++) {
        x = corners[i][0];
        y = corners[i][1];
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}


window.onload = main();

function main() {
    Game = newGame(document.getElementById("canv"));
    Game.loop = setInterval(function() {
        Game.draw();
        Game.update();
    }, 1000/FPS);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

