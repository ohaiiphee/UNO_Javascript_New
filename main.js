let result = Object();
let topCardResult = Object();
let drawCardResult = Object();
let getCardsResult = Object();

//Shout UNO when only one card left
const unoSound = new Audio(
  "WhatsApp Audio 2023-11-04 um 14.39.10_30ef3f1e.mp3"
);

const winnerSound = new Audio("03 Stronger.m4a");

let selectedColor;
let colorSelectionPromiseResolver;
let chosenCardValue;
let chosenCardColor;
let colorSelectionModal = new bootstrap.Modal(
  document.getElementById("colorSelectionModal")
);

let showSelectedColorModal = new bootstrap.Modal(
  document.getElementById("showSelectedColorModal")
);

const baseUrl = "uno_karten_originaldesign/";

let gameID = Object();
let currentPlayer = Object();
let playerPoints = [];
let playCardResponse = Object();
let playerName;

const playerNames = [];

//-------------- Button to start a new Game --------------------//
let newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", async function () {
  await startNewGame();
});

let unoButton = document.getElementById("uno-button");
unoButton.addEventListener("click", async function () {
  //handleUnoClick(index);
  for (let i = 0; i <= 3; i++) {
    const ul = document.getElementById(`player_ul${i}`); // Get the UL element by its ID
    //const lis = ul.getElementsByTagName("li"); // Get all the LI elements within the UL
    //console.log(lis);
    console.log(ul);

    if (lis.length > 1) {
      alert("You have more than one card, you can´t say uno");
      await addCard(i, `player_ul${i}`);
      await addCard(i, `player_ul${i}`);
    } else if (lis.length === 1) {
      await shoutUNO();
      unoSound.play();
    }
  }
});

//-------------- Modal Dialog for Game Rules --------------------//
let gameRules = new bootstrap.Modal(document.getElementById("gameRulesModal"));
let gameRulesButton = document.getElementById("gameRulesButton");

gameRulesButton.onclick = function () {
  gameRules.show();
};

//-------------- Modalen Dialog for Names --------------------//
let myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

document
  .getElementById("playerNamesForm")
  .addEventListener("submit", async function (evt) {
    evt.preventDefault();

    playerCreation(); //create player divs
    await startNewGame();

    //await showIfActivePlayer();

    await drawPile(gameID);
    await showIfActivePlayer();
    //await showIfActivePlayer();

    //await getCards(gameID, currentPlayer);

    winnerAlert();
  });

//-------------- Create Players --------------------//
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

  //if everything works as intended, no erros --> close modal
  if (error == 0) {
    myModal.hide();
  }
}

async function startNewGame() {
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

  if (response.ok) {
    result = await response.json();
    gameID = result.Id;
    currentPlayer = result.NextPlayer;
    playerPoints = result.Players.map((player) => player.Score);

    await updatePlayerPoints();

    //distribute cards inside the startGame() so that the players get new cards
    //every time we start a new game

    distributeCards(0, "player_ul1");
    distributeCards(1, "player_ul2");
    distributeCards(2, "player_ul3");
    distributeCards(3, "player_ul4");

    //topCard is called here so that it also updates everytime we press new game
    await topCard(gameID);
    //await showIfActivePlayer();

    return gameID;
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

//-------------- Distribute Cards --------------------//
async function distributeCards(playerId, htmlid) {
  let playerlist = document.getElementById(htmlid);
  let i = 0;

  //if there are currently cards already there (ex: if we clicked "New Game"), delete them first
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

    const li = document.createElement("li");
    li.appendChild(img);
    playerlist.appendChild(li);
    i++;
  }
}

//-------------- Create Top Card --------------------//
async function topCard(gameID) {
  const topCardDiv = document.createElement("Div");

  //if topcard img already exists, delete it to replace with new one
  while (topCardDiv.firstChild) {
    topCardDiv.removeChild(topCardDiv.firstChild);
  }

  topCardDiv.className = "topcard-container";

  let img = document.createElement("img");
  let cardColor = result.TopCard.Color;
  let cardNumber = result.TopCard.Value;
  let card = cardColor + cardNumber;
  let cardUrl = `${baseUrl}${card}.png`;
  img.src = cardUrl;

  const li = document.createElement("li");
  li.appendChild(img);

  topCardDiv.appendChild(li);
  document.getElementById("myPlayersClass").appendChild(topCardDiv);

  const response = await fetch(
    `https://nowaunoweb.azurewebsites.net/api/game/topCard/${gameID}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  if (response.ok) {
    topCardResult = await response.json();
    console.log("The Topcard is: "), console.log(topCardResult);
  } else {
    alert("HTTP-Error: " + response.status);
  }

  topCardResult.topCard;
}

//-------------- ClickCard Function for Every Handcard --------------------//
async function clickCard(ev) {
  chosenCardValue = ev.target.cardValue;
  chosenCardColor = ev.target.cardColor;
  if (ev.target.cardValue === 13 || ev.target.cardValue === 14) {
    colorModal();
  } else {
    tryToPlayCard(ev.target.cardValue, ev.target.cardColor);
  }
}

//-------------- Play a Card --------------------//
async function tryToPlayCard(value, color) {
  let wildColor = "";
  let gameID = result.Id;
  //+4 Card --> can only be played if player has no valid color/number cards
  if (value === 13) {
    console.log("this is a +4 card");
    wildColor = selectedColor;
  }

  //Wild Card
  if (value === 14) {
    console.log("this is a Wild Card");
    wildColor = selectedColor;
  }

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
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  playCardResponse = await response.json();
  if (playCardResponse.error) {
    alert("nope can't play that one");
  } else {
    //result.Player = playCardResponse.Player;

    removeCardFromHand(currentPlayer, value, color);
    await updatePlayerCards();
    winnerAlert();

    currentPlayer = playCardResponse.Player;

    //await showIfActivePlayer();

    await updateTopCard();
    await updatePlayerPoints();

    result.NextPlayer = playCardResponse.Player;
    winnerAlert();
  }
  await showIfActivePlayer();
}

//-------------- Remove Card from Player Hand --------------------//
async function removeCardFromHand(currentPlayer, value, color) {
  const playerHandElement = document.getElementById(`${currentPlayer}`);

  if (playerHandElement) {
    const cardImages = playerHandElement.querySelectorAll("li img");

    for (let i = 0; i < cardImages.length; i++) {
      if (
        cardImages[i].cardValue === value &&
        cardImages[i].cardColor === color
      ) {
        cardImages[i].parentNode.remove();
        return; // Exit the loop once the card is found and removed
      }
    }

    //console.log(`Card with value ${value} and color ${color} not found in ${currentPlayer}'s hand.`);
  } else {
    console.log(`Player hand for ${currentPlayer} not found.`);
  }
}

//-------------- Helper Function for URLs --------------------//
async function buildSrcString(color, number) {
  return `${baseUrl}${color + number}.png`;
}

//-------------- Update TopCard --------------------//
async function updateTopCard() {
  const response = await fetch(
    `https://nowaunoweb.azurewebsites.net/api/game/topCard/${gameID}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  if (response.ok) {
    const updatedTopCard = await response.json();
    const topCardDiv = document.querySelector(".topcard-container");

    // Clear the existing top card image (otherwise we'll have 2 or more topCards :D)
    while (topCardDiv.firstChild) {
      topCardDiv.removeChild(topCardDiv.firstChild);
    }

    // Create a new image element for the updated top card
    let img = document.createElement("img");
    let cardColor = updatedTopCard.Color;
    let cardNumber = updatedTopCard.Value;
    let card = cardColor + cardNumber;
    let cardUrl = `${baseUrl}${card}.png`;
    img.src = cardUrl;

    const li = document.createElement("li");
    li.appendChild(img);

    topCardDiv.appendChild(li);
  } else {
    alert("HTTP-Error: " + response.status);
  }
}

//-------------- Draw Pile--------------------//
async function drawPile(gameID) {
  const drawCardDiv = document.createElement("Div");
  drawCardDiv.className = "drawcard-container";

  let img = document.createElement("img");
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
    if (response.ok) {
      drawCardResult = await response.json(); // alternativ response.text wenn nicht json gewünscht ist

      // await showIfActivePlayer();
      currentPlayer = drawCardResult.Player;

      if (currentPlayer == result.Players[0].Player) {
        await addCard(0, "player_ul1");
      } else if (currentPlayer == result.Players[1].Player) {
        await addCard(1, "player_ul2");
      } else if (currentPlayer == result.Players[2].Player) {
        await addCard(2, "player_ul3");
      } else if (currentPlayer == result.Players[3].Player) {
        await addCard(3, "player_ul4");
      }

      currentPlayer = drawCardResult.NextPlayer;
      await showIfActivePlayer();
      await updatePlayerPoints();
    } else {
      alert("HTTP-Error: " + response.status);
    }
  });
}

//-------------- Add a Card To Player's Hand --------------------//
async function addCard(playerId, htmlid) {
  let playerlist = document.getElementById(htmlid);
  let i = 0;

  let img = document.createElement("img");
  let cardColor = drawCardResult.Card.Color;
  let cardNumber = drawCardResult.Card.Value;
  card = cardColor + cardNumber;
  cardUrl = `${baseUrl}${card}.png`;
  img.className = "card";
  img.cardColor = cardColor;
  img.cardValue = cardNumber;
  img.src = cardUrl;

  const li = document.createElement("li");
  li.appendChild(img);
  playerlist.appendChild(li);
  img.addEventListener("click", clickCard, false);

  await updatePlayerCards();
}

//-------------- GetCards Function --------------------//
async function getCards(gameID, playerName) {
  let URL = `https://nowaunoweb.azurewebsites.net/api/game/getCards/${gameID}?playerName=${playerName}`;

  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  if (response.ok) {
    getCardsResult = await response.json();
    const currentPlayerIndex = playerNames.indexOf(playerName);
    const playerHandElement = document.getElementById(
      `player_ul${currentPlayerIndex + 1}`
    );

    if (currentPlayerIndex !== -1) {
      playerPoints[currentPlayerIndex] = getCardsResult.Score;
    }

    if (playerHandElement) {
      // Clear the existing player's hand
      while (playerHandElement.firstChild) {
        playerHandElement.removeChild(playerHandElement.firstChild);
      }

      // Get the current cards for the player and update their hand
      const playerCards = getCardsResult.Cards;
      for (let j = 0; j < playerCards.length; j++) {
        const cardColor = playerCards[j].Color;
        const cardNumber = playerCards[j].Value;
        const card = cardColor + cardNumber;
        const cardUrl = `${baseUrl}${card}.png`;

        const img = document.createElement("img");
        img.className = "card";
        img.cardColor = cardColor;
        img.cardValue = cardNumber;
        img.src = cardUrl;
        img.addEventListener("click", clickCard, false);

        const li = document.createElement("li");
        li.appendChild(img);
        playerHandElement.appendChild(li);
      }
    }

    currentPlayer = getCardsResult.Player;
    await updatePlayerPoints();
    console.log("getCards- "+playerName);
  } else {
    alert("HTTP-Error: " + response.status);
  }
  return getCardsResult;
}

//-------------- Update Player's Points --------------------//
async function updatePlayerPoints() {
  for (let i = 0; i <= 3; i++) {
    const pointsSpanId = `playerPoints${i + 1}`;
    const existingPointsSpan = document.getElementById(pointsSpanId);

    // Check if the points span already exists and remove it
    if (existingPointsSpan) {
      existingPointsSpan.remove();
    }

    const pointsSpan = document.createElement("span");
    pointsSpan.id = pointsSpanId;
    pointsSpan.textContent = `Points: ${playerPoints[i]}`;
    document.getElementById(`player${i + 1}`).appendChild(pointsSpan);
  }
}

//-------------- Helper Function to Update Player Cards --------------------//
/*async function updatePlayerCards() {
  playerNames.forEach((name) => {
    getCards(gameID, name);
  });
  console.log("updatePlayerCards");
}


*/

async function updatePlayerCards() {
  const updatePromises = playerNames.map(async (name) => {
    await getCards(gameID, name);
  });

  await Promise.all(updatePromises);

  console.log("updatePlayerCards");
}

//-------------- Show the Color Selection Modal --------------------//
async function colorModal() {
  colorSelectionModal.show();

  // Create a function to handle color selection and remove the event listener
  function handleColorSelection() {
    selectedColor = document.querySelector('input[name="color"]:checked').value;

    // Remove the event listener to prevent it from being called multiple times
    document
      .getElementById("confirmColorSelection")
      .removeEventListener("click", handleColorSelection);

    // Close the color selection modal
    colorSelectionModal.hide();
    tryToPlayCard(chosenCardValue, chosenCardColor);
    //showChosenColor(selectedColor);
  }

  // Add the event listener for color selection
  document
    .getElementById("confirmColorSelection")
    .addEventListener("click", handleColorSelection);
}

//-------------- Show the Selected Color  Modal --------------------//

async function showChosenColor(color) {
  const modalBody = document.getElementById("showSelectedColorModalBody");
  showSelectedColorModal.show();
  let chosenColorText;

  // Determine the text to display based on the chosen color
  switch (color) {
    case "Red":
      chosenColorText = "Red";
      break;
    case "Blue":
      chosenColorText = "Blue";
      break;
    case "Green":
      chosenColorText = "Green";
      break;
    case "Yellow":
      chosenColorText = "Yellow";
      break;
    default:
      chosenColorText = "Unknown Color";
  }

  // Set the modal body content to display the chosen color
  modalBody.textContent = `${chosenColorText}`;

  // Show the modal window with the chosen color
  const chosenColorModal = new bootstrap.Modal(
    document.getElementById("showSelectedColorModal")
  );
  showSelectedColorModal.show();

  document
    .getElementById("closeMe")
    .addEventListener("click", showSelectedColorModal.hide());
}

function getCurrentPlayerID() {
  for (let i = 0; i <= 3; i++) {
    if (result.NextPlayer === playerNames[i]) {
      return i;
    }
  }
}

async function hidePlayersCards(playerId) {
  const playerHandElement = document.getElementById(`player_ul${playerId + 1}`);
  if (playerHandElement) {
    const cardImages = playerHandElement.querySelectorAll("li img");
    cardImages.forEach((card) => {
      card.src = "uno_karten_originaldesign/back0.png";
      //card.remove(); // Set the back card image source
      //card.classList.remove("hidden");
    });
  }
}

async function showPlayersCards(playerId) {
  //let i = 0;
  const response = await getCards(gameID, currentPlayer);
  //console.log("the get-Response", response);
  for (let i = 1; i <= 4; i++) {
    const playerHandElement = document.getElementById(
      `player_ul${playerId + 1}`
    );

    if (playerHandElement && response) {
      // && response.Cards
      if (playerHandElement) {
        const cardImages = playerHandElement.querySelectorAll("li img");
        cardImages.forEach((card, index) => {
          //card.remove();

          // const cardData = response.Cards[index];
          //card.src = `${baseUrl}${cardData.Color}${cardData.Value}.png`; // Set the correct card image source

          while (i < result.Players[playerId].Cards.length) {
            let cardColor = result.Players[playerId].Cards[i].Color;
            let cardNumber = result.Players[playerId].Cards[i].Value;
            let card = cardColor + cardNumber;
            //let cardUrl = `${baseUrl}${card}.png`;
            //img.src = cardUrl;

            //img.addEventListener("click", clickCard, false);
            //img.cardColor = cardColor;
            //img.cardValue = cardNumber;

            //const li = document.createElement("li");
            // li.appendChild(img);
            // playerlist.appendChild(li);
            card.src = `${baseUrl}${cardColor}${cardNumber}.png`;
            i++;
            // const cardData = response.Cards[index];
          }

          //for (let j = 0; j < card.length; j++) {
          /* const cardColor = card.Color;
        const cardNumber = card.Value;
        const card = cardColor + cardNumber;
        const cardUrl = `${baseUrl}${card}.png`;*/
          //}
          //card.classList.remove("hidden");
          //card.addEventListener("click", function(){
          //tryToPlayCard(cardData.Value, cardData.Color);
          // })
        });
      }
    }
    // await updatePlayerCards();
    //  i++;
  }
}

async function showIfActivePlayer() {
  console.log(
    "Methode aufgerufen, mit currentPlayer :",
    currentPlayer,
    " und mit dem Index: ",
    playerNames.indexOf(currentPlayer)
  );

  let activePlayer = getCurrentPlayerID();

  for (let i = 0; i <= 3; i++) {
    if (i === activePlayer) {
      await showPlayersCards(i);
    } else {
      await hidePlayersCards(i);
    }
  }
}

async function winnerAlert() {
  for (let i = 0; i <= 3; i++) {
    // const playerHandElement = document.getElementById(`player_ul${i}`);
    // console.log(playerHandElement.childNodes.length);
    // const playerName = document.getElementById(`playerName${i}`).value;
    //}

    if (playerPoints[i] === 0) {
      const modal = document.getElementById("customModal");
      const winnerImage = document.getElementById("winnerImage");
      const winnerText = document.getElementById("winnerText");

      // Set winner image source and text
      winnerImage.src = "Download.jpg"; // Replace with the actual URL of the winner's image
      winnerText.innerText = "The winner is " + playerNames[i];
      winnerSound.play();

      // Display the custom modal
      modal.style.display = "block";

      // Close the modal when the user clicks the close button
      const closeBtn = document.getElementsByClassName("close")[0];
      closeBtn.onclick = function () {
        winnerSound.pause();
        winnerSound.currentTime = 0;

        modal.style.display = "none";
      };
      //alert("The winner is " + playerNames[i]);

      return;
      //break;
    }
  }
}

async function shoutUNO() {
  for (let i = 0; i <= 3; i++) {
    const ul = document.getElementById(`player_ul${i}`); // Get the UL element by its ID
    const lis = ul.getElementsByTagName("li"); // Get all the LI elements within the UL

    if (lis.length === 1) {
      if (unoButton) {
        const unoButton = document.getElementById(`uno-button`);
        if (!unoButton.clicked) {
          alert(`Player ${playerNames[i]} did not say UNO, bitch!`);
          await addCard(i, `player_ul${i}`);
          await addCard(i, `player_ul${i}`);
        }
      } else {
        console.log(`UNO button for player ${playerNames[i]} not found.`);
      }
    }

    // Show UNO button for the player with one card left
    // const unoButton = document.getElementById(`unoButtonPlayer${i + 1}`);
    //unoButton.style.display = "block";

    // Handle UNO button click event
    //unoButton.addEventListener("click", async () => {
    // Play UNO sound (assuming you have an audio element with id "unoSound")
    //const unoSound = document.getElementById("unoSound");
    // unoSound.play();
    //});
    // Draw two cards for the player (modify as needed)
    // Hide UNO button after clicking
    // unoButton.style.display = "none";
  }
}
