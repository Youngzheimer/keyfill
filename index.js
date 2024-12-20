const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("displays").addEventListener("click", function () {
    ipcRenderer.send("displays");
  });

  document.getElementById("show").addEventListener("click", function () {
    const fillDisplayID = document.getElementById("filldsp").value;
    const keyDisplayID = document.getElementById("keydsp").value;
    ipcRenderer.send("show", fillDisplayID, keyDisplayID);
  });

  ipcRenderer.on("displays", function (event, displays) {
    console.log(displays);
    const displayList = document.getElementById("dsplist");
    displayList.innerHTML = "";
    displays.forEach((display) => {
      const li = document.createElement("li");
      li.textContent = `Display ${display.label} (${display.id}): ${
        display.bounds.width
      }x${display.bounds.height}@${Math.round(display.displayFrequency)}hz`;
      displayList.appendChild(li);
    });
  });
});
