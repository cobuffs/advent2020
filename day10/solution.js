const fs = require('fs');

let outputs = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
outputs = outputs.map(Number);
outputs.sort((a,b) => a - b);
outputs.push(outputs[outputs.length-1] + 3);
outputs.unshift(0);

let prev = 0;
let next = 1;

let diff3 = 0;
let diff1 = 0;

while(next < outputs.length) {
    let val1 = outputs[prev];
    let val2 = outputs[next];

    if(val2-val1 === 1) diff1++;
    else if(val2-val1 === 3) diff3++;
    else {
        console.log(`diff of 2? prev: ${val1} next: ${val2}`);
    }

    prev = next;
    next++;
}

console.log(diff3*diff1);

//part 2
//how many branches come off of each element?
let root = 0;
let branchcounts = [];

while(root < outputs.length - 1) {
    let pointer = root + 1;
    let val1 = outputs[root];
    let val2 = outputs[pointer];
    let possiblepaths = 0;

    while (pointer < outputs.length && (val2 - val1) < 4) {
        possiblepaths++;
        pointer++;
        val2 = outputs[pointer];
    }
    branchcounts.push(possiblepaths);
    root++;
}

//find all the 3 3 2 1s
//find all 3 2 1s
//find all 2 1s
//everywhere we see 3 3 2 1 - multiply by 7
//                  3 2 1   - multiply by 4
//                  2 1     - multiply by 2

let sevens = 0;
let fours = 0;
let twos = 0;
for(var i = 0; i < branchcounts.length;) {
    // look for the patterns
    let branches = branchcounts[i];
    if (branches === 3) {
        //check if the next one is 3 or 2
        let nextb = i+1;
        if (branchcounts[nextb] === 3) {
            sevens++;
            i += 3;
        } else {
            fours++;
            i += 2;
        }
    } else if (branches === 2) {
        twos++;
        i++;
    } else i++;
}
console.log(`3321: ${sevens}, 321: ${fours}, 21: ${twos} - sum: ${Math.pow(7, sevens) * Math.pow(4,fours) * Math.pow(2,twos)} `);


console.log(outputs);
console.log(branchcounts);

//  2  7  2  7  2  7  7  7  7  7  4 2 7 7 7 4 7 7 7

//13 7s
//4 2s
//2 4s
//7^13 * 4^2 * 2^4