var ping = require ("net-ping");

function Ping(addr, options) {
    var self = this;
    self.address = addr;
    self.result = false;
    self.session = null;
    self.sessionId = (process.pid + Math.ceil(Math.random() * 65535) % 65535)

    var localOptions = {
        networkProtocol: ping.NetworkProtocol.IPv4,
        packetSize: 16,
        retries: 1,
        sessionId: self.sessionId,
        timeout: 500,
        ttl: 128
    };
    self.session = ping.createSession(localOptions);
    self.interval = setInterval(function() { asyncCheck(self); }, options.interval || 30000);
    asyncCheck(self)
}

function asyncCheck(self) {
    self.session.pingHost(self.address, function(error, target, sent, rcvd) {
        self.result = !error
        console.log("Just checked: " + self.address + " recieved: " + self.result);
    });
}

function check() {
    console.log("Checked: " + this.address + " recieved: " + this.result);
    if (!this.interval) {
        this.interval = setInterval(asyncCheck, 30000);
    }
    return this.result;
}

Ping.prototype.check = check;

module.exports = Ping;