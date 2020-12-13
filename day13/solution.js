const fs = require('fs');

const inputs = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
let busarr = inputs[1].split(",");

let buses = new Map();
let busesa = [];
let depaturetime = parseInt(inputs[0],10);
let offset = 0;
let offsets = [];

busarr.forEach(buse => {
    if (buse !== "x") {
        let bus = {
            "id":parseInt(buse,10)
        };
        buses.set(bus.id, bus);
        busesa.push(bus.id);
        offsets.push(offset);
    }
    offset++;
});
let sortedbuses = busesa.slice();
sortedbuses.sort((a,b) => {return b-a;});
// console.log(sortedbuses);
// console.log(busesa);
// console.log(offsets);
//part 1
//find the first bus that can leave
// let trackdep = depaturetime;
// let found = false;
// while(!found){
//     for(var i = 0; i < busesa.length && !found; i++){
//         let busid = busesa[i];
//         if(trackdep % busid === 0){
//             found = true;
//             console.log(`Minutes to wait: ${trackdep - depaturetime} for bus ${busid}. Answer is ${(trackdep - depaturetime) * busid}`);
//         }
//     }
//     trackdep++;
// }


//start with the bigest number
let found = false;
let num = sortedbuses.shift();
let count = num;
let offsetfornum = offsets[busesa.indexOf(num)];
while(!found) {
    let actualts = count - offsetfornum;
    //console.log(`checking ${actualts}`);
    for(var i = 0; i < sortedbuses.length; i++) {
        let bustocheck = sortedbuses[i];
        let offsetofbtc = offsets[busesa.indexOf(bustocheck)];
        if(!((actualts + offsetofbtc) % bustocheck === 0)) break;
        //else console.log(`Deeper with ${actualts}`);
        if(i === sortedbuses.length - 1) {
            console.log(`maybe done? ${actualts}`);
            found = true;
        }
    }
    count += num;
}

function remakebuslist() {
    let sortedbuses = busesa.slice();
    sortedbuses.sort((a,b) => {return b-a;});
    return sortedbuses;
}