const fs = require('fs');

const instructions = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");

let part1inst = new Set();
part1();
part2();

function part1() {
    let accum = 0;
    let pointer = 0;
    //let visited = new Set();
    while(true) {
        if(part1inst.has(pointer)) break;
        part1inst.add(pointer);
        const parsed = instructions[pointer].split(" ");
        const command = parsed[0];
        const val = parseInt(parsed[1], 10);
        switch(command) {
            case "nop":
                pointer++;
                break;
            case "acc":
                pointer++;
                accum += val;
                break;
            case "jmp":
                pointer += val;
                break;
        }
    }
    console.log(accum);
}

//Fix the program so that it terminates normally by changing exactly one jmp (to nop) or nop (to jmp). What is the value of the accumulator after the program terminates?

function part2() {
    let candidates = new Set();
    let done = false;
    let accum = 0;
    while(!done) {
        accum = 0;
        let pointer = 0;
        let changed = false;
        let visited = new Set();

        while(pointer < instructions.length) {
            if(visited.has(pointer)) {
                console.log(`Looping because of ${pointer}`);
                break;   
            }
            visited.add(pointer);
            const parsed = instructions[pointer].split(" ");
            const command = parsed[0];
            const val = parseInt(parsed[1], 10);
            switch(command) {
                case "nop":
                    //would changing this get us onto a new path and have we tried it before?
                    if(!part1inst.has(pointer + val) && !changed && !candidates.has(pointer)) {
                        console.log(`Instruction ${pointer} changed to jmp`);
                        changed = true;
                        candidates.add(pointer);
                        pointer += val;
                    } else pointer++;
                    break;
                case "acc":
                    pointer++;
                    accum += val;
                    break;
                case "jmp":
                    if(!part1inst.has(pointer + 1) && !changed && !candidates.has(pointer)) {
                        console.log(`Instruction ${pointer} changed to nop`);
                        changed = true;
                        candidates.add(pointer);
                        pointer++;
                    } else pointer += val;
                    break;
            }
        }
        if (pointer === instructions.length) done = true;
    }

    console.log(accum);
}
