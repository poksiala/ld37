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

var DSTATUS = 1.00;
var DMOVING = 0;
var DSPEED = 0.05;

var PLACES = [[50, 490],[100, 470],[150, 490],[200, 470],[250, 490],[300, 470],[350, 490]];

var dudes = [];

for (var i=0; i < PLACES.length; i++) {
    dudes.push(newDude(PLACES[i], 1));
}

function drawDudes(ctx) {
    for (var i=0; i < dudes.length; i++) {
        dudes[i].draw(ctx);
    }

}

function main() {
    var c=document.getElementById("canv");
    var ctx=c.getContext("2d");
    var loop = setInterval(function() {
        draw(ctx);
        update();
    }, 1000/FPS);
}

function update() {
    DSTATUS += DMOVING* DSPEED;
    if (DSTATUS <= 0.0 ) {
        DSTATUS = 0.0;
        DMOVING = 0;
    }
    if (DSTATUS >= 1.0) {
        DSTATUS = 1.0;
        DMOVING = 0;
    }
}

function draw(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.fillStyle = "red";
    ctx.fill();
    floors.forEach(function (f) {f.draw(ctx)});
    drawWalls(ctx);
    drawDoors(ctx);
    dudes.forEach(function (d) {d.draw(ctx)});

}

function drawWalls(ctx) {
    var ceiling = [UL,UR,DUR,DUL];
    var leftWall = [UL, DUL, DLL, LL];
    var floor = [LL, DLL, DLR, LR];
    var rightWall = [UR, DUR, DLR, LR];
    drawPoly(ctx, "#BBBCBD", ceiling);
    drawPoly(ctx, "#4F1319", floor);
    drawPoly(ctx, "#4F4D4E", rightWall);
    drawPoly(ctx, "#4F4D4E", leftWall);
}

function drawDoors(ctx) {
    var leftDoor = [DUL,
        [M+ DW * DSTATUS, M],
        [M+ DW * DSTATUS, H-M],
        DLL];
    var rightDoor = [DUR,
        [W - M - DW * DSTATUS, M],
        [W - M - DW * DSTATUS, H-M],
        DLR];
    drawPoly(ctx, "#636062", leftDoor);
    drawPoly(ctx, "#636062", rightDoor);
}

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

function changeSpeed(amount) {
    if (Math.abs(SPEED + amount) <= 3) {
        SPEED += amount
    }
}

window.addEventListener('keydown', function(event) {
    switch (event.keyCode) {

        case 38: // Up
            changeSpeed(1);
            break;

        case 40: // Down
            changeSpeed(-1);
            break;

        case 32: // Space
            if (doorsOpen()) {
                DMOVING = 1;
            } else if (doorsClosed()) {
                DMOVING = -1;
            } else {
                DMOVING = DMOVING * (-1);
            }
            break;
    }
}, false);


function doorsOpen() {
    return DSTATUS == 0.0;
}
function doorsClosed() {
    return DSTATUS == 1.0;
}

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
        draw: function (ctx) {
            // head
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.arc(this.x, this.y - this.legH - this.bodyH - this.headR/2, this.headR, 0, Math.PI * 2, true);
            ctx.fill();

            ctx.beginPath();
            // body
            ctx.moveTo(this.x, this.y - this.legH);
            ctx.lineTo(this.x, this.y - this.legH - this.bodyH);
            // arms
            ctx.moveTo(this.x - this.armW, this.y - this.legH);
            ctx.lineTo(this.x, this.y - this.legH - this.armH);
            ctx.lineTo(this.x + this.armW, this.y - this.legH);
            // legs
            ctx.moveTo(this.x - this.legW, this.y);
            ctx.lineTo(this.x, this.y - this.legH);
            ctx.lineTo(this.x + this.legW, this.y);
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

function newFloor(color) {
    floor = {
        color: color,
        draw: function (ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, W, H);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };
    return floor;
}

var floors = [
    newFloor("blue"),
    newFloor("red"),
    newFloor("green")
];





window.onload = main();
