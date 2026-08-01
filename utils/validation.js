function isPositiveNumber(value) {
    return !isNaN(value) && Number(value) > 0;
}


function isValidDate(date) {

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    return datePattern.test(date);

}


function isValidTime(time) {

    const timePattern = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

    return timePattern.test(time);

}


module.exports = {
    isPositiveNumber,
    isValidDate,
    isValidTime
};