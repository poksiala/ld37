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

function main() {
    var c=document.getElementById("canv");
    var ctx=c.getContext("2d");
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
    var leftDoor = [DUL, DUM, DLM, DLL];
    var rightDoor = [DUR, DUM, DLM, DLR];
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

window.onload = main();

