var namedServer = null;
RecordChecker = function(server) {
    namedServer = server;
}

function checkRecord(record, checker) {
    if (!checker.check(record)) {
        removeRecord(record);
    } else {
        addRecord(record);
    }
}

function removeRecord(record) {

}