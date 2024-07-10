var reihe = GET("reihe");
var reihe2 = GET("reihe2");
var rechnungen = GET("rechnungen");
var zeit = GET("zeit");
var falsch = GET("falsch");
var richtig = GET("richtig");
var rechenart = GET("rechenart"); // Neue Variable für die Rechenart
var prozent = 10 * (10 - falsch);

window.addEventListener("load", function () {
  document.getElementById("r").innerHTML = richtig;
  document.getElementById("f").innerHTML = falsch;
  document.getElementById("p").innerHTML = prozent + "%";
  document.getElementById("z").innerHTML = zeit;
  var rechDialog;
  var detailButton = document.getElementById("detail");
  detailButton.addEventListener("click", function () {
    rechDialog = new Dialog(displayGroups(rechnungen, rechenart), "Ergebnis");
    rechDialog.open();
  });
});

// Funktion zum Abrufen von URL-Parametern
function GET(param) {
  var url = new URL(window.location.href);
  return url.searchParams.get(param);
}

function groupPairs(string) {
  let pairs = [];
  // String in Array umwandeln
  let array = string.split(",");
  for (let i = 0; i < array.length; i += 3) {
    pairs.push([array[i], array[i + 1], array[i + 2]]);
  }
  return pairs;
}

function displayGroups(string, rechenart) {
  let pairs = groupPairs(string);
  let output = pairs
    .map((pair) => {
      let operator;
      let result;

      switch (rechenart) {
        case "Addition":
          operator = "+";
          result = parseFloat(pair[0]) + parseFloat(pair[1]);
          break;
        case "Subtraktion":
          operator = "-";
          result = parseFloat(pair[0]) - parseFloat(pair[1]);
          break;
        case "Multiplikation":
          operator = "x";
          result = parseFloat(pair[0]) * parseFloat(pair[1]);
          break;
        case "Division":
          operator = "÷";
          result = parseFloat(pair[0]) / parseFloat(pair[1]);
          break;
        default:
          operator = "?";
          result = "?";
      }

      if (pair[2] === "true") {
        return `<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-icon">check</i>${pair[0]} ${operator} ${pair[1]} = ${result}</span></li>`;
      } else {
        return `<li class="mdl-list__item"><span class="mdl-list__item-primary-content"><i class="material-icons mdl-list__item-icon">close</i>${pair[0]} ${operator} ${pair[1]} = ${result}</span></li>`;
      }
    })
    .join("\n");
  let operator;

  switch (rechenart) {
    case "Addition":
      operator = "+";
      break;
    case "Subtraktion":
      operator = "-";
      break;
    case "Multiplikation":
      operator = "x";
      break;
    case "Division":
      operator = "÷";
      break;
    default:
      operator = "?";
  }
  document.getElementById(
    "info"
  ).innerHTML = `Es wurde die ${rechenart} ${reihe} ${operator} Zufallzahlen 0 bis ${reihe2} gerechnet`;
  document.getElementById("a").setAttribute("href", "../../"+rechenart.toLowerCase()+
  return `<ul class="demo-list-item mdl-list">${output}</ul>`;
}
