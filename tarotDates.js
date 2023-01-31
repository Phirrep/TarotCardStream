/*Add the digits of birthday
Add digits of result*/
//If 3 digits, add first 2, then last


//tarot = num1 (1 digit) + num2 (2 digits) => tarot/2 combinations
//1 <= tarot <= 21

//num2 * 10 + (num1) = result => 1 combination
//result = month + day + year1 + year2 => a lot
var utils = require("./utils.js");
const minYear = utils.minYear;
const calendar = utils.calendar;
const birthCards = utils.birthCards;
const snode = utils.snode;
const sempty = utils.sempty;
const memo0 = utils.memo0;
const dateObj = utils.dateObj;

//tarotToCombination(tarot: int): {num1, num2}[]
//num1: first 1/2 digits, num2: last digit
//Returns possible total numbers that result in the tarot cards
function tarotToCombination(tarot){
    let combinations = [];
    for (let i = 0; i < tarot && i < 10; i++){
        combinations.push({num1: tarot-i, num2: i});
    }
    return combinations;
}

//combinationToDate(combination: {num1, num2}): snode<date>
//num1: first 1/2 digits, num2: last digit
function combinationToDate(combination){
    let total = (combination.num1 * 10) + combination.num2;
    let initDate = dateObj(1, 0, {num1: Math.floor(minYear/100), num2: minYear % 100});
    const firstDate = calcNextDate(initDate, total);
    return snodeDate(firstDate, total);
}
//snodeDate(date: dateObj, total: int): snode<date>
function snodeDate(date, total){
    if (date === null){
        return sempty();
    }
    let nextDate = calcNextDate(date, total);
    return snode(date, memo0(() => snodeDate(nextDate, total)));
}

//calcNextDate(date: {month, day, year: {num1, num2}}): date
function calcNextDate(prevDate, total){
    let date = dateObj(prevDate.month, prevDate.day + 1, {num1: prevDate.year.num1, num2: prevDate.year.num2});
    let currTotal = () => date.month + date.day + date.year.num1 + date.year.num2;
    let currMonth = () => calendar.filter(x => x.month === date.month)[0];
    let newYear = function(){
        date.month = 1;
        date.day = 0;
    }
    while (currTotal() != total){
        date.day += 1;
        if (date.year.num1 > total || date.year.num1 > 99){
            return null;
        }
        if (12 + 31 + date.year.num1 + 99 < total){
            date.year.num1 += 1;
            newYear();
            continue;
        }
        if (12 + 31 + date.year.num1 + date.year.num2 < total){
            date.year.num2 += 1;
            newYear();
            continue;
        }
        if (date.day > currMonth().days(date.year.num2 % 4 === 0)){
            date.month += 1;
            date.day = 1;
        }
        if (date.month > 12){
            date.year.num2 += 1;
            newYear();
        }
        if (date.year.num2 > 99){
            date.year.num1 += 1;
            date.year.num2 = 0;
            newYear();
        }
    }
    return date;
}
//isEarlier(date1: date, date2: date): boolean
//Returns true if date1 is earlier
function isEarlier(date1, date2){
    if (date1.year.num1 != date2.year.num1){
        return (date1.year.num1 > date2.year.num1) ? {same: false, early: false}:{same: false, early: true};
    }
    else if (date1.year.num2 != date2.year.num2){
        return (date1.year.num2 > date2.year.num2) ? {same: false, early: false}:{same: false, early: true};
    }
    else if (date1.month != date2.month){
        return (date1.month > date2.month) ? {same: false, early: false}:{same: false, early: true};
    }
    else if (date1.day != date2.day){
        return (date1.day > date2.day) ? {same: false, early: false}:{same: false, early: true};
    }
    else{
        return {same: true, early: true};
    }
}
//combineStream(st1: snode<date>, st2: snode<date>): snode<date>
//Combines the streams based on recent dates
function combineStream(st1, st2){
    if (st1.isEmpty){
        return st2;
    }
    if (st2.isEmpty){
        return st1;
    }
    if (isEarlier(st1.head(), st2.head()).same){
        return snode(st1.head(), memo0(() => combineStream(st1.next(), st2.next())));
    }
    else if (isEarlier(st1.head(), st2.head()).early){
        return snode(st1.head(), memo0(() => combineStream(st1.next(), st2)));
    }
    else{
        return snode(st2.head(), memo0(() => combineStream(st1, st2.next())));
    }
}
//tarotStream(tarot: int): snode<date>
//Returns an snode stream of dates that correspond to the tarot cards
function tarotStream(tarot){
    let combinations = tarotToCombination(tarot);
    let streams = combinations.map(x => combinationToDate(x));
    return streams.reduce((acc, e) => combineStream(acc, e), sempty());
}
//getTarotDates(tarot: int): snode<date>
//Returns a stream of all/most dates that correspond to the respective dates for tarot cards
function getTarotDates(tarot){
    let combinations = birthCards.filter(x => x.card1 === tarot || x.card2 === tarot);
    let tarotNumbers = [];
    combinations.forEach(x => {tarotNumbers.push(x.card1);
        tarotNumbers.push(x.card2);});
    return tarotNumbers.reduce((acc, e) => combineStream(acc, tarotStream(e)), sempty());
}

function printDate(date){
    console.log(date);
}
function dateStr(date){
    if (date === null){
        return;
    }
    if (date.year.num2 < 10){
        return date.month + "/" + date.day + "/" + date.year.num1 + "0" + date.year.num2;
    }
    else{
        return date.month + "/" + date.day + "/" + date.year.num1 + date.year.num2;
    }
}
function getSnode(st, index){
    let currSnode = st;
    for (let i = 0; i < index; i++){
        if (currSnode.isEmpty){
            return null;
        }
        currSnode = currSnode.next();
    }
    return currSnode;
}


module.exports.getTarotDates = getTarotDates;
module.exports.getSnode = getSnode;
module.exports.printDate = printDate;
module.exports.dateStr = dateStr;