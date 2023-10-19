let result = Object();
const baseUrl = "uno_karten_originaldesign/";
let spielId = Object();

//Button to start a new Game
let newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", async function(){
    await startNewGame();
})
// Modal Dialog for Game Rules
let gameRules = new bootstrap.Modal(document.getElementById('gameRulesModal'));
let gameRulesButton = document.getElementById("gameRulesButton");
gameRulesButton.onclick = function () {
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



    // await initializeGame();

})

function playerCreation() {
    let error = 0;

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
        playerDiv.className = "image-container"
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
        spielId = result.Id; // Get SpielId from the API response
        console.log("New game started with GameID: " + spielId);
        alert("SpielId", spielId);
        console.log(result);
        alert(JSON.stringify(result));

    //distribute cards inside the startGame() so that the players get new cards every time we start a new game
        distributeCards(0, "player_ul1");
        distributeCards(1, "player_ul2");
        distributeCards(2, "player_ul3");
        distributeCards(3, "player_ul4");
        return spielId;
    } else {
        alert("HTTP-Error: " + response.status);
    }
}


function distributeCards(playerId, htmlid) {
    let playerlist = document.getElementById(htmlid);
    let i = 0;

while(playerlist.firstChild){
    playerlist.removeChild(playerlist.firstChild);
}
    while (i < result.Players[playerId].Cards.length) {
        let img = document.createElement("img");
        img.className = "card";
        let cardColor = result.Players[playerId].Cards[i].Color;
        let cardNumber = result.Players[playerId].Cards[i].Value;
        let card = cardColor + cardNumber;
        let cardUrl = `${baseUrl}${card}.png`;
        img.src = cardUrl;
        console.log(result.Players[0].Cards[i]);

        //Karten zur Liste hinzufügen
        const li = document.createElement("li");
        console.log("li: ", li);

        li.appendChild(img);

        //const span = document.createElement("span");
        //console.log("span: ", span);

        //li.appendChild(span);

        playerlist.appendChild(li);

        //span.textContent =
        // result.Players[playerId].Cards[i].Color +
        // " " +
        //result.Players[playerId].Cards[i].Text;
        i++;
    }
}


async function topCard(spielId) {

    // warten auf das promise (alternativ fetch, then notation)

    //const SpielId = 

    const response = await fetch(`https://nowaunoweb.azurewebsites.net/api/game/topCard/${spielId}`, {
        method: 'GET',
        //body: JSON.stringify(playerNames),
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

/*async function initializeGame() {
    try {
        const spielId = await startNewGame(); // Get SpielId from startNewGame() function
        await topCard(spielId); // Pass the SpielId to topCard() function
    } catch (error) {
        // Handle errors that might occur during game initialization.
        console.error(error);
        // Optionally, show an alert or perform other error handling actions.
    }
}*/
