var checker, record;

CheckedRecord = function() {
}

CheckedRecord.prototype.checkRecord = function() {
    return checker.check() ? record : null;
}

module.exports = CheckedRecord;