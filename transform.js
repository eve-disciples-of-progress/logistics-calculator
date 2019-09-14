var fs = require('fs');
const rawData = require('./rawData');
const solarSystems = rawData.solarSystems;
const jumps = rawData.jumps;

// We don't do hauling through low & null sec systems, so lets filter them out
const relevantSolarSystems = solarSystems.filter((solarSystem) => Math.round(solarSystem.security) >= 0.5);

const formattedSystems = {};
relevantSolarSystems.forEach((solarSystem) => {
    const outboundJumps = jumps.filter((jump) => jump.from === solarSystem.id);

    let connectedSystems = outboundJumps.map((jump) => {
        const systemId = jump.to;
        const solarSystem = relevantSolarSystems.find((solarSystem) => solarSystem.id === systemId);
        return solarSystem && solarSystem.name.toLowerCase();
    });
    connectedSystems = connectedSystems.filter((system) => !!system); // remove empty ones (like lowsec)
    
    formattedSystems[solarSystem.name.toLowerCase()] = connectedSystems;
});

var fileContent = `
// This file is machine-generated via [\`transform.js\`](https://github.com/eve-disciples-of-progress/logistics-calculator/blob/master/transform.js) - do not edit directly!
var eveSystems = ${JSON.stringify(formattedSystems)};
var eveSystemNames = Object.keys(eveSystems);
`;
fs.writeFileSync('systems.js', fileContent);
