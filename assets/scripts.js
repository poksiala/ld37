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
var DUM = [W/2, M];
var DLM = [W/2, H-M];

var DW = W/2 - M;

var FPS = 30;

var SPEED = 0;

var DSTATUS = 1.00;

var DMOVING = 0;
var DSPEED = 0.05;

function main() {
    var c=document.getElementById("canv");
    var ctx=c.getContext("2d");
    var loop = setInterval(function() {
        draw(ctx);
        update();
    }, 1000/FPS);
}

function update() {
    console.log(DMOVING);
    DSTATUS += DMOVING* DSPEED;
    if (DSTATUS <= 0.0 ) {
        DSTATUS = 0.0;
        DMOVING = 0;
    }
    if (DSTATUS >= 1.0) {
        DSTATUS = 1.0;
        DMOVING = 0;
    }
    console.log(DSTATUS);
}

function draw(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.fillStyle = "red";
    ctx.fill();
    drawWalls(ctx);
    drawDoors(ctx);

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

        case 32:
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

window.onload = main();

