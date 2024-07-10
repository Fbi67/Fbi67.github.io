var runden = 0;
var Richtig = 0;
var Falsch = 0;
var rechnungen = [];

// Funktion, um eine neue Frage zu stellen (Multiplikation)
function FrageStellenMultiplikation() {
  if (runden == 10) {
    window.document.location.href =
      "../Ergebniss.html?richtig=" +
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
      rechnungen.join(",") +
      "&rechenart=Multiplikation";
  }

  var zahl1 = GET("reihe");
  var zahl2 = Math.floor(Math.random() * GET("reihe2")) + 0;

  document.getElementById("frage").innerText = `Was ist ${zahl1} x ${zahl2}?`;
  document.getElementById("antwort").focus();
  return [zahl1, zahl2];
}

var zahlen = FrageStellenMultiplikation();

// Funktion zur Prüfung der Antwort (Multiplikation)
function fragePruefenMultiplikation(zahl1, zahl2) {
  var antwort = parseFloat(document.getElementById("antwort").value);
  var korrekt = zahl1 * zahl2;
  rechnungen.push(`${zahl1},${zahl2}`);

  runden++;
  if (isNaN(antwort)) {
    var dialog = new Dialog("Bitte geben Sie eine gültige Zahl ein.", "Ungültige Eingabe");
    dialog.setOnCloseCallback(() => {
      zahlen = FrageStellenMultiplikation();
    });
    Falsch++;
    rechnungen.push('false');
    dialog.open();
    return false;
  }

  if (antwort === korrekt) {
    var dialog = new Dialog("Richtig!", "Glückwunsch");
    dialog.setOnCloseCallback(() => {
      zahlen = FrageStellenMultiplikation();
    });
    Richtig++;
    rechnungen.push('true');
    dialog.open();
    return true;
  } else {
    Falsch++;
    var dialog = new Dialog(`Falsch! Die richtige Antwort ist ${korrekt}.`, "Leider falsch");
    dialog.setOnCloseCallback(() => {
      zahlen = FrageStellenMultiplikation();
    });
    rechnungen.push('false');
    dialog.open();
    return false;
  }
}

// Event-Handler zum Prüfen der Antwort
document.getElementById("pruefen").addEventListener("click", function () {
  fragePruefenMultiplikation(zahlen[0], zahlen[1]);
  document.getElementById("antwort").value = ""; // Zurücksetzen des Eingabefelds
});

// Enter-Taste zum Prüfen verwenden
document.getElementById("antwort").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    document.getElementById("pruefen").click(); // Klickt auf den "Prüfen"-Button
  }
});

// Stopuhr

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
