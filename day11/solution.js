const fs = require('fs');

let outputs = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
const grid = [];
outputs.forEach(row => {
    let spaces = row.split("");
    grid.push(spaces);
});

//make 2 copies of the grid
let prevround = makecopy(grid);
let curround = makecopy(grid);

let equilibrium = populateseats(prevround,curround);
console.log(countseats(equilibrium));

function populateseats(prev, cur) {
    // If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    // If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    // Otherwise, the seat's state does not change.
    let changemade = true;
    while(changemade) {
        changemade = false;
        for(var i = 0; i < cur.length; i++){
            for(var j = 0; j < cur[i].length; j++) {
                let space = prev[i][j];
                if(space === ".") continue;
                if(space === "L") {
                    if(shouldsitp2(i,j,prev)) {
                        changemade = true;
                        cur[i][j] = "#";
                    }
                }
                else {
                    if(shouldistandp2(i,j,prev)) {
                        changemade = true;
                        cur[i][j] = "L"
                    }
                }

            }
        }
        prev = makecopy(cur);
        //printgrid(cur);
    }
    return cur;
}

function countseats(ship) {
    let seats = 0;
    for(var i = 0; i < ship.length; i++){
        for(var j = 0; j < ship[i].length; j++) {
            let seat = ship[i][j];
            if(seat === "#") seats++;
        }
    }
    return seats;
}

function makecopy(arr) {
    var newArray = arr.map(function(arre) {
        return arre.slice();
    });
    return newArray;
}

function shouldsit(y,x,grid) {
    let maxx = grid[0].length;
    let maxy = grid.length;
    let occupiedn = 0;
    //check all 8 adjacent squares
    //x,y-1 x,y+1 x-1,y x+1,y, x-1,y-1 x-1,y+1 x+1,y-1 x+1,y+1
    if(y-1 >= 0 && grid[y-1][x] !== ".") grid[y-1][x] === "#" ? occupiedn++ : null;
    if(y+1 < maxy && grid[y+1][x] !== ".") grid[y+1][x] === "#" ? occupiedn++ : null;
    if(x-1 >= 0 && grid[y][x-1] !== ".") grid[y][x-1] === "#" ? occupiedn++ : null;
    if(x+1 < maxx && grid[y][x+1] !== ".") grid[y][x+1] === "#" ? occupiedn++ : null;
    if(x-1 >= 0 && y-1 >= 0 && grid[y-1][x-1] !== ".") grid[y-1][x-1] === "#" ? occupiedn++ : null;
    if(x-1 >= 0 && y+1 < maxy && grid[y+1][x-1] !== ".") grid[y+1][x-1] === "#" ? occupiedn++ : null;
    if(x+1 < maxx && y-1 >= 0 && grid[y-1][x+1] !== ".") grid[y-1][x+1] === "#" ? occupiedn++ : null;
    if(x+1 < maxx && y+1 < maxy && grid[y+1][x+1] !== ".") grid[y+1][x+1] === "#" ? occupiedn++ : null;

    return occupiedn === 0;

}

function shouldistandp2(y,x,grid) {
    let maxx = grid[0].length;
    let maxy = grid.length;
    let occupiedn = 0;
    let workery = y;
    let workerx = x;
    //now for each direction i need to go until i hit a seat or the edge of the ship

    // \ | /
    // - | -
    // / | \

    //NW
    workery = y-1;
    workerx = x-1;
    while (workery >= 0 && workerx >= 0) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery--;
        workerx--;
    }
    
    //N
    workerx = x;
    workery = y-1;
    while (workery >= 0) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery--;
    }
    
    //NE
    workerx = x+1;
    workery = y-1;
    while (workery >= 0 && workerx < maxx) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery--;
        workerx++;
    }

    //E
    workerx = x+1;
    workery = y;
    while (workerx < maxx) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workerx++;
    }

    //SE
    workerx = x+1;
    workery = y+1;
    while (workerx < maxx && workery < maxy) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workerx++;
        workery++;
    }

    //S    
    workerx = x;
    workery = y+1;
    while (workery < maxy) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery++;
    }

    //SW 
    workerx = x-1;
    workery = y+1;
    while (workerx >=0 && workery < maxy) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery++;
        workerx--;
    }

    //W
    workerx = x-1;
    workery = y;
    while (workerx >=0) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workerx--;
    }
    
    return occupiedn > 4;
}

function shouldsitp2(y,x,grid) {
    let maxx = grid[0].length;
    let maxy = grid.length;
    let occupiedn = 0;
    let workery = y;
    let workerx = x;
    //now for each direction i need to go until i hit a seat or the edge of the ship

    // \ | /
    // - | -
    // / | \

    //NW
    workery = y-1;
    workerx = x-1;
    while (workery >= 0 && workerx >= 0) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery--;
        workerx--;
    }
    
    //N
    workerx = x;
    workery = y-1;
    while (workery >= 0) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery--;
    }
    
    //NE
    workerx = x+1;
    workery = y-1;
    while (workery >= 0 && workerx < maxx) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery--;
        workerx++;
    }

    //E
    workerx = x+1;
    workery = y;
    while (workerx < maxx) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workerx++;
    }

    //SE
    workerx = x+1;
    workery = y+1;
    while (workerx < maxx && workery < maxy) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workerx++;
        workery++;
    }

    //S    
    workerx = x;
    workery = y+1;
    while (workery < maxy) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery++;
    }

    //SW 
    workerx = x-1;
    workery = y+1;
    while (workerx >=0 && workery < maxy) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workery++;
        workerx--;
    }

    //W
    workerx = x-1;
    workery = y;
    while (workerx >=0) {
        let space = grid[workery][workerx];
        if (space === "#") {
            occupiedn++;
            break;
        }
        else if (space === "L") break;
        workerx--;
    }
    
    return occupiedn === 0;
}

function shouldstand(y,x,grid){
    let maxx = grid[0].length;
    let maxy = grid.length;
    let occupiedn = 0;
    //check all 8 adjacent squares
    //x,y-1 x,y+1 x-1,y x+1,y, x-1,y-1 x-1,y+1 x+1,y-1 x+1,y+1
    if(y-1 >= 0 && grid[y-1][x] !== ".") grid[y-1][x] === "#" ? occupiedn++ : null;
    if(y+1 < maxy && grid[y+1][x] !== ".") grid[y+1][x] === "#" ? occupiedn++ : null;
    if(x-1 >= 0 && grid[y][x-1] !== ".") grid[y][x-1] === "#" ? occupiedn++ : null;
    if(x+1 < maxx && grid[y][x+1] !== ".") grid[y][x+1] === "#" ? occupiedn++ : null;
    if(x-1 >= 0 && y-1 >= 0 && grid[y-1][x-1] !== ".") grid[y-1][x-1] === "#" ? occupiedn++ : null;
    if(x-1 >= 0 && y+1 < maxy && grid[y+1][x-1] !== ".") grid[y+1][x-1] === "#" ? occupiedn++ : null;
    if(x+1 < maxx && y-1 >= 0 && grid[y-1][x+1] !== ".") grid[y-1][x+1] === "#" ? occupiedn++ : null;
    if(x+1 < maxx && y+1 < maxy && grid[y+1][x+1] !== ".") grid[y+1][x+1] === "#" ? occupiedn++ : null;

    return occupiedn > 3;
}

function printgrid(grid) {
    let seatingchart = "";    
    for(var i = 0; i < grid.length; i++) {
        seatingchart += "\r\n";
        let spaces = grid[i];
        for (var j = 0; j < spaces.length; j++) {
            let cell = spaces[j];
            seatingchart += cell;
        }
    }
    console.log(seatingchart);
}