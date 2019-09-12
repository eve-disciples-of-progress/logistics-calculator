function calculateDistance(start, dest) {
    // We're doing breadth-first-search
    // TODO: This is bugged - figures out a path that revisits visited nodes

    var path = [];
    var visited = [];
    var queue = [];
    queue.unshift(start);
    while (queue.length > 0) {
        var queueBeginning = queue.shift();
        path.push(queueBeginning);
        eveSystems[queueBeginning]
            .filter(function(system) {
                return !visited.includes(system)
            })
            .forEach(function(system) {
                visited.push(system);
                queue.unshift(system);
            });
    }

    console.log('Path', path);
    console.log('Path length', path.length);
    return path.length;
}

function calculateReward(distance, collateral, volume) {
    var preciseReward = collateral + (distance * collateral / volume);
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

        var reward = calculateReward(distance, collateral, volume);
        $('#rewardInput').val(reward);
        $('#rewardText').text((reward / 1000000));
    });
});
