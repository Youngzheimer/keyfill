const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const text = document.querySelectorAll(".text");
  const title = document.querySelectorAll(".title");

  const outlineshadow = document.querySelector(".outlineshadow");
  const outline = document.querySelector(".outline");

  function changeText(content) {
    text.forEach((t) => {
      t.innerHTML = content.replace(/\n/g, "<br>");
    });
  }

  function changeTitle(content) {
    title.forEach((t) => {
      t.innerHTML = content;
    });
  }

  ipcRenderer.on("changeText", (_, content) => {
    changeText(content);
  });

  ipcRenderer.on("changeTitle", (_, content) => {
    changeTitle(content);
  });

  ipcRenderer.on("changeOutline", (_) => {
    outlineshadow.style.display = "none";
    outline.style.display = "block";
  });

  ipcRenderer.on("changeOutlineShadow", (_) => {
    outlineshadow.style.display = "block";
    outline.style.display = "none";
  });
});
