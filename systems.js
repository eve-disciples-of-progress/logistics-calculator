var eveSystems = {
    "akeva": ["gelhan"],
    "gelhan": ["ejahi"],
    "ejahi": ["jarizza"],
    "jarizza": ["bar", "asghatil"],
    "bar": ["sucha", "gamis"],
    "asghatil": ["akpivem", "sucha"],
    "gamis": ["shedoo"],
    "akpivem": ["tanoo", "yuzier", "maspah"],
    "shedoo": ["ihal", "berta"],
    "tanoo": ["sasta", "yuzier"],
    "yuzier": ["nirbhi"],
    "maspah": ["shala", "zemalu", "ibaria", "juddi"],
    "berta": ["juddi"],
    "shala": ["zemalu"],
    "juddi": ["ibaria", "khankenird"],
    "nirbhi": ["tidacha", "zaid"], //
    "tanoo": ["sasta"], //

};

// Convert keys to lower case
for (var system of Object.keys(eveSystems)) {
    if (system.toLowerCase() !== system) {
        eveSystems[system.toLowerCase()] = eveSystems[system];
        delete eveSystems[system];
    }
}

for (var system of Object.keys(eveSystems)) {
    eveSystems[system].forEach(function(connectedSystem) {
        // Make bidirectional
        if (!eveSystems[connectedSystem]) {
            eveSystems[connectedSystem] = [];
        }
        if (!eveSystems[connectedSystem].includes(system)) {
            eveSystems[connectedSystem].push(system);
        }

        // Convert to lower case
        if (connectedSystem.toLowerCase() !== connectedSystem) {
            eveSystems[connectedSystem.toLowerCase()] = eveSystems[connectedSystem];
            delete eveSystems[connectedSystem];
        }
    });
}

var eveSystemNames = Object.keys(eveSystems);
