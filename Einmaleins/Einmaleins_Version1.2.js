

// Globale Variablen werden deklariert, um ihren Zustand während der Ausführung zu verfolgen.
var Reihe = ""; // Multiplikationsreihe, z.B., "2" für die 2er-Reihe.
var Nummer = ""; // Die aktuelle zufällig ausgewählte Nummer für die Multiplikation.
var G = false; // Eine Steuerungsvariable für den Wechsel zwischen der Kontrolle und dem Stellen von Fragen.
var Falsch = 0,
  Richtig = 0; // Zähler für falsche und richtige Antworten.
var Runden = 0; // Zähler für die Anzahl der durchgeführten Runden.
var Nummer2 = 0; // Speichert die vorherige Nummer, um sicherzustellen, dass sie sich nicht wiederholt.
var Reihe2 = 0; // Variable für die maximale Grenze bei der Zufallsauswahl einer Nummer.



function overlay(isactive) {
  if (isactive == true) {
    id("overlay").className = "overlay";
  } else {
    id("overlay").className = "hidden";
  }
}

function errD() {
  overlay(true);
  var f_m = id('m');
  f_m.className = 'message-f'
  id('t').innerHTML = "Falsch!!!";
}

function RD() {
  overlay(true);
  var f_m = id('m');
  f_m.className = 'message-r'
  id('t').innerHTML = "Richtig!!!";

}

id('b').addEventListener('click', () => {
  overlay(false);
  var f_m = id('m');
  f_m.className = 'hidden';
  
  weiter();
});

function ZuErgebniss() {
  
  if (Runden===20) {
      window.document.location.href='./Ergebniss.html?Richtig='+Richtig+'&Falsch='+Falsch+'&Zeit='+document.getElementById('Zeit').textContent;
  }
}

// Funktion, die aufgerufen wird, wenn Enter (keyCode 13) gedrückt wird.
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 13) {
    if (id('overlay').className == 'overlay') {
      overlay(false);
      var f_m = id('m');
      f_m.className = 'hidden';
      weiter();
    }
    else {weiter();} // Die Funktion "weiter" wird aufgerufen.
  }
});

// Hauptfunktion für den Wechsel zwischen der Kontrolle und dem Stellen von Fragen.
function weiter() {
  Runden++;
  ZuErgebniss();
  if (G == false) {
    Kontrolle(); // Wenn G falsch ist, wird die Kontrolle aufgerufen.
    G = true; // G wird auf true gesetzt, um beim nächsten Mal die Frage zu stellen.
  } else {
    FrageStellen(); // Wenn G true ist, wird eine neue Frage gestellt.
    G = false; // G wird auf false gesetzt, um beim nächsten Mal die Kontrolle durchzuführen.
  }
}

// Funktion zum Stellen einer neuen Multiplikationsfrage.
function FrageStellen() {
  Reihe = GET("Reihe"); // Die Multiplikationsreihe wird aus den GET-Parametern geholt.
  Reihe2 = GET("Reihe2"); // Die maximale Grenze für die Zufallsauswahl wird ebenfalls geholt.
  do {
    Nummer = Math.floor(Math.random() * Reihe2) + 1; // Zufällige Nummer wird ausgewählt.
  } while (Nummer == Nummer2); // Solange die Nummer gleich der vorherigen Nummer ist, wird eine neue Nummer ausgewählt.
  Nummer2 = Nummer; // Die aktuelle Nummer wird für den nächsten Vergleich gespeichert.

  id("Antwort").value = ""; // Das Antwortfeld wird zurückgesetzt.
  id("Anzeige").innerHTML = "Was gibt " + Reihe + "*" + Nummer; // Die Frage wird im HTML-Dokument angezeigt.
  id('Antwort').focus();
}

// Funktion, die vorerst leer ist und dazu dient, die Benutzerantwort zu überprüfen.
function Kontrolle() {
  
  var antwortValue = parseInt(id("Antwort").value);
  if (antwortValue == parseInt(Reihe) * parseInt(Nummer)) {
    RD();
    Richtig++
  } else {
    errD();
    Falsch++;
  }

  // Possibly commented out code for additional functionality
  //message.overlay(true);
}

// Hilfsfunktion zum Abrufen von DOM-Elementen anhand ihrer ID.
function id(id) {
  return window.document.getElementById(id);
}

// Funktion zum Abrufen von GET-Parametern aus der URL.
function GET(Variablenname) {
  var Info = window.location.search.substring(1, window.location.search.length);
  var SuchListe = Info.split("&");
  for (var i = 0; i < SuchListe.length; i++) {
    var Index = SuchListe[i].indexOf("=");
    var Eigenschaft = SuchListe[i].substring(0, Index);
    var Wert = SuchListe[i].substring(Index + 1, SuchListe[i].length);
    if (Eigenschaft == Variablenname) {
      return unescape(Wert);
    }
  }
  return null;
}

//Stopuhr

let timer;
let isRunning = false;
let seconds = 0;
let minutes = 0;
let hours = 0;

function startTimer() {
    if (!isRunning) {
        timer = setInterval(updateTimer, 1000);
        document.getElementById('startButton').textContent = 'Stop';
    } 
    isRunning = !isRunning;
}

function updateTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    document.getElementById('Zeit').textContent = 
        (hours < 10 ? '0' + hours : hours) + ':' + 
        (minutes < 10 ? '0' + minutes : minutes) + ':' + 
        (seconds < 10 ? '0' + seconds : seconds);
}

window.addEventListener("load", startTimer);