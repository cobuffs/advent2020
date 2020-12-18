const fs = require('fs');

const inputs = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

for(var i = 0; i < inputs.length; i++) {
    inputs[i] = inputs[i].replace(/\s+/g,'');
}
let sum = 0;
for(var i = 0; i < inputs.length; i++) {
    let eq = inputs[i].split("");
    while(eq.indexOf("(") !== -1) {
        //find the first closing paran, walk backwards
        let fcindex = eq.indexOf(")");
        let openindex = fcindex;
        while(eq[openindex] !== "(") {
            openindex--;
        }
        let expression = eq.splice(openindex,fcindex-openindex+1);

        //do the math and put it back
        let val = 0;
        //clear the parans
        expression.pop();
        expression.shift();
        while(expression.length > 1) {
            let equation = expression[0] + expression[1] + expression[2];
            expression.splice(0,3,eval(equation).toString(10));
        }
        eq.splice(openindex,0,expression[0]);

    }
    while(eq.length > 1) {
        let equation = eq[0] + eq[1] + eq[2];
        eq.splice(0,3,eval(equation).toString(10));
    }
    sum += parseInt(eq[0],10);
}

console.log(sum);