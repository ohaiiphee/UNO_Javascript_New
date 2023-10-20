let result = Object();
let result2 = Object();
let result3 = Object();
let result4 = Object();
const baseUrl = "uno_karten_originaldesign/";
let spielId;
let currentPlayer = Object();

// Modal Dialog for Game Rules
let gameRules = new bootstrap.Modal(document.getElementById("gameRulesModal"));
let button = document.getElementById("gameRulesButton");
button.onclick = function () {
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

    distributeCards(0, "player_ul1");
    distributeCards(1, "player_ul2");
    distributeCards(2, "player_ul3");
    distributeCards(3, "player_ul4");

    //await initializeGame();
    await topCard(spielId);
    // initializeGame();
    //await drawCard(spielId);
    await drawCard(spielId);

    await getCards(spielId, playerName);
  });

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
    spielId = result.Id;
    currentPlayer = result.NextPlayer;
    console.log("Hier ist die SpielId zu finden: "); // Get SpielId from the API response
    console.log(spielId);
    //alert("SpielId", spielId);
    //return spielId;
    //return result;
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
    let img = document.createElement("img");
    let cardColor = result.Players[playerId].Cards[i].Color;
    let cardNumber = result.Players[playerId].Cards[i].Value;
    let card = cardColor + cardNumber;
    let cardUrl = `${baseUrl}${card}.png`;
    img.src = cardUrl;
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

async function topCard(spielId) {
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
    `https://nowaunoweb.azurewebsites.net/api/game/topCard/${spielId}`,
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
    alert(JSON.stringify(result2));
  } else {
    alert("HTTP-Error: " + response.status);
  }
  result2.topCard;
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

async function drawCard(spielId) {
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
      `https://nowaunoweb.azurewebsites.net/api/game/drawCard/${spielId}`,
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
      currentPlayer = result3.NextPlayer;
      addCard(currentPlayer);
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

async function addCard(htmlid, playerId) {
  let playerlist = document.getElementById(htmlid);
  let i = 0;

  while (result.NextPlayer.Cards) {
    let img = document.createElement("img");
    let cardColor = result3.currentPlayer[playerId].Cards[i].Color;
    let cardNumber = result3.currentPlayer[playerId].Cards[i].Value;
    card = cardColor + cardNumber;
    cardUrl = `${baseUrl}${card}.png`;
    img.src = cardUrl;

    const li = document.createElement("li");
    console.log("li: ", li);

    li.appendChild(img);

    playerlist.appendChild(li);
    i++;
  }
}

async function getCards(spielId, playerName) {
  const response = await fetch(
    `https://nowaunoweb.azurewebsites.net/api/game/getCards/${spielId}?playerName=${playerName}`,
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
    playerName = result3.NextPlayer;
    alert(JSON.stringify(result3));
  } else {
    alert("HTTP-Error: " + response.status);
  }
  return result3;
}
