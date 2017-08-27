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
        timeout: 2000,
        ttl: 128
    };
    session = ping.createSession (options);
    session.pingHost(self.address, function(error, target, sent, rcvd) {
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