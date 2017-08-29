var op = require ("openport");

function OpenPort(portList, options) {
    var self = this;
    self.portList = portList;
    self.options = options;
    self.result = false;
    self.interval = setInterval(function() { asyncCheck(self); }, self.options.interval || 30000);
    asyncCheck(self)
}

function asyncCheck(self) {
    op.find(
        {
            ports: self.portList,
            count: self.portList.length
        },
        function(err, ports) {
            if (err) {
                self.result = false;
            } else {
                self.result = true;
            } 
        }
    )
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