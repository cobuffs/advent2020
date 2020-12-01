const fs = require('fs');
//let contents = fs.readFileSync("adv01.txt", 'utf8').trim();
var entries = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\n");
let done = false;
//Specifically, they need you to find the two entries that sum to 2020 and then multiply those two numbers together.
for (var i = 0; i < entries.length && !done; i++){
    let entry1 = parseInt(entries[i],10);
    for(var j = i+1; j < entries.length && !done; j++){
        let entry2 = parseInt(entries[j], 10);
        for(var k = j+1; k < entries.length; k++){
            let entry3 = parseInt(entries[k], 10);
            if(entry1 + entry2 + entry3 == 2020){ 
                console.log(entry1 * entry2 * entry3);
                done = true;
                break;
            }
        }
    }
}

console.log('yo');