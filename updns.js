var named = require('node-named');
var CheckedRecord = require('./recordchecker.js');
var Ping = require('./checkers/ping.js')
var server = named.createServer();
var ttl = 300;
var records = [];

server.listen(5300, '::ffff:0.0.0.0', function() {
  console.log('DNS server started on port 5300');
});

server.on('query', function(query) {
  var domain = query.name();
  console.log('DNS Query: %s', domain)
  
  var target = getRecord(query);

  query.addAnswer(domain, target, ttl);
  server.send(query);
});

function getRecord(query) {
  var domain = query.name();
  var type = query.type();

  console.log("Finding: " + type + " records for domain: " + domain);
  var allRecordsForDomain = records[domain];
  var checkedRecordsForFomain = allRecordsForDomain.filter(function(item) {
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
    var record = target.getRecord();
    console.log("Found: " + record);
    return record;
  }
  return null;
}

if (!records['example.com']) {
  records['example.com'] = [];
}
records['example.com'].push(new CheckedRecord(new named.SOARecord('example.com', {serial:12345}), new Ping('192.168.0.1')));
records['example.com'].push(new CheckedRecord(new named.SOARecord('example.com', {serial:12345}), new Ping('192.168.0.2')));
records['example.com'].push(new CheckedRecord(new named.SOARecord('example.com', {serial:12345}), new Ping('192.168.0.233')));
