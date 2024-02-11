
var checkbox = document.getElementById('checkbox');



function speichern(checkbox) {
  localStorage.setItem('Check', String(checkbox))
}


function getItem() {
  const bool_value = (localStorage.getItem('Check') === "true");
  if (bool_value === true) {
    //window.darkMode.toggle();
    speichern(checkbox.checked);
    checkbox.checked = true;
  }
  else {
    window.darkMode.system();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  checkbox.addEventListener("click", async () => {
    if (checkbox.checked == true) {
      await window.darkMode.toggle();
      speichern(checkbox.checked)
    }
    else {
      await window.darkMode.system();

    }
  });
  getItem()
})











