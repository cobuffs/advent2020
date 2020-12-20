const fs = require('fs');

const inputs = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n\r\n");

const inrules = inputs[0].split("\r\n");
const inmessages = inputs[1].split("\r\n");
let rules = new Map();


inrules.forEach(inrule => {
    let rule = inrule.split(": ");
    let val = {"id": rule[0], "reg": null};
    if(rule[1].indexOf('"') !== -1) {
        val.reg = " " + rule[1].substr(1,1) + " ";
        rules.set(parseInt(val.id,10), val.reg);
    } else {
        //make sure they are surrounded by spaces
        val.reg = " " + rule[1] + " ";
        rules.set(parseInt(val.id,10), val.reg);
    }

});

//try an arbitrary number of replacements
for(var blah = 0 ; blah < 1; blah++) {
for (var i = 0; i < rules.size; i++){
    let findstr = i.toString(10);
    let rep = " ( " + rules.get(i) + " ) ";
    for (var j = 0; j < rules.size; j++) {
        let chara = rules.get(j).split(" ");
        for(var k = 0; k < chara.length; k++) {
            if(chara[k] === findstr) chara[k] = rep;
        }
        let newstr = chara.join(" ");
        rules.set(j, newstr);
    }
}
}
//remove all whitespace
for (var i = 0; i < rules.size; i++){
    let val = rules.get(i);
    let newstr = val.split(" ").join("");
    newstr = newstr.split("(a)").join("a");
    newstr = newstr.split("(b)").join("b");
    let newx = new RegExp("\^" + newstr + "$");
    //console.log(newx);
    rules.set(i,newx);
}

let zerocount = 0;
let zerox = rules.get(0);
for(var i = 0; i < inmessages.length; i++) {
    let msg = inmessages[i];
    if(zerox.test(msg)) {
        zerocount++;
        //console.log(msg);
    }
}
console.log(zerox);
console.log(zerocount);
