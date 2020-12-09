const fs = require('fs');

let outputs = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
const batchsize = 25;

//convert to numbers
outputs = outputs.map(Number);

//retain the original list for p2
let outputcopy = outputs.map((x) => x);

//can we exploit something related to the binomial coefficent (nCk)? pascals triangle?

//set up initial preamble
let batch = outputs.splice(0,batchsize);
let sum = 0

while(outputs.length > 1) {
    let result = ncksums(batch, 2);
    let set = result.sums;
    let numtocheck = outputs.shift();

    if(!set.has(numtocheck)) {
        console.log(`${numtocheck} is not valid`);
        sum = numtocheck;
        break;
    }
    //remove the first number of the set. add numtocheck to back
    batch = result.og;
    batch.shift();
    batch.push(numtocheck);
    
}

console.log(part2(sum));

//p2
//keep building sets of numbers to check until the sum of those numbers is > sum. if it is, restart

function part2(sumtofind) {
    let startingindex = 0;
    let possiblebatch = [];
    let index = 0;
    let sum = 0;

    while(true){
        let val = outputcopy[index++];
        sum += val;
        possiblebatch.push(val);
        if (sum === sumtofind) {
            //found our answer
            //need to add together the smallest and the largest number
            //sort the array
            possiblebatch.sort((a,b) => a - b);
            console.log(`Smallest: ${possiblebatch[0]}, largest: ${possiblebatch[possiblebatch.length - 1]}`);
            return possiblebatch[0] + possiblebatch[possiblebatch.length - 1];
        } else if (sum > sumtofind) {
            //reset
            possiblebatch = [];
            index = ++startingindex;
            sum = 0;
        } 
    }
}

function ncksums(possibles, k) {
    let archive = [];
    let sums = new Set();
    let runs = 0;

    while(possibles.length > 1) {
        let worker = possibles.shift();
        archive.push(worker);
        for(var i = 0; i < possibles.length; i++) {
            sums.add(worker + possibles[i]);
            runs++;
        }
    }
    archive.push(possibles.shift());
    return {"sums":sums,"og":archive};
}
