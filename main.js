// Modalen Dialog öffnen um Namen einzugeben
let myModal = new bootstrap.Modal(document.getElementById('playerNames'));
myModal.show();


// nach jeder tasteneingabe im formular überprüfen ob
// 4 eindeutige spielerInnennamen vorhanden sind
document.getElementById('playerNamesForm').addEventListener('keyup', function (evt) {
    console.log(evt);

})

// formular submit abfangen
document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    console.log("submit");
    // Formular absenden verhindern
    evt.preventDefault();


    const playerNames = [];
    let error = 0;
    
        for (let i = 1; i <= 4; i++) {
            const playerName = document.getElementById(`playerName${i}`).value;

            if(!playerName[i]){
                alert("Player name can not be empty, please enter a valid name!");
                return;
            }

            if(playerNames.includes(playerName)){
                alert("Every name must be different, please enter new names!");
                return;
            }

            playerNames.push(playerName);

            const playerDiv = document.createElement("div");
            playerDiv.textContent = playerName;
            playerDiv.id = `player${i}`;
            document.getElementById("myClass").appendChild(playerDiv);
        }
    
    if (error == 0) {
        myModal.hide();
    }


    //----------------------------------------------------------------------------------------------------------------------------------

    async function load() {
        // hier starten wir gleich den request
        // warten auf das promise (alternativ fetch, then notation)
        try {
            const response = await fetch("https://nowaunoweb.azurewebsites.net/api/game/start", {
                method: 'POST',
                body: JSON.stringify(playerNames),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                alert(JSON.stringify(result));
            } else {
                alert("HTTP-Error: " + response.status);
            }
        } catch (error) {
            console.error(error);
        }
    }
    // hier rufen wir unsere asynchrone funktion auf
    load();

})
