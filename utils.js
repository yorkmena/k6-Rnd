import moment from "./libs/moment.js"
import papaparse from "./libs/papaparse.js"

/**
 * @description Create date object for upcoming n days.
 * @param {Integer} n 
 * @returns {Array} array of date objects 
 */
export function createDates(n) {
    let dateList = [];
    for (let i = 0; i < n; i++) {
        dateList.push(moment().add(i, 'days').format('YYYY-MM-DD'));
    }
    return dateList;
}

/**
 * @description Shuffle an array.
 * @param {Array} array
 * @returns {Array} shuffled array 
 */
export function shuffleArray(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
/**
 * Read a csv file and returns JSON object
 * @param {String} filePath 
 * @returns {JSON object}
 */
export function readCSV(filePath) {
  const csvData = papaparse.parse(open(filePath), {
    header: true
});
  return csvData;
}