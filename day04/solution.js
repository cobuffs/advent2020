const fs = require('fs');

const rows = fs.readFileSync('input1.txt', 'utf8').toString().trim().split("\r\n");

//The expected fields are as follows:

// byr (Birth Year)
// iyr (Issue Year)
// eyr (Expiration Year)
// hgt (Height)
// hcl (Hair Color)
// ecl (Eye Color)
// pid (Passport ID)
// cid (Country ID)

//convert to passports
let activepp = buildpassport();
let validpp = [];
let invalidpp = [];
for(let i = 0; i < rows.length; i++) {
    if(rows[i] === "") {
        if(isppvalid(activepp)) validpp.push(activepp);
        else invalidpp.push(activepp);
        activepp = buildpassport();
    }
    else {
        let keys = rows[i].split(" ");
        for(let j = 0; j < keys.length; j++) {
            let kv = keys[j].split(":");
            let key = kv[0];
            let val = kv[1];
            activepp[key] = val;
        }
    }
}

if(isppvalid(activepp)) validpp.push(activepp);
else invalidpp.push(activepp);
console.log(validpp.length);

function buildpassport(){
    return {
        "byr": null,
        "iyr": null,
        "eyr": null,
        "hgt": null,
        "hcl": null,
        "ecl": null,
        "pid": null,
        "cid": null
    }
}

function isppvalid(pp) {
    if (!(pp.byr && pp.iyr && pp.eyr && pp.hgt && pp.hcl && pp.ecl && pp.pid)) return false;

    //treat CID as optional
    // console.log(pp);
    // byr (Birth Year) - four digits; at least 1920 and at most 2002.
    if(!(parseInt(pp.byr,10) >= 1920 && parseInt(pp.byr,10) <= 2002)) return false;

    // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    if(!(parseInt(pp.iyr,10) >= 2010 && parseInt(pp.iyr,10) <= 2020)) return false;

    // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    if(!(parseInt(pp.eyr,10) >= 2020 && parseInt(pp.eyr,10) <= 2030)) return false;

    const hgtre = /^\d+(cm|in)$/;
    // hgt (Height) - a number followed by either cm or in:
    let hgtm = pp.hgt.match(hgtre);
    if(!hgtm || !(hgtm[0].length === pp.hgt.length)) 
    {   
        return false;
    } else {
        // If cm, the number must be at least 150 and at most 193.
        // If in, the number must be at least 59 and at most 76.
        let unit = pp.hgt.slice(pp.hgt.length-2);
        let val = parseInt(pp.hgt.slice(0, pp.hgt.length-2),10);
        if (unit === "cm") {
            if(val < 150 || val > 193) return false;
        } else {
            if(val < 59 || val > 76) return false;
        }
    }

    const hclre = /^#([0-9a-f]){6}$/;
    // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    let hclm = pp.hcl.match(hclre);
    if(!hclm || !(hclm[0].length === pp.hcl.length)) 
    {   
        return false;
    } 

    // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    if(!(pp.ecl === "amb" || pp.ecl === "blu" || pp.ecl === "brn" || pp.ecl === "gry" || pp.ecl === "grn" || pp.ecl === "hzl" || pp.ecl === "oth")) return false;

    // pid (Passport ID) - a nine-digit number, including leading zeroes.
    if(!(pp.pid.length === 9)) return false;

    return true;

}