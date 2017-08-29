var net = require('net');

function OpenPort(host, options) {
    var self = this;
    self.options = options;
    self.portList = self.options.portList;
    self.host = host;
    self.result = false;
    self.portsIndex = 0;
    self.interval = setInterval(function() { asyncCheck(self); }, self.options.interval || 30000);
    asyncCheck(self)
}

function asyncCheck(self) {
    if (self.portsIndex == 0) {
        self.tempResult = true;
        var port = self.portList[self.portsIndex];
        if (port) {
            checkPort(port, self);
        }
    }
}

function checkPort(port, self) {
    console.log("Checking: " + self.host + " port: " + port);
    var s = new net.Socket();
    s.setTimeout(self.options.timeout, function() { s.destroy(); });
    s.on('error', function(err){
        console.log("Error: "+err.message);
        self.result = false;
    })
    s.connect(port, self.host, function() {
        console.log('OPEN: ' + self.host + " " + port);
        self.tempResult = self.tempResult && true;
        self.portsIndex++;
        if (self.portsIndex < self.portList.length) {
            port = self.portList[self.portsIndex];
            if (port) {
                checkPort(port, self);
            }
        } else {
            self.result = self.tempResult;
            self.portsIndex = 0;
        }
    });
}

function check() {
    console.log("Checked: " + this.portList.join(",") + " recieved: " + this.result);
    if (!this.interval) {
        this.interval = setInterval(asyncCheck, 30000);
    }
    return this.result;
}

OpenPort.prototype.check = check;

module.exports = OpenPort;