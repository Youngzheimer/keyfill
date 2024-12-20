const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  // ============================================================

  // 드롭다운 열기
  document.querySelectorAll(".display__select").forEach((select) => {
    select.addEventListener("click", function () {
      ipcRenderer.send("displays");
      select.querySelector(".display__select__inner").style.opacity = 1;
      select.querySelector(".display__select__inner").style.transform =
        "translateY(0)";
      select.querySelector(".display__select__inner").style.pointerEvents =
        "all";
    });

    // 드롭다운 아이템 선택
    select.querySelectorAll(".display__select__item").forEach((option) => {
      option.addEventListener("click", function (event) {
        event.stopPropagation();
        console.log(option.parentElement);
        option.parentElement.style.opacity = 0;
        option.parentElement.style.transform = "translateY(10px)";
        option.parentElement.style.pointerEvents = "none";
        select.querySelector(".display__select__selected").textContent =
          option.textContent;
        select
          .querySelector(".display__select__selected")
          .setAttribute(
            "value",
            option.getAttribute("value") || option.textContent
          );
      });
    });
  });

  // ============================================================

  document
    .querySelector(".bottom__inner__right__startstop")
    .addEventListener("click", function () {
      const fillDisplayID = document
        .getElementById("filldisplayselect")
        .querySelector(".display__select__selected")
        .getAttribute("value");
      const keyDisplayID = document
        .getElementById("keydisplayselect")
        .querySelector(".display__select__selected")
        .getAttribute("value");
      // console.log(fillDisplayID, keyDisplayID);
      if (fillDisplayID === "0" || keyDisplayID === "0") {
        alert("Fill Display와 Key Display를 설정해주세요.");
        return;
      }
      if (fillDisplayID === keyDisplayID) {
        alert("Fill Display와 Key Display를 다르게 설정해주세요.");
        return;
      }
      ipcRenderer.send("show", fillDisplayID, keyDisplayID);
    });

  // ============================================================

  ipcRenderer.on("displays", function (event, displays) {
    const displayList = document.querySelectorAll(".display__select__inner");

    displayList.forEach((displayElement) => {
      displayElement.innerHTML = "";
      displays.forEach((display) => {
        const div = document.createElement("div");
        div.classList.add("display__select__item");
        div.setAttribute("value", display.id);
        div.textContent = `${display.label}: ${display.bounds.width}x${
          display.bounds.height
        }@${Math.round(display.displayFrequency)}hz`;
        div.addEventListener("click", function (event) {
          event.stopPropagation();
          displayElement.style.opacity = 0;
          displayElement.style.transform = "translateY(10px)";
          displayElement.style.pointerEvents = "none";
          displayElement.parentElement.querySelector(
            ".display__select__selected"
          ).textContent = div.textContent;
          displayElement.parentElement
            .querySelector(".display__select__selected")
            .setAttribute("value", div.getAttribute("value"));
        });
        displayElement.appendChild(div);
      });
    });
  });

  // document.getElementById("displays").addEventListener("click", function () {
  //   ipcRenderer.send("displays");
  // });

  // document.getElementById("show").addEventListener("click", function () {
  //   const fillDisplayID = document.getElementById("filldsp").value;
  //   const keyDisplayID = document.getElementById("keydsp").value;
  //   ipcRenderer.send("show", fillDisplayID, keyDisplayID);
  // });

  // document.getElementById("changetext").addEventListener("click", function () {
  //   const content = document.getElementById("text").value;
  //   ipcRenderer.send("changeText", content);
  // });

  // document.getElementById("changetitle").addEventListener("click", function () {
  //   const content = document.getElementById("text").value;
  //   ipcRenderer.send("changeTitle", content);
  // });

  // document.getElementById("outline").addEventListener("click", function () {
  //   ipcRenderer.send("changeOutline");
  // });

  // document
  //   .getElementById("outlineshadow")
  //   .addEventListener("click", function () {
  //     ipcRenderer.send("changeOutlineShadow");
  //   });

  // ipcRenderer.on("displays", function (event, displays) {
  //   console.log(displays);
  //   const displayList = document.getElementById("dsplist");
  //   displayList.innerHTML = "";
  //   displays.forEach((display) => {
  //     const li = document.createElement("li");
  //     li.textContent = `Display ${display.label} (${display.id}): ${
  //       display.bounds.width
  //     }x${display.bounds.height}@${Math.round(display.displayFrequency)}hz`;
  //     displayList.appendChild(li);
  //   });
  // });
});
