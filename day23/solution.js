//const input = "389125467".split("");
const input = "925176834".split("");

let cups = new Map();
let currentcup = buildcup(input[0]);
let firstcup = currentcup;
cups.set(input[0], firstcup);
for(var i = 1; i < input.length; i++) {
    let cup = buildcup(input[i]);
    cups.set(input[i], cup);
    currentcup.next = cup;
    currentcup = currentcup.next;
}
for(var i = 10; i <= 1000000; i++) {
    let cup = buildcup(i.toString(10));
    cups.set(i.toString(10), cup);
    currentcup.next = cup;
    currentcup = currentcup.next;
}
currentcup.next = firstcup;

part1(10000000);


function buildcup(label) {
    return {"label": label,"next":null, "num": parseInt(label,10), "incircle": true};
}

function part1(moves) {
    let currentcup = cups.get(input[0]);
    for(var i = 0; i < moves; i++) {
        //pick up the next 3
        let cup1 = currentcup.next;
        cup1.incircle = false;
        let cup2 = cup1.next
        cup2.incircle = false;
        let cup3 = cup2.next;
        cup3.incircle = false;
        currentcup.next = cup3.next;

        //go through all the cups and look for the one with a lower label
        let destination = null;
        let label = currentcup.num - 1;
            
        while(destination === null) {
            if(label === 0) label = 1000000;
            if(cups.get(label.toString(10)).incircle) destination = cups.get(label.toString(10));
            else {
                label--;
            }
        }
        //put them back
        cup1.incircle = true;
        cup2.incircle = true;
        cup3.incircle = true;
        cup3.next = destination.next;
        destination.next = cup1;
        currentcup = currentcup.next;
    }
    //start with the 1
    let out = "";
    currentcup = cups.get("1").next;
    let sum = currentcup.num * currentcup.next.num;
    console.log(sum);
}