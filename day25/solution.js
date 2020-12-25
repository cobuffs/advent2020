const fs = require('fs');

 let pub1 = 8987316;
 let pub2 = 14681524

//  let pub1 = 5764801;
//  let pub2 = 17807724;

let numformod = 20201227;
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let loopsize = 8;
let val1 = 1;
let val2 = 1;
let subjectnum = 7
let loop1 = 1;
let loop2 = 1;

while(true) {
    val1 *= subjectnum;
    val1 = val1 % numformod;
    if(val1 === pub1) break;
    loop1++;
}

while(true) {
    val2 *= subjectnum;
    val2 = val2 % numformod;
    if(val2 === pub2) break;
    loop2++;
}
let encyptionkey = 1;
for(var i = 0; i < loop1; i++) {
    encyptionkey *= pub2;
    encyptionkey = encyptionkey % numformod;
}
console.log(`${encyptionkey}`);