let result = Object();

async function startNewGame() {
  // hier starten wir gleich den request
  // warten auf das promise (alternativ fetch, then notation)
  let response = await fetch(
    "https://nowaunoweb.azurewebsites.net/api/game/start",
    {
      method: "POST",
      body: JSON.stringify(["player 1", "Player 2", "Player 3", "Player 4"]),
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
    console.log(result);
    alert(JSON.stringify(result));
  } else {
    alert("HTTP-Error: " + response.status);
  }
}
// hier rufen wir unsere asynchrone funktion auf

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
  .addEventListener("submit", function (evt) {
    console.log("submit");
    // Formular absenden verhindern
    evt.preventDefault();
    myModal.hide();

    console.log(
      "Name P1:" + document.getElementById("playerName1").value + "'"
    );
    console.log(
      "Name P2:" + document.getElementById("playerName2").value + "'"
    );
    console.log(
      "Name P3:" + document.getElementById("playerName3").value + "'"
    );
    console.log(
      "Name P4:" + document.getElementById("playerName4").value + "'"
    );

    let playerArray = [
      document.getElementById("playerName1").value,
      document.getElementById("playerName2").value,
      document.getElementById("playerName3").value,
      document.getElementById("playerName4").value,
    ];
    console.log("Spieler: ", playerArray);
    console.log(document.getElementsByClassName("modal-body")[0]);

    //Aufgabe 2: alle Player als Liste im Browser darstellen

    let spielerListe = document.getElementById("spielerListe");
    console.log(spielerListe);

    for (const einPlayer of playerArray) {
      const li = document.createElement("li");
      spielerListe.appendChild(li);

      li.textContent = einPlayer;
    }

    //spielerListe.removeChild();

    let playerliste_html_ul = document.getElementById("spielerListe");

    playerArray.forEach((ein_player_name) => {
      const li = document.createElement("li");
      console.log("li: ", li);
      const span = document.createElement("span");
      console.log("span: ", span);

      li.appendChild(span);
      playerliste_html_ul.appendChild(li);

      span.textContent = ein_player_name;

      //neues Spiel starten
      startNewGame();

      playerliste_html_ul = document.getElementById("spielerListe");
      console.log("Alle Karten:------------");
      let i = 0;
      while (i < result.Players[0].Cards.length) {
        console.log(result.Players[0].Cards[i]);
        i++;
        //Karten zur Liste hinzufügen
        const li = document.createElement("li");
        console.log("li: ",li);
        const span = document.createElement("span");
        console.log("span: ", span);
        li.appendChild(span);
        playerliste_html_ul.appendChild(li);
        span.textContent=result.Players[0].Cards[i].Color+" "+result.Players[0].Cards[i].Text;
      }
    });
  });
