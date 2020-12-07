const fs = require('fs');

const rows = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
let rules = new Map();

rows.forEach(row => {
    let parse = row.split("contain");
    let color = parse[0].slice(0, parse[0].length - 6);
    let bag = buildbag(color);

    let rules = parse[1].trim().split(", ");
    rules.forEach(rule => {
        if(rule === "no other bags.") return;
        let qty = parseInt(rule.split(" ")[0] ,10);
        let temp = rule.slice(rule.indexOf(" ")).trim();
        let rulec = temp.slice(0, temp.indexOf(" bag"));

        let ruleb = buildrule(qty, rulec);
        bag.contents.push(ruleb);
        ruleb.bag.enclosedin.push(bag);
    });
});


//console.log(rules);
part1("shiny gold");
part2();

function part2() {
    let queue = [];
    let sum = 0;
    let sgbag = rules.get("shiny gold");

    //add the contents of my shiny bag
    for(var i = 0; i < sgbag.contents.length; i++) {
        queue.push({"magnifier": 1, "rule":sgbag.contents[i]});
    }
    
    //process them
    while(queue.length > 0) {
        let worker = queue.shift();
        sum += (worker.rule.qty * worker.magnifier);
        for(var i = 0; i < worker.rule.bag.contents.length; i++) {
            let updatedbag = worker.rule.bag.contents[i];
            queue.push({"magnifier": worker.magnifier * worker.rule.qty, "rule":updatedbag});
        }
    }
    console.log(sum);
}


function part1(colortofind) {
    let queue = [];
    let visited = new Set();
    
    //add all the enclosedin to the queue
    let bag = rules.get(colortofind);
    queue.push(bag);
    //go through them

    while(queue.length > 0) {
        //pop it and add it to the queue
        let bagtocheck = queue.shift();
        for(var i = 0; i < bagtocheck.enclosedin.length; i++) {
            if(!visited.has(bagtocheck.enclosedin[i].color)) queue.push(bagtocheck.enclosedin[i]);
        }
        //add it to the set
        visited.add(bagtocheck.color);
    }

    console.log(visited.size - 1);

}


function buildbag(color) {
    if(rules.has(color)) bag = rules.get(color);
    else {
        bag = {
            "color": color,
            "contents":[],
            "enclosedin":[]
        };
        rules.set(color, bag);
    }
    return bag;
}

function buildrule(qty, color) {
    let bag = null;
    if(rules.has(color)) bag = rules.get(color);
    else bag = buildbag(color);

    return {"qty": qty, "bag": bag};
}