const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let ingredients = new Map();
let allergens = new Map();
let recipes = [];

for(var i = 0; i < input.length; i++) {
    let paran = input[i].indexOf("(");
    let ingreds = input[i].substr(0, paran-1).split(" ");
    let allers = input[i].substr(paran+10,input[i].length - (paran+10) - 1).split(", ");
    allers.forEach(a => {
        if(!allergens.has(a)) {
            allergens.set(a, {"name":a, "possibleings": new Set(ingreds)});
        } else {
            let ingset = new Set(ingreds);
            let al = allergens.get(a);
            al.possibleings = new Set([...al.possibleings].filter(x => ingset.has(x)));
        }
    });

    ingreds.forEach(ig => {
        let igm;
        if(ingredients.has(ig)) {
            igm = ingredients.get(ig);
            igm.count++;
            ingredients.set(ig, igm);
        } else {
            ingredients.set(ig,{"name":ig, "count": 1});
            igm = ingredients.get(ig);
        }
    });
    
    // let recipe = {"ingredients": [], "possibleallergens": []};
    // allers.forEach(a => {
    //     if(!allergens.has(a)) {
    //         allergens.set(a,{"name":a, "recipes":[recipe], "ingreds": ingreds});
    //     }  else {
    //         allergens.get(a).ingreds.push(ingreds);
    //     }
    //     recipe.possibleallergens.push(allergens.get(a));
    // });
    // ingreds.forEach(ig => {
    //     let igm;
    //     if(ingredients.has(ig)) {
    //         igm = ingredients.get(ig);
    //         for(var j = 0; j < allers.length; j++) {
    //             igm.possibleallergens.add(allers[j]);
    //         }
    //     } else {
    //         ingredients.set(ig,{"name":ig, "possibleallergens": new Set(allers)});
    //         igm = ingredients.get(ig);
    //     }
    //     recipe.ingredients.push(igm);
    // });
    // recipes.push(recipe);
}

//find intersection of all ingredients when an allergen is called out
let doit = true;
let ingstoallergens = new Set();
while(doit) {
    let count = 0;
    allergens.forEach((v,k) => {
        if(v.possibleings.size === 1) {
            count++;
            //ship it and remove it from all other
            let ingtodel = Array.from(v.possibleings)[0];
            ingstoallergens.add(ingtodel);
            v.ingredientcausing = ingtodel;
            allergens.forEach((v2,k2) => {
                if(k2 !== k) {
                    v2.possibleings.delete(ingtodel);
                }
            });
        }
    });
    if(count === allergens.size) doit = false;    
}
let sum = 0;
ingredients.forEach((v,k) => {
    if(!ingstoallergens.has(v.name)) sum += v.count;
});
let allallers = [];
allergens.forEach((v,k) => {
    allallers.push(k);
});
allallers.sort();
let p2 = "";
for(var i = 0; i < allallers.length; i++){
    let ing = Array.from(allergens.get(allallers[i]).possibleings)[0];
    p2 += ing + ",";
}
console.log(p2);