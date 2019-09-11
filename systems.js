var eveSystems = {
    "jita": ["test1"],
    "test1": ["test2"],
    "test2": ["test3"]
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
