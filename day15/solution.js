let numbers = [2,15,0,9,1,20];
//let numbers = [0,3,6];
let numrounds = 30000000;
let spoken = new Map();

//track rounds that each number is spoken
for(var i = 0; i < numbers.length; i++) {
    spoken.set(numbers[i], [i+1]);
}

let lastspoken = numbers[numbers.length - 1];

for(var round = numbers.length+1; round <= numrounds; round++) {
    //number to consider
    let number = spoken.get(lastspoken);
    if(number.length === 1) {
        //that was the first time the number was spoken, say 0
        let zero = spoken.get(0);
        zero.push(round);
        lastspoken = 0;
    } else {
        let candidatenum = spoken.get(lastspoken);
        // how many turns apart the number is from when it was previously spoken.
        let diff = candidatenum[candidatenum.length - 1] - candidatenum[candidatenum.length - 2];
        //speak it
        lastspoken = diff;
        //add it
        if(spoken.has(lastspoken)) {
            let spokeninrounds = spoken.get(lastspoken);
            spokeninrounds.push(round);
        } else {
            spoken.set(lastspoken, [round]);
        }
    }
}
console.log(`${lastspoken}`);
