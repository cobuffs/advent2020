const fs = require('fs');

let rows = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");

const slopes = [[1,1], [3,1], [5,1], [7,1], [1,2]];
let product = 1;
slopes.forEach(slope => {
    let dx = slope[0];
    let dy = slope[1];
    let xcoord = 0;
    let treecount = 0;
    for(var i = 0; i < rows.length;) {
        let row = rows[i];
        if(row.charAt(xcoord % row.length) === '#') treecount++;
        i = i + dy;
        xcoord = xcoord + dx;
    }
    product = product * treecount;
});

console.log(product);