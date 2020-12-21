const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let tiles = new Map();
let alltiles = [];
let allset = new Set();
let edges = new Map();

//read the edges and look for uniqueness. possible that the 4 with 2 unique edges are our corners?
for(var i = 0; i < input.length; i = i+12) {
    //get the id
    let id = parseInt(input[i].substr(5,4),10);
    let grid = [];
    for(var j = i+1; j < i+11; j++) {
        grid.push(input[j]);
    }
    let gedges = getedgepossibilities(grid);
    for(var e = 0; e < gedges.length; e++) {
        if(edges.has(gedges[e])){
            let ed = edges.get(gedges[e]);
            ed.tiles.push(id);
            ed.count++;
        } else {
            edges.set(gedges[e],{"tiles":[id], "count": 1});
        }
    }
    tiles.set(id, {"possibleedges":gedges, "id": id, "grid": grid});
    alltiles.push(id);
}
let edgec = new Map();
edges.forEach((v,k) => {
    if(v.count === 1) {
        //console.log(`possible edge piece ${v.tiles[0]}`);
        if(edgec.has(v.tiles[0])) {
            let c = edgec.get(v.tiles[0]);
            c.count++;
        } else {
            edgec.set(v.tiles[0], {"count":1});
        }
    }
});

let sum = 1;
let corners = [];
edgec.forEach((v,k) => {
    if(v.count === 4) {
        sum *= k;
        corners.push(k);
    }
});
//now we need to assemble the picture
let picture = [[]];
let processedpic = [[]];
//pick a corner to start with - doesnt matter which one. its going to be our upper left
let piece = tiles.get(corners[2]);

//try to orient it so that we can go left to right, top to bottom
piece.finalform = rotategrid(piece.grid,180);
piece.finaledges = getfinaledges(piece);
picture[0].push(piece);
processedpic[0].push(stripborders(piece.finalform));
if(allset.has(piece.id)) {
    console.log(`${piece.id} already in set`);
}
allset.add(piece.id);

//just build the top row for now
for(var i = 1; i < 12; i++){
    if(piece.finaledges.redges.length !== 1) {
        console.log("uhoh");
    } else {
        let nextpiece = tiles.get(piece.finaledges.redges[0]);
        nextpiece.finalform = matchgridtoedge(nextpiece.grid, piece.finaledges.redge, "L");
        nextpiece.finaledges = getfinaledges(nextpiece);
        picture[0].push(nextpiece);
        processedpic[0].push(stripborders(nextpiece.finalform));
        if(allset.has(nextpiece.id)) {
            console.log(`${nextpiece.id} already in set`);
        }
        allset.add(nextpiece.id);
        piece = nextpiece;
    }
}

//do the rest i guess
for(var i = 1; i < 12; i++) {
    picture.push([]);
    processedpic.push([]);
    let piece = picture[i-1][0];
    for(var j = 0; j < 12; j++) {
        if(j === 0) {
            //need to look above us for the piece
            if(piece.finaledges.bedges.length !== 1) {
                console.log("uhoh");
            }
            let nextpiece = tiles.get(piece.finaledges.bedges[0]);
            nextpiece.finalform = matchgridtoedge(nextpiece.grid, piece.finaledges.bedge, "T");
            nextpiece.finaledges = getfinaledges(nextpiece);
            picture[i].push(nextpiece);
            processedpic[i].push(stripborders(nextpiece.finalform));
            if(allset.has(nextpiece.id)) {
                console.log(`${nextpiece.id} already in set`);
            }
            allset.add(nextpiece.id);
        } else {
            piece = picture[i][j-1];
            if(piece.finaledges.redges.length !== 1) {
                console.log("uhoh");
            }
            let nextpiece = tiles.get(piece.finaledges.redges[0]);
            nextpiece.finalform = matchgridtoedge(nextpiece.grid, piece.finaledges.redge, "L");
            nextpiece.finaledges = getfinaledges(nextpiece);
            picture[i].push(nextpiece);
            processedpic[i].push(stripborders(nextpiece.finalform));
            if(allset.has(nextpiece.id)) {
                console.log(`${nextpiece.id} already in set`);
            }
            allset.add(nextpiece.id);
        }
    }
}

processedpic = flattenpic(processedpic);
findthemonster(processedpic);
// processedpic = rotategrid(processedpic,90);
// findthemonster(processedpic);
// processedpic = rotategrid(processedpic,180);
// findthemonster(processedpic);
// processedpic = rotategrid(processedpic,270);
// findthemonster(processedpic);
//processedpic = flipgrid(processedpic);
// findthemonster(processedpic);
// processedpic = rotategrid(processedpic,90);
// findthemonster(processedpic);
// processedpic = rotategrid(processedpic,180);
// findthemonster(processedpic);
//processedpic = rotategrid(processedpic,270);
//findthemonster(processedpic);

function flattenpic(pic) {
    let newpic = [];
    for(var i = 0; i < pic.length; i++) {
        //get each row from each array
        for(var k = 0; k < 8; k++) {
            let row = "";
            for(var j = 0; j < pic[i].length; j++) {
                row += pic[i][j][k]
            }
            newpic.push(row);
        }
    }
    return newpic;
}

function getfinaledges(piece) {
    let tedge = piece.finalform[0];
    let redge = "";
    let bedge = piece.finalform[9];
    let ledge = "";
    for(var i = 0; i < piece.finalform.length; i++) {
        redge += piece.finalform[i].substr(9,1);
        ledge += piece.finalform[i].substr(0,1);
    }
    let tedges = edges.get(tedge).tiles;
    tedges.splice(tedges.indexOf(piece.id),1);
    let redges = edges.get(redge).tiles;
    redges.splice(redges.indexOf(piece.id),1);
    let bedges = edges.get(bedge).tiles;
    bedges.splice(bedges.indexOf(piece.id),1);
    let ledges = edges.get(ledge).tiles;
    ledges.splice(ledges.indexOf(piece.id),1);
    return {"ledge":ledge,"redge":redge,"bedge":bedge,"tedge":tedge,"ledges":ledges,"redges":redges,"bedges":bedges,"tedges":tedges};
}

function stripborders(grid) {
    let newgrid = [];
    for(var i = 1; i < grid.length-1; i++) {
        newgrid.push(grid[i].substr(1,8));
    }
    return newgrid;
}

function findthemonster(grid) {
    let headx = /..................#./;
    let bodyx = /#....##....##....###/g;
    let feetx = /.#..#..#..#..#..#.../;
    let wavecount = 0;
    let monsterfound = false;
    let monstercount = 0;
    //might need to flip it and reverse it
    for(var i = 1; i < grid.length-1; i++) {
        //wavecount += (grid[i].match(/#/g) || []).length

        //look for a body
        let bodarray = [...grid[i].matchAll(bodyx)];
        //look for head and feet
        for(var j = 0; j < bodarray.length; j++) {
            //check the previous row starting at the same index
            let headstr = grid[i-1].substr(bodarray[j].index, 20);
            let feetstr = grid[i+1].substr(bodarray[j].index, 20);
            if(headx.test(headstr) && feetx.test(feetstr)) {
                console.log(`Found a moster at row ${i} index ${bodarray[j].index}!`);
                monstercount++;
            }
        }
    }

    for(var i = 0; i < grid.length; i++) {
        let row = grid[i].split("");
        for(var j = 0; j < row.length; j++) {
            if(row[j] === "#") wavecount++;
        }
    }
    console.log(wavecount);
    console.log((monstercount * 15));
    return monsterfound;
}

function matchgridtoedge(grid, edge, dir) {
    //generate all possible shapes
    let possibles = [];
    possibles.push(rotategrid(grid, 90));
    possibles.push(rotategrid(grid, 180));
    possibles.push(rotategrid(grid, 270));
    let flipped = flipgrid(grid);
    possibles.push(flipped);
    possibles.push(rotategrid(flipped, 90));
    possibles.push(rotategrid(flipped, 180));
    possibles.push(rotategrid(flipped, 270));
    let match = [];

    switch(dir) {
        case "T":
            for(var i = 0; i < possibles.length; i++) {
                if(possibles[i][0] === edge) {
                    match = possibles[i];
                    break;
                }
            }
            break;
        case "R":      
            for(var i = 0; i < possibles.length; i++) {
                let matchstr = "";
                for(var j = 0; j < possibles[i].length; j++) {
                    matchstr += possibles[i][j].substr(9,1);
                }
                if(matchstr === edge) {
                    match = possibles[i];
                    break;
                }
            }
            break;
        case "B":
            for(var i = 0; i < possibles.length; i++) {
                if(possibles[i][9] === edge) {
                    match = possibles[i];
                    break;
                }
            }
            break;
        case "L":
            for(var i = 0; i < possibles.length; i++) {
                let matchstr = "";
                for(var j = 0; j < possibles[i].length; j++) {
                    matchstr += possibles[i][j].substr(0,1);
                }
                if(matchstr === edge) {
                    match = possibles[i];
                    break;
                }
            }
            break;
        default:
            console.log("nope");
    }
    return match;
}

function printgrid(grid) {
    let out = "\r\n";
    for(var i = 0; i < grid.length; i++) {
        out += grid[i] + "\r\n";
    }
    console.log(out);
}

function getedgesforpiece(p) {
    let attachments = new Set();
    p.possibleedges.forEach(e => {
        let ptiles = edges.get(e).tiles;
        ptiles.forEach(pt => {
            if(pt !== p.id) attachments.add(pt);
        })
    });
    return attachments;
}

function rotategrid(grid, deg) {
    let dim = grid.length;
    let newgrid = [];
    for(var i = 0; i < grid.length; i++) {
        let row = [];
        for(var j = 0; j < grid[0].length; j++) {
            row.push(" ");
        }
        newgrid.push(row);
    }
    switch (deg) {
        case 90:
            //rows become columns
            for(var i = 0; i < grid.length; i++) {
                grid[i] = grid[i].split("");
                for(var j = 0; j < grid[i].length; j++) {
                    newgrid[j][dim-i-1] = grid[i][j];
                }
                grid[i] = grid[i].join("");
            }
            break;
        case 180:
            //rows get reversed, cols get reversed
            for(var i = 0; i < grid.length; i++) {
                grid[i] = grid[i].split("");
                for(var j = 0; j < grid[i].length; j++) {
                    newgrid[dim-i-1][dim-j-1] = grid[i][j];
                }
                grid[i] = grid[i].join("");
            }
            break;
        case 270:
            //rows become cols
            for(var i = 0; i < grid.length; i++) {
                grid[i] = grid[i].split("");
                for(var j = 0; j < grid[i].length; j++) {
                    newgrid[dim-j-1][i] = grid[i][j];
                }
                grid[i] = grid[i].join("");
            }
            break;
        default:
            console.log("nope");
            break;     
    }
    for(var i = 0; i < newgrid.length;i++){
        newgrid[i] = newgrid[i].join("");
    }
    return newgrid;
}

function flipgrid(grid) {
    let newgrid = [];
    for(var i = 0; i < grid.length; i++) {
        let row = grid[i].split("").reverse().join("");
        newgrid.push(row);
    }
    return newgrid;
}

function getedgepossibilities(grid){
    let edge0 = edge1 = edge2 = edge3 = edge4 = edge5 = edge6 = edge7 = "";
    for(var i = 0; i < grid.length; i++) {
        if(i === 0) edge0 = grid[i];
        if(i === 9) edge3 = grid[i];
        edge1 += grid[i].substr(0,1);
        edge2 += grid[i].substr(9,1);
    }
    edge4 = edge0.split("").reverse().join("");
    edge5 = edge1.split("").reverse().join("");
    edge6 = edge2.split("").reverse().join("");
    edge7 = edge3.split("").reverse().join("");
    return [edge0,edge1,edge2,edge3,edge4,edge5,edge6,edge7];
}
//find edges with a count of 1. those could be our borders. take that set of tiles and see while tiles have 2 such unique edges