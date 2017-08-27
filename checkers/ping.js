var ping = require ("net-ping");

function Ping(addr) {
    var self = this;
    self.address = addr;
    self.result = false;
    self.session = null;
    self.sessionId = (process.pid + Math.ceil(Math.random() * 65535) % 65535)

    var options = {
        networkProtocol: ping.NetworkProtocol.IPv4,
        packetSize: 16,
        retries: 1,
        sessionId: self.sessionId,
        timeout: 500,
        ttl: 128
    };
    self.session = ping.createSession (options);
    self.session.pingHost(self.address, function(error, target, sent, rcvd) {
        self.result = !error
        console.log("Just checked: " + self.address + " recieved: " + self.result);
    });
}

function check() {
    console.log("Checked: " + this.address + " recieved: " + this.result);
    return this.result;
}

Ping.prototype.check = check;

module.exports = Ping;

var works = new Ping('192.168.0.1');
var fails = new Ping('192.168.37.71');
setTimeout(function() {
    var fails2 = new Ping('192.168.37.71');
}, 3000);

//works.setup();