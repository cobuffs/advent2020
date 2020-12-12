const fs = require('fs');

const navs = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");

let pointstraveled = new Set();
part2();

function part1() {
    let x = 0;
    let y = 0;
    let directions = ["N", "E", "S", "W"];
    let curdir = 1;
    navs.forEach(nav => {
        let inst = nav.substr(0,1);
        let mag = parseInt(nav.substr(1),10);
        if (inst === "F") inst = directions[curdir];
        switch(inst) {
            case "N":
                y = y + mag;
                break;
            case "S":
                y = y - mag;
                break;
            case "E":
                x = x + mag;
                break;
            case "W":
                x = x - mag;
                break;
            case "L":
                curdir = (4 + (curdir + (mag/90 * -1))) % 4;
                break;
            case "R":
                curdir = (curdir + mag/90) % 4;
                break;
        }
        pointstraveled.add(`${inst}${mag}: ${x}, ${y}`);
    });
    console.log(Math.abs(x) + Math.abs(y));
    //console.log(pointstraveled);
}

function part2() {
    let shipx = 0;
    let shipy = 0;
    let waymagx = 10;
    let waymagy = 1;
    navs.forEach(nav => {
        let inst = nav.substr(0,1);
        let mag = parseInt(nav.substr(1),10);
        let newdir = null;
        switch(inst) {
            case "F":
                //if F, move the ship by the waypoint that many times
                shipx = shipx + (waymagx * mag);
                shipy = shipy + (waymagy * mag);
                break;
            case "N":
                waymagy = waymagy + mag;
                break;
            case "S":
                waymagy = waymagy - mag;
                break;
            case "E":
                waymagx = waymagx + mag;
                break;
            case "W":
                waymagx = waymagx - mag;
                break;
            default:
                let newmags = rotate(waymagx, waymagy, mag * (inst === "L" ? -1 : 1) );
                waymagx = newmags[0];
                waymagy = newmags[1];
                break;
        }
        pointstraveled.add(`${inst}${mag}: ${shipx}, ${shipy} - waypoint: ${waymagx}, ${waymagy}`);
    });
    console.log(Math.abs(shipx) + Math.abs(shipy));
    //console.log(pointstraveled);
}

function rotate(x, y, angle) {
    let rads = angle * (Math.PI / 180);
    let cos = Math.cos(rads);
    let sin = Math.sin(rads);
    let nx = (cos * x) + (sin * y);
    let ny = (cos * y) - (sin * x);
    return [Math.round(nx), Math.round(ny)];
}