var runden = 0;
var Richtig = 0;
var Falsch = 0;
var rechnungen = [];
// Funktion, um eine neue Frage zu stellen
function FrageStellen() {
  if (runden == 10) {
    window.document.location.href =
      "./Ergebniss.html?richtig=" +
      Richtig +
      "&falsch=" +
      Falsch +
      "&zeit=" +
      document.getElementById("Zeit").textContent +
      "&reihe=" +
      GET("reihe") +
      "&reihe2=" +
      GET("reihe2") +
      "&rechnungen=" +
      rechnungen.join(",");
  }
  var zahl1 = GET("reihe");
  var zahl2 = Math.floor(Math.random() * GET("reihe2")) + 0;
  if (Math.random() < 0.5) {
    let temp = zahl1;
    zahl1 = zahl2;
    zahl2 = temp;
  }

  // Setze die Frage in das HTML-Element mit der ID 'frage'
  document.getElementById("frage").innerText = `Was ist ${zahl1} x ${zahl2}?`;
  document.getElementById("antwort").focus();
  return [zahl1, zahl2];
}

var zahlen = FrageStellen();

// Funktion zur Prüfung der Antwort
function fragePruefen(zahl1, zahl2) {
  var antwort = parseFloat(document.getElementById("antwort").value);
  var korrekt = zahl1 * zahl2;
  rechnungen.push(zahl1); // Add the first element of zahlen to rechnungen
  rechnungen.push(zahl2); // Add the second element of zahlen to rechnungen
  runden++;
  if (isNaN(antwort)) {
    var dialog = new Dialog(
      "Bitte geben Sie eine gültige Zahl ein.",
      "Ungültige Eingabe"
    );
    dialog.setOnCloseCallback(() => {
      zahlen = FrageStellen();
    });
    Falsch++;
    rechnungen.push('false');
    dialog.open();
    return false;
  }

  if (antwort === korrekt) {
    var dialog = new Dialog("Richtig!", "Glückwunsch");
    dialog.setOnCloseCallback(() => {
      zahlen = FrageStellen();
    });
    Richtig++;
    rechnungen.push('true');
    dialog.open();
    return true;
  } else {
    Falsch++;
    var dialog = new Dialog(
      `Falsch! Die richtige Antwort ist ${korrekt}.`,
      "Leider falsch"
    );
    dialog.setOnCloseCallback(() => {
      zahlen = FrageStellen();
    });
    rechnungen.push('false');
    dialog.open();
    return false;
  }
}

// Event-Handler zum Prüfen der Antwort
document.getElementById("pruefen").addEventListener("click", function () {
  fragePruefen(zahlen[0], zahlen[1]);
  document.getElementById("antwort").value = ""; // Zurücksetzen des Eingabefelds
});

// Enter-Taste zum Prüfen verwenden
document.getElementById("antwort").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.getElementById("pruefen").click(); // Klickt auf den "Prüfen"-Button
  }
});
//Stopuhr

let timer;
let isRunning = false;
let seconds = 0;
let minutes = 0;

function startTimer() {
  if (!isRunning) {
    timer = setInterval(updateTimer, 1000);
  }
  isRunning = !isRunning;
}

function updateTimer() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
  }
  document.getElementById("Zeit").textContent =
    (minutes < 10 ? "0" + minutes : minutes) +
    ":" +
    (seconds < 10 ? "0" + seconds : seconds);
}

window.addEventListener("load", startTimer);
