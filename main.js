let result = Object();

// Modalen Dialog öffnen um Namen einzugeben
let myModal = new bootstrap.Modal(document.getElementById("playerNames"));
myModal.show();

// nach jeder tasteneingabe im formular überprüfen ob
// 4 eindeutige spielerInnennamen vorhanden sind
document
  .getElementById("playerNamesForm")
  .addEventListener("keyup", function (evt) {
    console.log(evt);
  });

// formular submit abfangen
document
  .getElementById("playerNamesForm")
  .addEventListener("submit",async function (evt) {
    console.log("submit");
    // Formular absenden verhindern
    evt.preventDefault();
    myModal.hide();

    divElementCreation();
    await startNewGame();
  });

const playerNames = [];
function divElementCreation() {
  
  for (let i = 1; i <= 4; i++) {
    const playerName = document.getElementById(`playerName${i}`).value;
    playerNames.push(playerName);
    myModal.show();

    //Div Container für jedes Player erstellen
    const playerDiv = document.createElement("div");
    playerDiv.textContent = playerName;
    playerDiv.id = `player${i}`;
    const playerUl = document.createElement("ul");
    document.getElementById("myClass").appendChild(playerDiv);
    playerUl.id = `player_ul${i}`;
    document.getElementById(`player${i}`).appendChild(playerUl);
  }
}
  


  //Karten pro Spieler austeilen
  function distributeCards(playerId, htmlId) {
    //Alle Karten ausgeben
    playerUl.id = document.getElementById(htmlId);
    //console.log("Alle karten:----------");

    for (let j = 0; j <=4; j++) {
      let i = 0;
      while (i < result.Players[playerId].Cards.length) {
        //console.log(result.Players[0].Cards[i]);

        //Karten zur Liste hinzufügen----
        const li = document.createElement("li");
        //console.log("li: ", li);
        const span = document.createElement("span");
        //console.log("span: ", span);
        playerUl.appendChild(li);

        span.textContent =
          "Card: " +
          result.Players[playerId].Cards[i].Text +
          " " +
          result.Players[playerId].Cards[i].Color;
        i++;
     }
    }
  }


distributeCards(0, "cards_Player2");

distributeCards(playerDiv[1], "cards_Player2");

//


async function startNewGame() {
  // hier starten wir gleich den request
  // warten auf das promise (alternativ fetch, then notation)
  try {
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
      const result = await response.json();
      console.log(result);
      console.log("-----------");
      alert(JSON.stringify(result));
    } else {
      alert("HTTP-Error: " + response.status);
    }
  } catch (error) {
    console.error(error);
  }
}
// hier rufen wir unsere asynchrone funktion auf
