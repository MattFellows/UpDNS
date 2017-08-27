var ping = require ("net-ping");

function Ping(addr) {
    var self = this;
    self.address = addr;
    self.result = false;
    self.session = null;

    var options = {
        networkProtocol: ping.NetworkProtocol.IPv4,
        packetSize: 16,
        retries: 1,
        sessionId: (process.pid % 65535),
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
var fails = new Ping('192.168.33.1');
setTimeout(function() {
    var fails2 = new Ping('192.168.33.1');
}, 1000);

//works.setup();