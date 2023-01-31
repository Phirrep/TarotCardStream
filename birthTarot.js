var utils = require("./utils.js");
const birthCards = utils.birthCards;
const dateObj = utils.dateObj;

function birthdayToTarot(date){
    let total = date.month + date.day + date.year.num1 + date.year.num2;
    let tarot = Math.floor(total/10) + (total % 10);
    return birthCards.filter(x => x.card1 === tarot || x.card2 === tarot)[0];
}

module.exports.dateObj = dateObj;
module.exports.birthdayToTarot = birthdayToTarot;