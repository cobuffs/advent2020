const fs = require('fs');

const inputs = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

const active = "#";
const inactive = ".";

const neighbordeltas = [[-1,1,0],[0,1,0],[1,1,0],
                 [-1,0,0],[1,0,0],
                 [-1,-1,0],[0,-1,0],[1,-1,0],
                 [-1,1,1],[0,1,1],[1,1,1],
                 [-1,0,1],[0,0,1],[1,0,1],
                 [-1,-1,1],[0,-1,1],[1,-1,1],
                 [-1,1,-1],[0,1,-1],[1,1,-1],
                 [-1,0,-1],[0,0,-1],[1,0,-1],
                 [-1,-1,-1],[0,-1,-1],[1,-1,-1]];

let initialstate = [];
//initialstate.push(buildemptyslice(inputs.length));
let inputslice = [];           
inputs.forEach(row => {
    let parsed = row.split("");
    inputslice.push(parsed);
});
initialstate.push(inputslice);
//initialstate.push(buildemptyslice(inputs.length));
//getneighbors(2,1,0,initialstate);

part1(initialstate);

function part1(initialstate) {
    let previous = initialstate;
    let numcycles = 6;
    let activecubes = 0;
    for (var i = 0; i < numcycles; i++) {
        //stub out the cycle
        //create all our z-slices (blank)
        activecubes = 0;
        let cycle = []
        cycle.push(buildemptyslice(previous[0].length + 2));
        for(var z = 0; z < previous.length; z++) {
            let slice = buildemptyslice(previous[0].length + 2);
            cycle.push(slice);
            //go through the old state and drop it in new y = old y + 1. new x = old x + 1
            for(var y = 0; y < previous[z].length; y++){
                for(var x = 0; x < previous[z][y].length; x++) {
                    slice[y+1][x+1] = previous[z][y][x];
                }
            }
        }
        cycle.push(buildemptyslice(previous[0].length + 2));

        //make a copy and do the work
        let currentstate = buildcopy(cycle);
        
        for(var z = 0; z < currentstate.length; z++) {
            for(var y = 0; y < currentstate[z].length; y++) {
                for(var x = 0; x < currentstate[z][y].length; x++) {
                    let neighbors = getneighbors(x,y,z,currentstate);
                    let curcube = currentstate[z][y][x];
                    if(curcube === active) {
                        if(neighbors[1] === 2 || neighbors[1] === 3) {
                            cycle[z][y][x] = active;
                            activecubes++;
                        } else {
                            cycle[z][y][x] = inactive;
                        }
                    } else {
                        if(neighbors[1] === 3){
                            cycle[z][y][x] = active;
                            activecubes++;
                        } else cycle[z][y][x] = inactive;
                    }
                }
            }
            //console.log(`Cycle ${i}, slice ${z}`);
            //printslice(cycle[z]);
        }
        previous = buildcopy(cycle);
    }
    console.log(activecubes);
}

function getneighbors(pointx, pointy, pointz, box) {
    let neighbors = [];
    let activecount = 0;
    let inactivecount = 0;
    for(var i = 0; i < neighbordeltas.length; i++) {
        let deltax = neighbordeltas[i][0];
        let deltay = neighbordeltas[i][1];
        let deltaz = neighbordeltas[i][2];
        let cube = box[deltaz + pointz]?.[deltay + pointy]?.[deltax + pointx] || inactive;
        if(cube === active) activecount++;
        else inactivecount++;
        neighbors.push(cube);
    }
    return [neighbors, activecount, inactivecount];
}

function buildcopy(oldarr) {
    let newarr = [];

    for(var z = 0; z < oldarr.length; z++) {
        let slice = [];
        for(var y = 0; y < oldarr[z].length; y++) {
            let row = [];
            for(var x = 0; x < oldarr[z][y].length; x++) {
                let val = oldarr[z][y][x];
                row.push(val);
            }
            slice.push(row);
        }
        newarr.push(slice);
    }
    return newarr;
}

function printslice(slice) {
    let grid = "";    
    for(var i = 0; i < slice.length; i++) {
        grid += "\r\n";
        let spaces = slice[i];
        for (var j = 0; j < spaces.length; j++) {
            let cell = spaces[j];
            grid += cell;
        }
    }
    grid += "\r\n\r\n";
    console.log(grid);
}

function buildemptyslice(dim) {
    let slice = [];
    for(var y = 0; y < dim; y++) {
        let row = [];
        for(var x = 0; x < dim; x++) {
            row.push(inactive);
        }
        slice.push(row);
    }
    return slice;
}