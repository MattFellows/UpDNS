

function CheckedRecord(rec, chec) {
    this.record = rec;
    this.checker = chec;
    this.load = 0;
}

function checkRecord() {
    return this.checker.check();
}

function incrementLoad() {
    this.load++;
}

function resetLoad() {
    this.load = 0;
}

function decrementLoad() {
    this.load--;
    if (this.load < 0) {
        this.load = 0;
    }
}

function getLoad() {
    return this.load;
}

function getRecord() {
    return this.record;
}

CheckedRecord.prototype.checkRecord = checkRecord;

CheckedRecord.prototype.incrementLoad = incrementLoad;

CheckedRecord.prototype.resetLoad = resetLoad;

CheckedRecord.prototype.decrementLoad = decrementLoad;

CheckedRecord.prototype.getLoad = getLoad;

CheckedRecord.prototype.getRecord = getRecord;

module.exports = CheckedRecord;