/* global ko */
(function() {
    "use strict";
    var observed = {},
        otherHash = '',
        hashValues = {},
        writeToHash, readFromHash, InitialValue;

    InitialValue = function() {
        var self = this;

        self.name = 'initial value';
    };

    writeToHash = function() {
        var hashList = [];

        ko.utils.objectForEach(observed, function(k, v) {
            if (!(v instanceof InitialValue)) {
                // there is no "undefined" in JSON
                if (undefined === v) {
                    v = null;
                }
                hashList.push(encodeURIComponent(k) + ':' + encodeURIComponent(JSON.stringify(v)));
            }
        });
        if (hashList.length) {
            readFromHash();
            location.hash = otherHash + '?' + hashList.join('&') + '?';
        }
    };

    readFromHash = function() {
        var locMatch = location.hash.match(/^#?(.*?)(?:\?(.*?)\?)?$/),
            hashList;

        if (locMatch) {
            if (locMatch[1]) {
                otherHash = locMatch[1];
            }

            if (locMatch[2]) {
                hashList = locMatch[2].split('&');
                hashValues = {};
                ko.utils.arrayForEach(hashList, function(v) {
                    var observePair = v.split(':');
                    if (2 === observePair.length && observePair[0] && undefined !== observePair[1]) {
                        hashValues[decodeURIComponent(observePair[0])] = JSON.parse(decodeURIComponent(observePair[1]));
                    }
                });
            }
        }
    };

    ko.extenders.hashSync = function(target, name) {
        if ('string' !== typeof name) {
            throw ('Name of observable must be String not "' + (typeof name) + '".');
        }
        if (undefined !== observed[name]) {
            throw ('Observable with name "' + name + '" is already registered.');
        }
        observed[name] = new InitialValue();

        target.subscribe(function(newVal) {
            observed[name] = newVal;
            writeToHash();
        });

        if (undefined !== hashValues[name]) {
            target(hashValues[name]);
        }
    };

    readFromHash();
}());
