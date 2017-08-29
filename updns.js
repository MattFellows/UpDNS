var dnsd = require('dnsd');
var named = require('node-named');
var server = dnsd.createServer(requestHandler);
server.listen(5300, '127.0.0.1');
console.log('Server running at 127.0.0.1:5300');

var CheckedRecord = require('./recordchecker.js');
var Ping = require('./checkers/ping.js');
var records = require('./records.json');

function requestHandler(req, res) {
  var question = res.question[0]
    , hostname = question.name
    , length = hostname.length
    , ttl = Math.floor(Math.random() * 3600);

  console.log('DNS Query: %s', req)
  
  var target = getRecord(req);

  try {
    //server.send(query);
    console.log("Responding with: " + target.target);
    res.end(target.target);
  } catch (ex) {
    console.log(ex);
  }
}

function setupRecordCheckers() {
  for (var domainName in records.domains) {
    var domain = records.domains[domainName];
    for (var recordTypeName in domain.records) {
      var recordType = domain.records[recordTypeName];
      var checkerType = recordType.checker.type;
      var checkerFrequency = recordType.checker.frequency;
      recordType.checkedRecords = [];
      for (var recordIndex in recordType.values) {
        var record = recordType.values[recordIndex];
          switch (checkerType) {
          case 'ping': 
            var DNSrecord = getRecordType(recordTypeName, record);
            var checkedRecord = new CheckedRecord(DNSrecord, new Ping(record, recordType.checker));
            recordType.checkedRecords.push(checkedRecord);
        }
      }
    }
  }
}

function getRecordType(recordType, record) {
  switch (recordType) {
    case 'A':
      return new named.ARecord(record);
  }
}

function getRecord(query) {
  var domain = query.question[0].name;
  var type = query.question[0].type;

  console.log("Finding: " + type + " records for domain: " + domain);
  var allRecordsForDomainAndType = records.domains[domain].records[type].checkedRecords;

  var checkedRecordsForFomain = allRecordsForDomainAndType.filter(function(item) {
    var checkResult = item.checkRecord();
    return checkResult;
  });
  var sortedCheckedRecordsForDomain = checkedRecordsForFomain.sort(function(rec1, rec2) {
    if (rec1.getLoad() < rec2.getLoad()) {
      return -1;
    }
    if (rec1.getLoad() == rec2.getLoad()) {
      return 0;
    }
    return 1;
  });
  if (sortedCheckedRecordsForDomain.length > 0) {
    var target = sortedCheckedRecordsForDomain[0];
    target.incrementLoad();
    for (var i = 0; i < sortedCheckedRecordsForDomain.length; i++) {
      if (sortedCheckedRecordsForDomain[i] != target) {
        sortedCheckedRecordsForDomain[i].decrementLoad();
      }
    }
    var record = target.getRecord();
    return record;
  }
  return null;
}

setupRecordCheckers();
/*
if (!records['example.com']) {
  records['example.com'] = [];
}
records['example.com'].push(new CheckedRecord(new named.ARecord('192.168.0.1'), new Ping('192.168.0.1')));
records['example.com'].push(new CheckedRecord(new named.ARecord('192.168.0.2'), new Ping('192.168.0.2')));
records['example.com'].push(new CheckedRecord(new named.ARecord('192.168.0.197'), new Ping('192.168.0.197')));
*/