console.log('foo before the function');

/**
 * Removes all commas and currency symbols from a string before formatting to a number. 
 * @param {string} string 
 * @returns {number} 
 */
function sanitiseStringToNumber(string) {
    let number;
    let substring = string.replace(/,/g, '')
    substring = substring.substr(1);
    number = parseFloat(substring);
    return number;
}

console.log('foo not exported');

module.exports = {
    sanitiseStringToNumber: sanitiseStringToNumber
}