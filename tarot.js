/*Add the digits of birthday
Add digits of result*/
//If 3 digits, add first 2, then last


//tarot = num1 (1 digit) + num2 (2 digits) => tarot/2 combinations
//1 <= tarot <= 21

//num2 * 10 + (num1) = result => 1 combination
//result = month + day + year1 + year2 => a lot

const minYear = 2000;
const calender = [
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

class snode{
    //data: Object, next: () => data
    constructor(data, next){
        this.data = data;
        this.next = next.get;
    }
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

//tarotToCombination(tarot: int): {num1, num2}[]
//num1: first 1/2 digits, num2: last digit
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
    let initDate = {month: 1, day: 1, year: {num1: Math.floor(minYear/100), num2: minYear % 100}};
    const firstDate = calcNextDate(initDate, total);
    return snodeDate(firstDate);
}
function snodeDate(date){
    return snode(date, memo0(() => snodeDate(calcNextDate(date))));
}

//calcNextDate(date: {month, day, year: {num1, num2}}): date
function calcNextDate(prevDate, total){
    let date = {month: prevDate.month, day: prevDate.day, year: {num1: prevDate.year.num1, num2: prevDate.year.num2}};
    let currTotal = () => date.month + date.day + date.year.num1 + date.year.num2;
    let currMonth = () => calender.filter(x => x.month === date.month)[0];
    while (currTotal() != total){
        date.day += 1;
        if (date.day > currMonth().days(date.year.num2 % 4 === 0)){
            date.month += 1;
            date.day = 1;
        }
        if (date.month > 12){
            date.num2 += 1;
            date.month = 1;
            date.day = 1;
        }
        if (date.year.num2 > 99){
            date.year.num1 += 1;
            date.year.num2 = 0;
            date.month = 1;
            date.day = 1;
        }
    }
    return date;
}
//Returns true if date1 is earlier
function isEarlier(date1, date2){
    if (date1.year.num1 != date2.year.num1){
        return (date1.year.num1 > date2.year.num2) ? {same: false, early: false}:{same: false, early: true};
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
function combineStream(st1, st2){
    if (isEarlier(st1.data, st2.data).same){
        return snode(st1.data, memo0(() => combineStream(st1.next(), st2.next())));
    }
    else if (isEarlier(st1.data, st2.data).early){
        return snode(st1.data, memo0(() => combineStream(st1.next(), st2)));
    }
    else{
        return snode(st2.data, memo0(() => combineStream(st1, st2.next())));
    }
}

function tarotStream(tarot){
    let combinations = tarotToCombination(tarot);
    let streams = combinations.map(x => combinationToDate(x));
    let accStream;
    for (let i = 1; i < streams.length; i++){
        accStream = combineStream(accStream, combineStream(streams[i-0], streams[i]));
    }
    return accStream;
}

module.exports.tarotStream = tarotStream;