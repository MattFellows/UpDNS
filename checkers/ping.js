var Checker = require('checker.js');
var ping = require ("net-ping");
var address, session, result;

function Ping(address) {
    var options = {
        networkProtocol: ping.NetworkProtocol.IPv4,
        packetSize: 16,
        retries: 1,
        sessionId: (process.pid % 65535),
        timeout: 2000,
        ttl: 128
    };
    session = ping.createSession (options);
    
    session.pingHost(address, function(error, target, sent, rcvd) {
        result = !!error
    });
}

function check() {
    return result;
}

Ping.mixin(Checker);