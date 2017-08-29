var request = require ("request");

function URLRequest(url, options) {
    var self = this;
    self.url = url;
    self.options = options;
    self.result = false;
    self.interval = setInterval(function() { asyncCheck(self); }, self.options.interval || 30000);
    asyncCheck(self)
}

function asyncCheck(self) {
    console.log("Checking: " + self.url);
    request(self.url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.

        if (self.options.checkType == "status") {
            if (response && response.statusCode && self.options.check.indexOf(response.statusCode) > -1) {
                self.result = true;
            }
        } else if (self.options.checkType == "content") {
            if (response && body) {
                self.result = body.match(self.check);
            }
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

URLRequest.prototype.check = check;

module.exports = URLRequest;