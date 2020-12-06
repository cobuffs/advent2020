const fs = require('fs');

const rows = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");
let groups = [];
let questions = new Map();
let qsum = 0;

let group = getgroup();
groups.push(group);
let id = 0;
group.id = id++;
for(let i = 0; i < rows.length; i++) {
    //build the group
    if(rows[i] === "") {
        let nextid = id++;
        group = getgroup();
        groups.push(group);
        group.id = nextid;
    } else {
        //new passenger
        let passenger = getpassenger();
        passenger.groupid = group.id;
        passenger.yquestions = rows[i].split("");
        for(let j = 0; j < passenger.yquestions.length; j++) {
            if(!group.questions.has(passenger.yquestions[j])) {
                group.questions.set(passenger.yquestions[j], new Array(passenger));
                group.sum++;
                qsum++;
            }
            else {
                let entry = group.questions.get(passenger.yquestions[j]);
                entry.push(passenger);
            }
        }

        group.passengers.push(passenger);
    }
}

console.log(qsum);

//part 2 - for each group, find the sum of the questions for which everyone in the group answered yes
let q2sum = 0;
groups.forEach(group => {
    let groupn = group.passengers.length;
    group.questions.forEach((v,k) => {
        if(v.length === groupn) q2sum++;
    });
});

console.log(q2sum);

function getpassenger() {
    return {
        "yquestions":[], 
        "groupid":null
    };
}

function getgroup() {
    return {
        "id":null,
        "passengers": [],
        "questions": new Map(),
        "sum":0
    }
}