let result = Object();

// Modal Dialog for Game Rules
let gameRules = new bootstrap.Modal(document.getElementById('gameRulesModal'));
let button = document.getElementById("gameRulesButton");
button.onclick = function () {
    gameRules.show();
}

const playerNames = [];

// Modalen Dialog öffnen um Namen einzugeben
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();

// formular submit abfangen
document.getElementById('playerNamesForm').addEventListener('submit', async function (evt) {
    console.log("submit works");
    // Formular absenden verhindern
    evt.preventDefault();

    //create the player divs
    playerCreation();

    //start the game
    await startNewGame();

    distributeCards(0, "player_ul1");
    distributeCards(1, "player_ul2");
    distributeCards(2, "player_ul3");
    distributeCards(3, "player_ul4");

})

function playerCreation() {
    let error = 0;

    console.log(
        "Name P1:" + document.getElementById("playerName1").value);
    console.log(
        "Name P2:" + document.getElementById("playerName2").value);
    console.log(
        "Name P3:" + document.getElementById("playerName3").value);
    console.log(
        "Name P4:" + document.getElementById("playerName4").value);

    let playerArray = [
        document.getElementById("playerName1").value,
        document.getElementById("playerName2").value,
        document.getElementById("playerName3").value,
        document.getElementById("playerName4").value,
    ];

    console.log("Spieler: ", playerArray);

    for (let i = 1; i <= 4; i++) {
        const playerName = document.getElementById(`playerName${i}`).value;

        //check if any name field is empty
        if (!playerName[i]) {
            alert("Player name can not be empty, please enter a valid name!");
            playerNames.length = 0;
            return;
        }

        //check if any name fields are the same
        if (playerNames.includes(playerName)) {
            alert("Every name must be different, please enter new names!");
            playerNames.length = 0;
            return;
        }

        //put name in the playerNames array
        playerNames.push(playerName);

        //create div container for every player and append them to myClass
        const playerDiv = document.createElement("div");
        playerDiv.textContent = playerName;
        playerDiv.id = `player${i}`;
        document.getElementById("myPlayersClass").appendChild(playerDiv);

        //create uls for every player and append them to the divs
        const playerUl = document.createElement("ul");
        playerUl.id = `player_ul${i}`;
        document.getElementById(`player${i}`).appendChild(playerUl);
    }

    if (error == 0) {
        console.log("divElementCreation works")
        myModal.hide();
    }
}

async function startNewGame() {
    // hier starten wir gleich den request
    // warten auf das promise (alternativ fetch, then notation)

    const response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
        method: 'POST',
        body: JSON.stringify(playerNames),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });

    // dieser code wird erst ausgeführt wenn fetch fertig ist
    if (response.ok) {
        // wenn http-status zwischen 200 und 299 liegt
        // wir lesen den response body
        result = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
        console.log(result);
        alert(JSON.stringify(result));
    } else {
        alert("HTTP-Error: " + response.status);
    }

}

function distributeCards(playerId, htmlid) {
    let playerlist = document.getElementById(htmlid);
    let i = 0;
    while (i < result.Players[playerId].Cards.length) {
        console.log(result.Players[0].Cards[i]);

        //Karten zur Liste hinzufügen
        const li = document.createElement("li");
        console.log("li: ", li);

        const span = document.createElement("span");
        console.log("span: ", span);

        li.appendChild(span);

        playerlist.appendChild(li);

        span.textContent =
            result.Players[playerId].Cards[i].Color +
            " " +
            result.Players[playerId].Cards[i].Text;
        i++;
    }
}
