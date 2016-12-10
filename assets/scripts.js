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

function main() {

    var c=document.getElementById("canv");
    var ctx=c.getContext("2d");
    drawWalls(ctx);
};


function drawWalls(ctx) {
    var ceiling = [UL,UR,DUR,DUL];
    var leftWall = [UL, DUL, DLL, LL];
    var floor = [LL, DLL, DLR, LR];
    var rightWall = [UR, DUR, DLR, LR];
    
    drawPoly(ctx, "#AB2567", ceiling);
    drawPoly(ctx, "#AB2567", floor);
    drawPoly(ctx, "#AB2567", leftWall);
    drawPoly(ctx, "#AB2567", rightWall);
};

function drawPoly(ctx, fillstyle, corners) {
    ctx.beginPath();
    var x = corners[0][0];
    var y = corners[0][1];
    corners.shift();
    ctx.moveTo(x, y);
    for (var i = 0; i < corners.length; i++) {
        x = corners[i][0];
        y = corners[i][1];
        ctx.lineTo(x, y);
    };
    ctx.closePath();
    ctx.fill();
};




window.onload = main();

