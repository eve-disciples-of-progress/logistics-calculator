function calculateDistance(start, dest) {
    // We're doing breadth-first-search
    var breadthFirstTree = {}; // value = parent of vertex
    var visited = [start];
    var queue = [start];
    while (queue.length > 0) {
        var queueBeginning = queue.shift();
        eveSystems[queueBeginning]
            .filter(function(system) {
                return !visited.includes(system)
            })
            .forEach(function(system) {
                visited.push(system);
                queue.push(system);
                breadthFirstTree[system] = queueBeginning;
            });
    }

    var path = [];
    for (var currentSystem = dest; currentSystem !== start; currentSystem = breadthFirstTree[currentSystem]) {
        path.unshift(currentSystem);
    }
    return path.length;
}

function pickShip(volume, collateral) {
    var shipTypes = [{
        // XS - Blockade Runner
        maxVolume: 12000, // 12k
        maxCollateral: 5000000000, // 5 billion
        ratePerJump: 900000, // 900k
    }, {
        // S - Deep Space Transport
        maxVolume: 62000, // 62k
        maxCollateral: 2000000000, // 2 billion
        ratePerJump: 1200000, // 1.2 million
    }, {
        // L - Tanked Freighter
        maxVolume: 800000, // 800k
        maxCollateral: 2000000000, // 2 billion
        ratePerJump: 1500000, // 1.5 million
    }, {
        // XL - Large Cargo Extended Freighter
        maxVolume: 1200000, // 1.2 million
        maxCollateral: 2000000000, // 2 billion
        ratePerJump: 2700000, // 2.7 million
    }];
    var relevantShip = shipTypes.filter(function(shipType) {
        return volume <= shipType.maxVolume; 
    }).reduce(function (prev, cur) {
        return prev.maxVolume < cur.maxVolume ? prev : cur; 
    });

    if (!relevantShip) {
        return { error: 'volume' };
    }
    if (collateral > relevantShip.maxCollateral) {
        return { error: 'collateral' };
    }
    return relevantShip;
}

function calculateReward(distance, shipType) {
    var preciseReward = shipType.ratePerJump * distance;
    // Round up to nearest 0.01 million (10,000)
    var roundedUp = Math.ceil(preciseReward / 10000) * 10000;
    return roundedUp;
}

$(document).ready(function() {
    $(".systemInput").autocomplete({
        source: eveSystemNames
    });

    $("#calculatorInput").submit(function() {
        var startSystem = $('#startSystem').val().toLowerCase();
        var destSystem = $('#destSystem').val().toLowerCase();
        var collateral = Number($('#collateral').val());
        var volume = Number($('#volume').val());

        var errors = 0;
        $('#startSystemError').text('');
        $('#destSystemError').text('');
        $('#collateralError').text('');
        $('#volumeError').text('');
        if (!eveSystemNames.includes(startSystem)) {
            $('#startSystemError').text('Unsupported system');
            ++errors;
        }
        if (!eveSystemNames.includes(destSystem)) {
            $('#destSystemError').text('Unsupported system');
            ++errors;
        }
        if (isNaN(collateral)) {
            $('#collateralError').text('Not a number');
            ++errors;
        } else if (collateral <= 0) {
            $('#collateralError').text('Must be positive');
            ++errors;
        }
        if (isNaN(volume)) {
            $('#volumeError').text('Not a number');
            ++errors;
        } else if (volume <= 0) {
            $('#volumeError').text('Must be positive');
            ++errors;
        }
        if (errors > 0) {
            return;
        }

        var distance = calculateDistance(startSystem, destSystem);
        $('#jumpsText').text(distance);

        var shipType = pickShip(volume, collateral);
        if (shipType.error) {
            switch (shipType.error) {
                case 'volume':
                    $('#volumeError').text('Volume too large. Try splitting in to multiple contracts.');
                    break;
                case 'collateral':
                    $('#collateralError').text('Collateral too large. Try splitting in to multiple contracts.');
                    break;
            }

            $('#rewardInput').val('');
            $('#rewardText').text('');
            return;
        }

        var reward = calculateReward(distance, shipType);
        $('#rewardInput').val(reward);
        $('#rewardText').text((reward / 1000000));
    });
});
