let result = Object();
let result2 = Object();
let result3 = Object();
let result4 = Object();
const baseUrl = "uno_karten_originaldesign/";
let gameID = Object();
let currentPlayer = Object();
let playerPoints = [];
let playCardResponse = Object();
let playerName;
//Button to start a new Game
let newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", async function () {
  await startNewGame();
})

// Modal Dialog for Game Rules
let gameRules = new bootstrap.Modal(document.getElementById("gameRulesModal"));
let gameRulesButton = document.getElementById("gameRulesButton");
gameRulesButton.onclick = function () {
  gameRules.show();
};

const playerNames = [];

// Modalen Dialog öffnen um Namen einzugeben
let myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

// formular submit abfangen
document
  .getElementById("playerNamesForm")
  .addEventListener("submit", async function (evt) {
    console.log("submit works");
    // Formular absenden verhindern
    evt.preventDefault();

    //create the player divs
    playerCreation();

    //start the game
    await startNewGame();
    //await initializeGame();
    await topCard(gameID);
    // initializeGame();
    //await drawCard(spielId);
    await drawCard(gameID);

   //await getCards(gameID, playerName);
  });

function playerCreation() {
  let error = 0;

  for (let i = 1; i <= 4; i++) {
    const playerName = document.getElementById(`playerName${i}`).value;

    //check if any name field is empty
    if (!playerName) {
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
    playerDiv.className = "image-container";
    document.getElementById("myPlayersClass").appendChild(playerDiv);

    //create uls for every player and append them to the divs
    const playerUl = document.createElement("ul");
    playerUl.id = `player_ul${i}`;
    document.getElementById(`player${i}`).appendChild(playerUl);
  }

  if (error == 0) {
    console.log("divElementCreation works");
    myModal.hide();
  }
}

async function startNewGame() {
  // hier starten wir gleich den request
  // warten auf das promise (alternativ fetch, then notation)

  const response = await fetch(
    "https://nowaunoweb.azurewebsites.net/api/game/start",
    {
      method: "POST",
      body: JSON.stringify(playerNames),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  // dieser code wird erst ausgeführt wenn fetch fertig ist
  if (response.ok) {
    // wenn http-status zwischen 200 und 299 liegt
    // wir lesen den response body
    result = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
    //SpielId hier in der globalen Variabel speichern
    gameID = result.Id;
    currentPlayer = result.NextPlayer;
    playerPoints = result.Players.map((player) => player.Score);
    console.log("New game started with GameID: " + gameID); // Get SpielId from the API response
    //alert("SpielId", spielId);
    //return spielId;
    //return result;
    console.log(result);

    for (let i = 0; i <= 3; i++) {
      const pointsSpan = document.createElement("span");
      pointsSpan.id = `playerPoints${i + 1}`;
      pointsSpan.textContent = `Points: ${playerPoints[i]}`; // Initialize points based on the API response
      document.getElementById(`player${i + 1}`).appendChild(pointsSpan);
    }
    console.log(playerPoints);
    //alert(JSON.stringify(result));
    distributeCards(0, "player_ul1");
    distributeCards(1, "player_ul2");
    distributeCards(2, "player_ul3");
    distributeCards(3, "player_ul4");
    return gameID;
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

function distributeCards(playerId, htmlid) {
  let playerlist = document.getElementById(htmlid);
  let i = 0;

  while (playerlist.firstChild) {
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

    img.addEventListener("click", clickCard, false);
    img.cardColor = cardColor;
    img.cardValue = cardNumber;
    //console.log(result.Players[0].Cards[i]);

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

async function topCard(gameID) {
  //let topcard = result2.TopCard;
  const topCardDiv = document.createElement("Div");
  topCardDiv.className = "topcard-container";

  let img = document.createElement("img");
  let cardColor = result.TopCard.Color;
  let cardNumber = result.TopCard.Value;
  //let cardNumber = result2.TopCard[spielId].Value;
  let card = cardColor + cardNumber;
  let cardUrl = `${baseUrl}${card}.png`;
  img.src = cardUrl;

  const li = document.createElement("li");
  console.log("li: ", li);
  li.appendChild(img);

  topCardDiv.appendChild(li);
  document.getElementById("myPlayersClass").appendChild(topCardDiv);

  const response = await fetch(
    `https://nowaunoweb.azurewebsites.net/api/game/topCard/${gameID}`,
    {
      method: "GET",
      //body: JSON.stringify(playerNames),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  // dieser code wird erst ausgeführt wenn fetch fertig ist
  if (response.ok) {
    // wenn http-status zwischen 200 und 299 liegt
    // wir lesen den response body
    result2 = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
    console.log("The Topcard is: "), console.log(result2);
    //alert(JSON.stringify(result2));
  } else {
    alert("HTTP-Error: " + response.status);
  }
  result2.topCard;
}

async function clickCard(ev) {
  console.log(ev);
  tryToPlayCard(ev.target.cardValue, ev.target.cardColor);
}

async function tryToPlayCard(value, color) {
  let wildColor = "";
  let gameID = result.Id;
  let URL =
    "https://nowaunoweb.azurewebsites.net/api/Game/PlayCard/" +
    gameID +
    "?value=" +
    value +
    "&color=" +
    color +
    "&wildColor=" +
    wildColor;

  const response = await fetch(URL, {
    method: "PUT",
    //body: JSON.stringify(playerNames),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  playCardResponse = await response.json();
  // dieser code wird erst ausgeführt wenn fetch fertig ist
  if (playCardResponse.error) {
    alert("nope can't play that one");
  } else {
    // alternativ response.text wenn nicht json gewünscht ist
    removeCardFromHand(currentPlayer, value, color);
    currentPlayer = playCardResponse;
    console.log("The current player is:");
    console.log(currentPlayer);
  }
}

async function removeCardFromHand(currentPlayer, value, color) {
  const playerHandElement = document.getElementById(`${currentPlayer}`);

  if (playerHandElement) {
    let expectedSrc = buildSrcString(color, value);

    const cardImages = playerHandElement.querySelectorAll("li img");

    for (const cardImage of cardImages) {
      if (cardImage.cardValue === value && cardImage.cardColor === color) {
        // Remove the card image from the player's hand
        cardImage.parentNode.remove();
        console.log(
          `Removed card with value ${value} and color ${color} from ${currentPlayer}'s hand.`
        );
        return; // Exit the loop once the card is found and removed.
      }
    }

    console.log(
      `Card with value ${value} and color ${color} not found in ${currentPlayer}'s hand.`
    );
  } else {
    console.log(`Player hand for ${currentPlayer} not found.`);
  }
}

function buildSrcString(color, number) {
  return `${baseUrl}${color + number}.png`;
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

async function drawCard(gameID) {
  const drawCardDiv = document.createElement("Div");
  drawCardDiv.className = "drawcard-container";

  let img = document.createElement("img");
  //let cardUrl = `${baseUrl}${back0}.png`;

  img.src = "uno_karten_originaldesign/back0.png";

  const li = document.createElement("li");
  li.appendChild(img);
  drawCardDiv.appendChild(li);
  document.getElementById("myPlayersClass").appendChild(drawCardDiv);

  drawCardDiv.addEventListener("click", async function () {
    const response = await fetch(
      `https://nowaunoweb.azurewebsites.net/api/game/drawCard/${gameID}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    // dieser code wird erst ausgeführt wenn fetch fertig ist
    if (response.ok) {
      // wenn http-status zwischen 200 und 299 liegt
      // wir lesen den response body
      result3 = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
      console.log("The drawcard is: ", result3);
      alert(JSON.stringify(result3));

      currentPlayer = result3.Player;

      if (currentPlayer == result.Players[0].Player ) {
        await addCard(0, "player_ul1");
      } else if (currentPlayer == result.Players[1].Player) {
         await addCard(1, "player_ul2");
      } else if (currentPlayer == result.Players[2].Player) {
        await addCard(2, "player_ul3");
      } else if (currentPlayer == result.Players[3].Player) {
        await addCard(3, "player_ul4");
      }

      //currentPlayer = result3.NextPlayer;

      //addCard(currentPlayer, `player_ul${currentPlayer.Index + 1}`);
      //ChatGBT-version
      //return result3;
    } else {
      alert("HTTP-Error: " + response.status);
    }
  });
}

/*let drawCardButton = document.getElementById("drawButton");

    drawCardButton.innerHTML =
*/

async function addCard(playerId, htmlid) {
  let playerlist = document.getElementById(htmlid);
  let i =0;
  //let playerDrawCard = result3.Player;

  //while(playerDrawCard == result.Players[playerId]){

  while (i < result.Players[playerId].Cards.length) {

  let img = document.createElement("img");
  let cardColor = result.Players[playerId].Cards[i].Color;
  let cardNumber = result.Players[playerId].Cards[i].Value;
  card = cardColor + cardNumber;
  cardUrl = `${baseUrl}${card}.png`;
  img.src = cardUrl;

  const li = document.createElement("li");
  console.log("li: ", li);

  li.appendChild(img);

  playerlist.appendChild(li);
  //}
  i++;
}
}

/*async function getCards(gameID, playerName) {
  const response = await fetch(
    `https://nowaunoweb.azurewebsites.net/api/game/getCards/${gameID}?playerName=${playerName}`,
    {
      method: "GET",
      //body: JSON.stringify(playerNames),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  // dieser code wird erst ausgeführt wenn fetch fertig ist
  if (response.ok) {
    // wenn http-status zwischen 200 und 299 liegt
    // wir lesen den response body
    result4 = await response.json(); // alternativ response .text wenn nicht json gewünscht ist
    console.log("the card is: "), console.log(result3);
    playerName = result4.NextPlayer;
    alert(JSON.stringify(result3));
  } else {
    alert("HTTP-Error: " + response.status);
  }
  return result3;
}
*/