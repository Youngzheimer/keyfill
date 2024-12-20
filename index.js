const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("displays").addEventListener("click", function () {
    ipcRenderer.send("displays");
  });

  document.getElementById("show").addEventListener("click", function () {
    const fillDisplayID = document.getElementById("filldsp").value;
    const keyDisplayID = document.getElementById("keydsp").value;
    ipcRenderer.send("show", fillDisplayID, keyDisplayID);
  });

  document.getElementById("changetext").addEventListener("click", function () {
    const content = document.getElementById("text").value;
    ipcRenderer.send("changeText", content);
  });

  document.getElementById("changetitle").addEventListener("click", function () {
    const content = document.getElementById("text").value;
    ipcRenderer.send("changeTitle", content);
  });

  document.getElementById("outline").addEventListener("click", function () {
    ipcRenderer.send("changeOutline");
  });

  document
    .getElementById("outlineshadow")
    .addEventListener("click", function () {
      ipcRenderer.send("changeOutlineShadow");
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
