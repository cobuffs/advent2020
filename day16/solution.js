const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const fs = require('fs');

const rows = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");


// departure location: 44-825 or 849-962
const departurelocck = (num) => {return ((num >= 44 && num <= 825) || (num >= 849 && num <= 962))};
let dlinv = new Set();

// departure station: 26-296 or 316-965
const departurestationck = (num) => {return ((num >= 26 && num <= 296) || (num >= 316 && num <= 965))};
let dsinv = new Set();

// departure platform: 46-889 or 896-949
const departureplatck = (num) => {return ((num >= 46 && num <= 889) || (num >= 896 && num <= 949))};
let dpinv = new Set();

// departure track: 48-351 or 369-960
const departuretrackck = (num) => {return ((num >= 48 && num <= 351) || (num >= 369 && num <= 960))};
let dtinv = new Set();

// departure date: 25-869 or 884-966
const departuredateck = (num) => {return ((num >= 25 && num <= 869) || (num >= 884 && num <= 966))};
let ddinv = new Set();

// departure time: 31-217 or 232-956
const departuretimeck = (num) => {return ((num >= 31 && num <= 217) || (num >= 232 && num <= 956))};
let dttinv = new Set();

// arrival location: 32-559 or 574-967
const arrivallocck = (num) => {return ((num >= 32 && num <= 559) || (num >= 574 && num <= 967))};
let ainv = new Set();

// arrival station: 50-383 or 394-952
const arrivalstationck = (num) => {return ((num >= 50 && num <= 383) || (num >= 394 && num <= 952))};
let asinv = new Set();

// arrival platform: 29-128 or 150-962
const arrivalplatck = (num) => {return ((num >= 29 && num <= 128) || (num >= 150 && num <= 962))};
let apinv = new Set();

// arrival track: 30-630 or 647-957
const arrivaltrackck = (num) => {return ((num >= 30 && num <= 630) || (num >= 647 && num <= 957))};
let atinv = new Set();

// class: 45-262 or 277-966
const classck = (num) => {return ((num >= 45 && num <= 262) || (num >= 277 && num <= 966))};
let cinv = new Set();

// duration: 35-602 or 619-965
const durationck = (num) => {return ((num >= 35 && num <= 602) || (num >= 619 && num <= 965))};
let dinv = new Set();

// price: 41-913 or 926-966
const priceck = (num) => {return ((num >= 41 && num <= 913) || (num >= 926 && num <= 966))};
let pinv = new Set();

// route: 38-191 or 212-950
const routeck = (num) => {return ((num >= 38 && num <= 191) || (num >= 212 && num <= 950))};
let rtinv = new Set();

// row: 25-509 or 523-965
const rowck = (num) => {return ((num >= 25 && num <= 509) || (num >= 523 && num <= 965))};
let rowinv = new Set();

// seat: 39-783 or 802-973
const seatck = (num) => {return ((num >= 39 && num <= 783) || (num >= 802 && num <= 973))};
let sinv = new Set();

// train: 36-64 or 80-969
const trainck = (num) => {return ((num >= 36 && num <= 64) || (num >= 80 && num <= 969))};
let tinv = new Set();

// type: 42-750 or 767-974
const typeck = (num) => {return ((num >= 42 && num <= 750) || (num >= 767 && num <= 974))};
let tyinv = new Set();

// wagon: 29-803 or 821-974
const wagonck = (num) => {return ((num >= 29 && num <= 803) || (num >= 821 && num <= 974))};
let winv = new Set();

// zone: 47-659 or 672-968
const zoneck = (num) => {return ((num >= 47 && num <= 659) || (num >= 672 && num <= 968))};
let zinv = new Set();

let myticketraw = [157,101,107,179,181,163,191,109,97,103,89,113,167,127,151,53,83,61,59,173];

let tickets = [];
let invalidtx = 0;

rows.forEach(row => {
    let temp = row.split(",");
    temp = temp.map(Number);
    temp = buildticket(temp);
    if(temp.invalidsum === 0) tickets.push(temp);
});

tickets.push(buildticket(myticketraw));



tickets.forEach(ticket => {
    //populate the sets
    ticket.departureloccanddiates.forEach(d => {dlinv.add(d)});
    ticket.departurestationcandidates.forEach(d => {dsinv.add(d)});
    ticket.departureplatcandidates.forEach(d => {dpinv.add(d)});
    ticket.departuretrackcandidates.forEach(d => {dtinv.add(d)});
    ticket.departuredatecandidates.forEach(d => {ddinv.add(d)});
    ticket.departuretimecandidates.forEach(d => {dttinv.add(d)});

    ticket.arrivalloccandidates.forEach(d => {ainv.add(d)});
    ticket.arrivalstationcandidates.forEach(d => {asinv.add(d)});
    ticket.arrivalplatcandidates.forEach(d => {apinv.add(d)});
    ticket.arrivaltrackcandidates.forEach(d => {atinv.add(d)});
    ticket.classcandidates.forEach(d => {cinv.add(d)});
    ticket.durationcandidates.forEach(d => {dinv.add(d)});

    ticket.pricecandidates.forEach(d => {pinv.add(d)});
    ticket.routecandidates.forEach(d => {rtinv.add(d)});
    ticket.rowcandidates.forEach(d => {rowinv.add(d)});
    ticket.seatcandidates.forEach(d => {sinv.add(d)});
    ticket.traincandidates.forEach(d => {tinv.add(d)});
    ticket.typecandidates.forEach(d => {tyinv.add(d)});

    ticket.wagoncandidates.forEach(d => {winv.add(d)});
    ticket.zonecandidates.forEach(d => {zinv.add(d)});

});

console.log(invalidtx);

function buildticket(vals) {
    let ticket = {
        "raw": vals,
        "departureloccanddiates": [],
        "departurestationcandidates": [],
        "departureplatcandidates": [],
        "departuretrackcandidates": [],
        "departuredatecandidates": [],
        "departuretimecandidates": [],
        "arrivalloccandidates": [],
        "arrivalstationcandidates": [],
        "arrivalplatcandidates": [],
        "arrivaltrackcandidates": [],
        "classcandidates": [],
        "durationcandidates": [],
        "pricecandidates": [],    
        "routecandidates": [],
        "rowcandidates": [],
        "seatcandidates": [],
        "traincandidates": [],
        "typecandidates": [],
        "wagoncandidates": [],
        "zonecandidates": [],
        "invalidsum": 0,
        "invalidnumbers": []
    };


    for(var i = 0; i < vals.length; i++){
        //check them all
        let num = vals[i];
        let numvalid = false;
        if(departurelocck(num)) {
            numvalid = true;
        } else {
            //this column isn't valid for departureloc
            //dlinv.add(i);
            ticket.departureloccanddiates.push(i);
        }

        if(departurestationck(num)) {
            numvalid = true;
        } else {
            //this column isn't valid for departureloc
            //dsinv.add(i);
            ticket.departurestationcandidates.push(i);
        }

        if(departureplatck(num)) {
            numvalid = true;
        } else {
            //this column isn't valid for departureloc
            //dpinv.add(i);
            ticket.departureplatcandidates.push(i);
        }

        if(departuretrackck(num))  {
            numvalid = true;
        } else {
            //this column isn't valid for departureloc
            //dtinv.add(i);
            ticket.departuretrackcandidates.push(i);
        }

        if(departuredateck(num))  {
            numvalid = true;
        } else {
            //this column isn't valid for departureloc
            //ddinv.add(i);
            ticket.departuredatecandidates.push(i);
        }

        if(departuretimeck(num))  {
            numvalid = true;
        } else {
            //this column isn't valid for departureloc
            //dttinv.add(i);
            ticket.departuretimecandidates.push(i);
        }

        if(arrivallocck(num))  {
            numvalid = true; } else { 
            ticket.arrivalloccandidates.push(i);
        }

        if(arrivalstationck(num))  {
            numvalid = true; } else {
            ticket.arrivalstationcandidates.push(i);
        }

        if(arrivalplatck(num))  {
            numvalid = true; } else { 
            ticket.arrivalplatcandidates.push(i);
        }

        if(arrivaltrackck(num))  {
            numvalid = true; } else { 
            ticket.arrivaltrackcandidates.push(i);
        }

        if(classck(num))  {
            numvalid = true; } else { 
            ticket.classcandidates.push(i);
        }

        if(durationck(num))  {
            numvalid = true; } else { 
            ticket.durationcandidates.push(i);
        }

        if(priceck(num))  {
            numvalid = true; } else { 
            ticket.pricecandidates.push(i);
        }

        if(routeck(num))  {
            numvalid = true; } else { 
            ticket.routecandidates.push(i);
        }

        if(rowck(num))  {
            numvalid = true; } else { 
            ticket.rowcandidates.push(i);
        }

        if(seatck(num))  {
            numvalid = true; } else { 
            ticket.seatcandidates.push(i);
        }

        if(trainck(num))  {
            numvalid = true; } else { 
            ticket.traincandidates.push(i);
        }

        if(typeck(num))  {
            numvalid = true; } else { 
            ticket.typecandidates.push(i);
        }

        if(wagonck(num))  {
            numvalid = true; } else { 
            ticket.wagoncandidates.push(i);
        }

        if(zoneck(num))  {
            numvalid = true; } else { 
            ticket.zonecandidates.push(i);
        }

        if(!numvalid) {
            ticket.invalidnumbers.push(num);
            ticket.invalidsum += num;
        }
    }

    return ticket;
}

function initmap(map){
    for(var i = 0; i < 20; i++) {
        map.set(i, 0);
    }
}

//determine which field is what
//check the same position on every ticket to see if it hits every rule. we only care about the 6 departure fields

function getdepaturesum(tickets) {
    //20 fields on the ticket. find the 6 depature fields
    for(var i = 0; i < 20; i++) {
        //check every ticket
        let
        for(var j = 0; j < tickets.length; j++) {
            
        }
    }
}