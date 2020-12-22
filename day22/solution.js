const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n\r\n");

let p1 = input[0].split("\r\n");
let p2 = input[1].split("\r\n");
p1.shift();
p2.shift();

p1 = p1.map(Number);
p2 = p2.map(Number);

play(1,p1,p2);

function play(game,p1,p2) {
    let round = 0;
    let p1d = [];
    let p2d = [];
    while (p1.length !== 0 && p2.length !== 0) {
        round++;
        let out = ` -- Round ${round} (Game ${game}) -- \r\n`;
        //Before either player deals a card, if there was a previous round in this game that had exactly the same cards in the same order in the same players' decks, the game instantly ends in a win for player 1. Previous rounds from other games are not considered. (This prevents infinite games of Recursive Combat, which everyone agrees is a bad idea.)
        if(p1d.indexOf(p1.join(",")) > -1 || p2d.indexOf(p2.join(",")) > -1) return 0;
        let p1c = p1[0];
        let p2c = p2[0];
        out += `Player 1's deck: ${p1.join(",")}\r\n`;
        out += `Player 2's deck: ${p2.join(",")}\r\n`;
        //If both players have at least as many cards remaining in their deck as the value of the card they just drew, the winner of the round is determined by playing a new game of Recursive Combat (see below)
        //draw a card
        out += `Player 1 plays ${p1c}\r\n`;
        out += `Player 2 plays ${p2c}\r\n`;
        //console.log(out);
        if(p1.length > p1c && p2.length > p2c) {
            let winner = play(++game,[...p1].splice(1,p1c),[...p2].splice(1,p2c));
            if(winner === 0) {
                p1.push(p1c);
                p1.push(p2c);
            } else {
                p2.push(p2c);
                p2.push(p1c);
            }
        }
        else {
            if(p1c > p2c) {
                p1.push(p1c);
                p1.push(p2c);
            } else {
                p2.push(p2c);
                p2.push(p1c);
            }
        }
        p1d.push(p1.join(","));
        p2d.push(p2.join(","));
        p1.shift();
        p2.shift();
    }
    return p1.length > 0 ? 0 : 1;
}

let winner = p1.length > 0 ? p1 : p2;
let sum = 0;
for (var i = 0; i < winner.length; i++) {
    sum += ((winner.length - i) * winner[i]);
}
console.log(sum);