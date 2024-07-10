// Dialog-Klasse mit Callback-Funktion nach dem Schließen
class Dialog {
  dialog;
  closeButton;
  onCloseCallback;

  constructor(content, title) {
    this.dialog = document.createElement("div");
    this.dialog.className = "dialog";
    this.dialog.style.display = "none";
    this.dialog.innerHTML = `
                      <div class="container">
                          <div class="content">
                              <h2>${title}</h2>
                              <p>${content}</p>
                          </div>
                      </div>`;
    document.body.appendChild(this.dialog);

    this.addCloseButton("Schließen");
    this.addEnterKeyHandler();
  }

  addCloseButton(textContent) {
    this.closeButton = document.createElement("button");
    this.closeButton.className =
      "close mdl-button mdl-js-button mdl-js-ripple-effect";
    this.closeButton.textContent = textContent;
    this.closeButton.addEventListener("click", this.close.bind(this));
    this.dialog.querySelector(".content").appendChild(this.closeButton);
  }

  addEnterKeyHandler() {
    document.addEventListener("keypress", (event) => {
      if (event.key === "Enter" && this.dialog.style.display === "block") {
        this.close(); // Schließt den Dialog
      }
    });
  }

  setOnCloseCallback(callback) {
    this.onCloseCallback = callback; // Setzt die Rückruffunktion
  }

  close() {
    if (document.body.contains(this.dialog)) {
      document.body.removeChild(this.dialog);
    }
    if (this.onCloseCallback) {
      this.onCloseCallback(); // Führt den Callback aus, wenn vorhanden
    }
  }

  open() {
    this.dialog.style.display = "flex";
    this.closeButton.focus();
  }
}

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
