
var checker, record, load;

function CheckedRecord(rec, chec) {
    record = rec;
    checker = chec;
    load = 0;
}

function checkRecord() {
    return checker.check() ? record : null;
}

function incrementLoad() {
    load++;
}

function resetLoad() {
    load = 0;
}

function decrementLoad() {
    load--;
    if (load < 0) {
        load = 0;
    }
}

function getLoad() {
    return load;
}

CheckedRecord.prototype.checkRecord = checkRecord;

CheckedRecord.prototype.incrementLoad = incrementLoad;

CheckedRecord.prototype.resetLoad = resetLoad;

CheckedRecord.prototype.decrementLoad = decrementLoad;

CheckedRecord.prototype.getLoad = getLoad;

module.exports = CheckedRecord;