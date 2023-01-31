https://www.keen.com/articles/tarot/tarot-birth-cards

Hello!
This program finds dates that result in certain birth cards.
To calculate your tarot birth cards:
- First, you add the month, day, first 2 digits of the year, and last 2 digits of the year
- Then, you add the last digit of the total and the remaining digit(s)
- Afterwards, based on the result, you find which card corresponds to the result to find your birth cards
(see website above)
The script (birthTarot.js) can calculate the cards that result from certain birthdays.

The script (tarotDates.js) does the opposite, and finds dates that result in specific birth cards.
To do so, I've implemented a memoized stream to store most/all possible date combinations, starting
from least recent to most recent.
There is a minimum year that can be changed in the variable stored in tarot.js.
To find the dates, I found the results that would lead to specific birth cards in the last step of the
above process.
Then, I calculated the soonest dates for each of the results in the previous step.
Afterwards, I combined the streams starting from earliest dates, which is shown in the return value of
getTarotDates() function.

The script can be used to return a stream of dates that all result in the birth cards, and you can
iterate through the stream using getSnode() and print the dates using printDate().

