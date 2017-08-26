var named = require('node-named');
var server = named.createServer();
var ttl = 300;
var records = [];

server.listen(5300, '0.0.0.0', function() {
  console.log('DNS server started on port 5300');
});

server.on('query', function(query) {
  console.log(query);
  var domain = query.name();
  console.log('DNS Query: %s', domain)
  var target = new named.SOARecord(domain, {serial: 12345});
  query.addAnswer(domain, target, ttl);
  server.send(query);
});

records.push('example.com', named.ARecord('192.168.0.1'));
records.push('example.com', named.ARecord('192.168.0.2'));
records.push('example.com', named.ARecord('192.168.0.3'));