const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let hexcords = new Map();

let origin = buildhex(0,0);
origin.color = "w";
hexcords.set(origin.key, origin);
let xmin=0;
let xmax=0;
let ymin=0;
let ymax=0;

for(var i = 0; i < input.length; i++) {
    //parse this shit manually :(
    let dirs = input[i].split("");
    let tracker = {"x": 0, "y": 0};
    for(var j = 0; j < dirs.length;) {
        let dir = dirs[j];
        if(dir === "s" || dir === "n" ){
            dir += dirs[j+1]
            j = j+2;
        } else {
            j++;
        }
        switch(dir){
            case "e":
                tracker.x++;
                break
            case "se":
                //shoving even rows right
                if(tracker.y % 2 === 0) tracker.x++;
                tracker.y++;
                break;
            case "sw":
                if(tracker.y % 2 !== 0) tracker.x--;
                tracker.y++;
                break;
            case "w":
                tracker.x--;
                break;
            case "nw":
                if(tracker.y % 2 !== 0) tracker.x--;
                tracker.y--;
                break;
            case "ne":
                if(tracker.y % 2 === 0) tracker.x++;
                tracker.y--;
                break;
            default:
                console.log(`uhoh: ${dir}`);
                break;
        }
        //console.log(`Went ${dir} and hit ${tracker.x}, ${tracker.y}`);
        //need to stub out the tiles as we go
    }
    //console.log(`Ended up at ${tracker.x}, ${tracker.y}`);
    if(hexcords.has(tracker.x + "," + tracker.y)){
        //get it and flip it
        let temp = hexcords.get(tracker.x + "," + tracker.y);
        temp.color = temp.color === "w" ? "b" : "w";

    } else {
        let newhex = buildhex(tracker.x, tracker.y);
        hexcords.set(newhex.key, newhex);
    }
    //stub out neighbors
    //stubneighbors(tracker.x, tracker.y, hexcords);
}

//add some border tiles and make sure we have all of them
// for(var i = -10; i <= 10; i++) {
//     for(var j = -10; j <= 10; j++) {
//         let key = i +","+j;
//         if(!hexcords.has(key)) {
//             let tile = buildhex(i,j);
//             tile.color = "w";
//             hexcords.set(tile.key, tile);
//         }
//     }
// }

//now we need to sim 100 days
for(var i = 0; i < 100; i++){
    let newfloor = new Map();
    let additional = [];
    hexcords.forEach((v,k) => {
        let tile = copyhex(v);
        let neighbors = getneighbors(tile.x,tile.y);
        let bc = 0;
        for(var j = 0; j < neighbors.length; j++) {
            if(hexcords.has(neighbors[j])) {
                let temp = hexcords.get(neighbors[j]);
                bc += temp.color === "b" ? 1 : 0;
            }
            else {
                if(tile.color === "b") additional.push(neighbors[j]);
            }
        }
        if(tile.color === "w" && bc === 2) {
            tile.color = "b";
        }
        else if(tile.color === "b" && (bc === 0 || bc > 2)) {
            tile.color = "w";
        }
        newfloor.set(tile.key,tile);
    });
    //process additional
    while(additional.length > 0) {
        let tk = additional.pop();
        if(!newfloor.has(tk)) {
            let coords = tk.split(",");
            let xp = parseInt(coords[0],10);
            let yp = parseInt(coords[1],10);
            let tile = buildhex(xp,yp);
            tile.color = "w";
            let neighbors = getneighbors(tile.x,tile.y);
            let bc = 0;
            for(var j = 0; j < neighbors.length; j++) {
                if(hexcords.has(neighbors[j])) {
                    let temp = hexcords.get(neighbors[j]);
                    bc += temp.color === "b" ? 1 : 0;
                }
            }
            if(bc === 2) {
                tile.color = "b";
            }
            newfloor.set(tile.key,tile);
        }
    }
    
    hexcords = newfloor;
    console.log(`Day ${i+1}: ${countblacks(hexcords)}`);

}

//how many are black?


function getneighbors(x,y) {
    let neighbors = [];
    //e
    neighbors.push((x + 1) + "," + y);
    //se
    neighbors.push((y%2 === 0 ? x + 1 : x) + "," + (y+1));
    //sw
    neighbors.push((y%2 !== 0 ? x - 1 : x) + "," + (y+1));
    //w
    neighbors.push((x - 1) + "," + y);
    //nw
    neighbors.push((y%2 !== 0 ? x - 1 : x) + "," + (y-1));
    //ne
    neighbors.push((y%2 === 0 ? x + 1 : x) + "," + (y-1));
    return neighbors;
}

function countblacks(hexes){
    let sum = 0;
    hexes.forEach((v,k) => {
        sum += v.color === "b" ? 1 : 0;
    });
    return sum;
}

function stubneighbors(x,y,dest) {
    let neighbors = getneighbors(x,y);

    for(var i = 0; i < neighbors.length; i++) {
        if(!hexcords.has(neighbors[i])) {
            let coords = neighbors[i].split(",");
            
            let xp = parseInt(coords[0],10);
            let yp = parseInt(coords[1],10);
            let newhex = buildhex(xp, yp);
            newhex.color = "w";
            dest.set(newhex.key, newhex);
            if(xmin > xp) xmin = xp;
            if(xmax < xp) xmax = xp;
            if(ymin > yp) ymin = yp;
            if(ymax < yp) ymax = yp;
        }
    }
}

function copyhex(hex) {
    return {
        "key":hex.key,
        "color":hex.color,
        "x":hex.x,
        "y":hex.y
    };
}

function buildhex(x,y) {
    return {
        "key":x + "," + y,
        "color":"b",
        "x":x,
        "y":y
    }
}
