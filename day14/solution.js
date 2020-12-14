const fs = require('fs');

const inputs = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");

let activemask = [];
let memory = new Map();

inputs.forEach(line => {
    line = line.split(" = ");
    if(line[0] === "mask") {
        activemask = line[1].split("");
    } else {
        let loc = parseInt(line[0].substr(4),10);
        let val = parseInt(line[1],10);
        writetomem(loc, val, activemask);
    }
});

let sum = 0;
memory.forEach((v,k) => { 
    //let binrep = v.join("");
    sum += parseInt(v,10);
});

console.log(sum);


function writetomem(loc, val, mask) {
    let binloc = loc.toString(2).split("");
    //fill the front with 0s
    while (binloc.length !== 36) {
        binloc.unshift("0");
    }
    let floatingindexes = [];
    for(var i = mask.length - 1; i >= 0; i--) {
        if(mask[i] === "X") floatingindexes.push(i);
        else if (mask[i] === "1") binloc[i] = "1";
    }
    //apply floating indexes
    let memorylocs = [];

    //add the all 0 use case
    for(var i = 0; i < floatingindexes.length; i ++) {
        binloc[floatingindexes[i]] = "0";
    }
    memorylocs.push(binloc.join(""));
    memory.set(binloc.join(""), val);

    for(var i = 0; i < floatingindexes.length; i ++) {
        let index = floatingindexes[i];
        //flip it to 1 for all the memory numbers
        let updateforloc = [];
        for(var j = 0; j < memorylocs.length; j++) {
            //update to 1 in all the memorylocs
            let memoryloc = memorylocs[j].split("");
            memoryloc[floatingindexes[i]] = "1";
            updateforloc.push(memoryloc.join(""));
            memory.set(memoryloc.join(""), val);
    //        console.log(memoryloc.join(""));
        }
        memorylocs = memorylocs.concat(updateforloc);
    }
    //console.log(binloc);
}

function applymasktonum(mask, num) {
    let binnum = num.toString(2).split("");
    //fill the front with 0s
    while (binnum.length !== 36) {
        binnum.unshift("0");
    }
    let maskindexes = [];
    let floatingindexes = [];
    for(var i = mask.length - 1; i >= 0; i--) {
        if(mask[i] !== "X") maskindexes.push(i);
        else floatingindexes.push(i);
    }
    for(var i = 0; i < maskindexes.length; i++) {
        let index = maskindexes[i];
        let value = mask[index];
        binnum[index] = value;
    }

    //apply floating indexes

    return binnum;

}