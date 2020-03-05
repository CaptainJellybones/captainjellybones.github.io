var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", ];
var deck = new Array();
var players = new Array();
var currentPlayer = 0;
var player1wins = 0;
var player2wins = 0;
var winLimit = 21;
var player1stay;
var player2stay;
var aceCheck = [false, false]
var roundcounter = 1;

function createDeck() {
    deck = new Array();
    for (var i = 0; i < values.length; i++) {
        for (var x = 0; x < suits.length; x++) {
            var weight = parseInt(values[i]);
            if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                weight = 10;
            if (values[i] == "A") {
                weight = 11;
            }
            var card = {
                Value: values[i],
                Suit: suits[x],
                Weight: weight
            };
            deck.push(card);
        }
    }
}

function createPlayers(num) {
    players = new Array();
    for (var i = 1; i <= num; i++) {
        var hand = new Array();
        var player = {
            Name: 'Player ' + i,
            ID: i,
            Points: 0,
            Hand: hand
        };
        players.push(player);
    }
}

function createPlayersUI() {
    document.getElementById('players').innerHTML = '';
    for (var i = 0; i < players.length; i++) {
        var div_player = document.createElement('div');
        var div_playerid = document.createElement('div');
        var div_hand = document.createElement('div');
        var div_points = document.createElement('div');

        div_points.className = 'points';
        div_points.id = 'points_' + i;
        div_player.id = 'player_' + i;
        div_player.className = 'player';
        div_hand.id = 'hand_' + i;

        div_playerid.innerHTML = 'Player ' + players[i].ID;
        div_player.appendChild(div_playerid);
        div_player.appendChild(div_hand);
        div_player.appendChild(div_points);
        document.getElementById('players').appendChild(div_player);
    }
}

function shuffle() {
    // for 1000 turns
    // switch the values of two random cards
    for (var i = 0; i < 1000; i++) {
        var location1 = Math.floor((Math.random() * deck.length));
        var location2 = Math.floor((Math.random() * deck.length));
        var tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
}

function startblackjack() {
    console.clear();
    document.getElementById('btnStart').value = 'Restart';
    document.getElementById("status").style.display = "none";
    // deal 2 cards to every player object
    currentPlayer = 0;
    createDeck();
    shuffle();
    createPlayers(2);
    createPlayersUI();
    dealHands();
    document.getElementById('player_' + currentPlayer).classList.add('active');
    document.getElementById("roundcounter").innerHTML = roundcounter;
    player2stay = false;
    player1stay = false;
    document.getElementById('hitmebtn').classList.remove('hidden');
    document.getElementById('staybtn').classList.remove('hidden');
}

function dealHands() {
    // alternate handing cards to each player
    // 2 cards each
    for (var i = 0; i < 2; i++) {
        for (var x = 0; x < players.length; x++) {
            var card = deck.pop();
            players[x].Hand.push(card);
            renderCard(card, x);
            updatePoints();
            checkAce();
        }
    }

    updateDeck();
}



function renderCard(card, player) {
    var hand = document.getElementById('hand_' + player);
    hand.appendChild(getCardUI(card));
}

function getCardUI(card) {
    var el = document.createElement('div');
    var icon = '';
    if (card.Suit == 'Hearts')
        icon = '&hearts;';
    else if (card.Suit == 'Spades')
        icon = '&spades;';
    else if (card.Suit == 'Diamonds')
        icon = '&diams;';
    else
        icon = '&clubs;';

    el.className = 'card';
    el.innerHTML = card.Value + '<br/>' + icon;
    return el;
}

// returns the number of points that a player has in hand
function getPoints(player) {
    var points = 0;
    for (var i = 0; i < players[player].Hand.length; i++) {
        points += players[player].Hand[i].Weight;
    }
    players[player].Points = points;

    return points;
}

function updatePoints() {
    for (var i = 0; i < players.length; i++) {
        getPoints(i);
        document.getElementById('points_' + i).innerHTML = players[i].Points;
    }
}

function checkAce() {
    x = currentPlayer;
    console.log("Targeting player " + x);
    if (aceCheck[x] == false && players[x].Points > winLimit) {
        for (var i = 0; i < players[x].Hand.length; i++) {
            if (players[x].Hand[i].Value == "A" && aceCheck[x] == false) {
                console.log("Old points: " + players[x].Points)
                players[x].Points -= 10;
                players[x].Hand[i].Weight -= 10;
                aceCheck[x] = true;
                console.log("New points: " + players[x].Points)
                console.log("Points was more than winlimit. Executed CheckAce")
                document.getElementById('points_' + x).innerHTML = players[x].Points;
            }
        }
        console.log("end of checkAce")
    }
}

function hitMe() {
    // pop a card from the deck to the current player
    // check if current player new points are over 21
    var card = deck.pop();
    players[currentPlayer].Hand.push(card);
    renderCard(card, currentPlayer);
    updatePoints();
    updateDeck();
    checkAce();
    check();
}

function check() {
    if (players[currentPlayer].Points > winLimit) {
        document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' BUSTED!';
        document.getElementById('hitmebtn').classList.add('hidden');
        document.getElementById('staybtn').classList.add('hidden');
        if (players[0].Points > winLimit) {
            player2wins++;
            roundcounter++;
            document.getElementById("player2wins").innerHTML = player2wins;

        } else {
            player1wins++;
            roundcounter++;

            document.getElementById("player1wins").innerHTML = player1wins;
        }
        document.getElementById('status').style.display = "inline-block";
    } else {
        while (player1stay != true && player2stay != true) {
            nextPlayer();
            break;
        }

    }
}

function nextPlayer() {
    // move on to next player, if any
    if (currentPlayer != 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer = 1;
        document.getElementById('player_' + currentPlayer).classList.add('active');
        console.log("Current player was changed from player 0 -> 1")
    } else if (currentPlayer != 0) {
        document.getElementById('player_' + currentPlayer).classList.remove('active');
        currentPlayer = 0;
        document.getElementById('player_' + currentPlayer).classList.add('active');
        console.log("Current player was changed from player 1 -> 0")
    } else {
        bsod();
        console.log("Players didn't change properly. Did you do something?")
    }
}

function stay() {
    // move on to next player, if any 
    if (currentPlayer != 1) {
        document.getElementById('player_' + currentPlayer).classList.remove('active')
        currentPlayer = 1;
        player1stay = true;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    } else {
        document.getElementById('player_' + currentPlayer).classList.remove('active')
        currentPlayer = 0;
        player2stay = true;
        document.getElementById('player_' + currentPlayer).classList.add('active');
    }
    while (player1stay == true && player2stay == true) {
        end();
        break;
    }
}

function end() {
    document.getElementById('hitmebtn').classList.add('hidden');
    document.getElementById('staybtn').classList.add('hidden');
    if (players[0].Points == players[1].Points) {
        roundcounter++;

        document.getElementById("status").innerHTML = "You <strong>BOTH</strong> loose!";
        document.getElementById("status").style.display = "inline-block";
    } else if (players[1].Points > players[0].Points && players[1].Points < winLimit + 1) {
        player2wins++;
        roundcounter++;

        document.getElementById("player2wins").innerHTML = player2wins;
        document.getElementById("status").innerHTML = "A winner is Player 2";
        document.getElementById("status").style.display = "inline-block";
    } else if (players[0].Points > players[1].Points && players[0].Points < winLimit + 1) {
        player1wins++;
        roundcounter++;

        document.getElementById("player1wins").innerHTML = player1wins;
        document.getElementById("status").innerHTML = "A winner is Player 1";
        document.getElementById("status").style.display = "inline-block";
    } else {
        bsod();
        console.log("How the fuck did you manage to do this? You just triggered an Else statement that is never supposed to be triggered");
    }
}



function updateDeck() {
    document.getElementById('deckcount').innerHTML = deck.length;
}

window.addEventListener('load', function () {
    createDeck();
    shuffle();
    createPlayers(1);
});

function bsod() {
    document.getElementById('cheaterimg').style.display = "inline-block";
}