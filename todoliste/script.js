function init() {
    document.getElementById("add").addEventListener("click", add);
  }
  
  function add() {
    var input = document.getElementById("aufgabe").value;
    var list = document.getElementById("todos");
    var li = document.createElement("li");
    var RandomId = generateRandomId();
    li.setAttribute("class", "mdl-list__item");
    li.innerHTML = `
      <span class="mdl-list__item-primary-content">
        ${input}
      </span>
      <span class="mdl-list__item-secondary-action">
        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="${RandomId}">
          <input type="checkbox" id="${RandomId}" class="mdl-checkbox__input"/>
        </label>
      </span>
    `;
    list.insertBefore(li, list.firstChild);
    document.getElementById("aufgabe").value = "";
  }
  
  function generateRandomId() {
    // This function generates a random string that can be used as an id
    return "id-" + Math.random().toString(36).substr(2, 9);
  }
  
  window.addEventListener("DOMContentLoaded", init);
  