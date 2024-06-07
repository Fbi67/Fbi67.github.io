var reihe = GET("reihe");
var reihe2 = GET("reihe2");
var rechnungen = GET("rechnungen");
var zeit = GET("zeit");
var falsch = GET("falsch");
var richtig = GET("richtig");
var prozent = 10 * (10 - falsch);


window.addEventListener("load", function () {
  document.getElementById("r").innerHTML = richtig;
  document.getElementById("f").innerHTML = falsch;
  document.getElementById("p").innerHTML = prozent + "%";
  document.getElementById("z").innerHTML = zeit;
  document.getElementById(
    "info"
  ).innerHTML = `Es wurde die Reihe ${reihe} * Zufallzahlen 0 bis ${reihe2} gerechnet`;
  var rechDialog;
  var detailButton = document.getElementById("detail");
  detailButton.addEventListener("click", function () {
    rechDialog = new Dialog(displayGroups(rechnungen), "Ergebnis");
    rechDialog.open();
  });
});

function groupPairs(string) {
    let pairs = [];
    // String in Array umwandeln
    let array = string.split(',');
    for (let i = 0; i < array.length; i += 3) {
        pairs.push([array[i], array[i + 1], array[i + 2]]);
    }
    return pairs;
}

function displayGroups(string) {
    let pairs = groupPairs(string);
    let output = pairs.map(
        (pair) => {
            if (pair[2] === 'true') {
                return `<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-icon">check</i>${pair[0]} * ${pair[1]} = ${pair[0] * pair[1]}</span></li>`;
            } else {
                return `<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-icon">close</i>${pair[0]} * ${pair[1]} = ${pair[0] * pair[1]}</span></li>`;
            }
        }
    ).join("\n");

    return `<ul class="demo-list-item mdl-list">${output}</ul>`;
}
