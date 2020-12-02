const fs = require('fs');

let entries = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
let validpasswords = 0;
for(var i = 0; i < entries.length; i++){
    //parse it
    let entry = entries[i].split(":");
    let rule = entry[0].split("-");
    let min = parseInt(rule[0],10);
    let secondrule = rule[1].split(" ");
    let max = parseInt(secondrule[0],10);
    let chartocheck = secondrule[1];
    let password = entry[1].trim();
    
    //let countofletter = password.split(chartocheck);
    let allchars = password.split('');
    // if(countofletter.length != 1 && (countofletter.length-1 >= min && countofletter.length-1 <= max)) {
    //     console.log("min %i, max %i, letter: %s, pass %s", min, max, chartocheck, password);
    //     validpasswords++;

    // }

    if((allchars[min-1] === chartocheck && allchars[max-1] !== chartocheck) || (allchars[min-1] !== chartocheck && allchars[max-1] === chartocheck)) validpasswords++;
    
    //else console.log("min %i, max %i, letter: %s, pass %s, count %i", min, max, chartocheck, password, countofletter.length - 1);
}

console.log(validpasswords);