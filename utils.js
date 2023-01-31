//Year that calculations start from
const minYear = 1994;
//Allows for calculating days per month
const calendar = [
    {month: 1, days: (leap) => 31},
    {month: 2, days: (leap) => leap? 29:28},
    {month: 3, days: (leap) => 31},
    {month: 4, days: (leap) => 30},
    {month: 5, days: (leap) => 31},
    {month: 6, days: (leap) => 30},
    {month: 7, days: (leap) => 31},
    {month: 8, days: (leap) => 31},
    {month: 9, days: (leap) => 30},
    {month: 10, days: (leap) => 31},
    {month: 11, days: (leap) => 30},
    {month: 12, days: (leap) => 31}
];
//Respective birth cards and their combinations
const birthCards = [
    {card1: 21, card2: 3},
    {card1: 20, card2: 2},
    {card1: 19, card2: 10},
    {card1: 18, card2: 9},
    {card1: 17, card2: 8},
    {card1: 16, card2: 7},
    {card1: 15, card2: 6},
    {card1: 14, card2: 5},
    {card1: 13, card2: 4},
    {card1: 12, card2: 3},
    {card1: 11, card2: 2},
    {card1: 10, card2: 1}
];

function dateObj(month, day, year){
    return {
        month: month,
        day: day,
        year: year
    };
}

function snode(data, next){
    return {
        isEmpty: false,
        head: () => data,
        next: next.get
    };
}
function sempty(){
    return {
        isEmpty: true
    };
}
function memo0(f){
    let r = {evaluated: false};
    return {
        get(){
            if (r.evaluated === false){
                r = {evaluated: true, v: f()}
            }
            return r.v;
        }
    }
}

module.exports.minYear = minYear;
module.exports.calendar = calendar;
module.exports.birthCards = birthCards;
module.exports.snode = snode;
module.exports.sempty = sempty;
module.exports.memo0 = memo0;
module.exports.dateObj = dateObj;