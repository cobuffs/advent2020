const fs = require('fs');

const passes = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
//128 rows
//8 seats

//build plane
let seats = new Map();
let seatarr = [];

for(let i = 0; i < 128; i++){
    let row = [];
    for(let j = 0; j < 8; j++){
        let id = (i*8)+j;
        let seat = {"row":i, "col":j, "id":id, "occupied": false, "key":null};
        row.push(seat);
    }
    seatarr.push(row);
}

let maxseat = {"id":0};

passes.forEach(pass => {

    //convert to binary
    let row = pass.slice(0,7);
    row = row.replace(/B/g, 1);
    row = row.replace(/F/g, 0);
    row = parseInt(row, 2);

    let col = pass.slice(7);
    col = col.replace(/R/g, 1);
    col = col.replace(/L/g, 0);
    col = parseInt(col, 2);

    let seat = seatarr[row][col];

    seat.occupied = true
    seat.key = pass;
    seats.set(seat.id, seat);

    if(seat.id > maxseat.id) maxseat = seat;

});

//find unoccupied seat
let myseat = findmyseat();
console.log(myseat);

function findmyseat() {
    for(let i = 0; i < 128; i++){
        for(let j = 0; j < 8; j++){
            let seat = seatarr[i][j];
            if(!seat.occupied) {
                //check the next id
                if(seats.has(seat.id+1) && seats.has(seat.id-1)) return seat;
            }
        }
    }
}