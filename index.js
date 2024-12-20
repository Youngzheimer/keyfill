const { ipcRenderer } = require("electron");

// let views = {};
let views = {};
let currentView = "";
let currentContent = 0;

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

  // KEY FILL 시작

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

  // Views 관리

  function sendTitleContentInfo() {
    if (Object.keys(views).length === 0) {
      ipcRenderer.send("changeTitle", "No View");
      ipcRenderer.send("changeText", "No View");
      return;
    } else if (Object.keys(views).indexOf(currentView) === -1) {
      currentView = Object.keys(views)[0];
      currentContent = 0;
    }
    ipcRenderer.send("changeTitle", currentView);
    ipcRenderer.send("changeText", views[currentView][currentContent]);
  }

  function updateViews() {
    sendTitleContentInfo();
    let toscroll;
    const viewList = document.querySelector(".top__right__views");
    viewList.innerHTML = "";
    for (const title in views) {
      const view = document.createElement("div");
      view.classList.add("top__right__view");
      view.innerHTML = `
      <span class="title">${title}</span>
      `;
      for (let i = 0; i < views[title].length; i++) {
        let content = views[title][i];
        let contentDiv = document.createElement("div");
        contentDiv.classList.add("top__right__view__content");
        if (title === currentView && i === currentContent) {
          contentDiv.classList.add("active");
          toscroll = contentDiv;
        }
        contentDiv.innerHTML = `<span>${content}</span>`;
        contentDiv.addEventListener("click", function () {
          currentView = title;
          currentContent = i;
          sendTitleContentInfo();

          document
            .querySelectorAll(".top__right__view__content")
            .forEach((c) => {
              c.classList.remove("active");
            });
          contentDiv.classList.add("active");

          contentDiv.scrollIntoView({
            behavior: "auto",
            block: "center",
            inline: "nearest",
          });
        });
        view.appendChild(contentDiv);
      }
      // views[title].forEach((content) => {
      //   const contentDiv = document.createElement("div");
      //   contentDiv.classList.add("top__right__view__content");
      //   if (
      //     title === currentView &&
      //     views[title].indexOf(content) === currentContent
      //   ) {
      //     contentDiv.classList.add("active");
      //     toscroll = contentDiv;
      //   }
      //   contentDiv.innerHTML = `<span>${content}</span>`;
      //   contentDiv.addEventListener("click", function () {
      //     currentView = title;
      //     currentContent = views[title].indexOf(content);
      //     sendTitleContentInfo();

      //     document
      //       .querySelectorAll(".top__right__view__content")
      //       .forEach((c) => {
      //         c.classList.remove("active");
      //       });
      //     contentDiv.classList.add("active");

      //     contentDiv.scrollIntoView({
      //       behavior: "auto",
      //       block: "center",
      //       inline: "nearest",
      //     });
      //   });
      //   view.appendChild(contentDiv);
      // });
      viewList.appendChild(view);
    }
    if (toscroll) {
      toscroll.scrollIntoView({
        behavior: "auto",
        block: "center",
        inline: "nearest",
      });
    }
  }

  document.querySelector("#addbutton").addEventListener("click", function () {
    document.querySelector(".addform").classList.add("active");
    updateViews();
  });

  document
    .querySelector("#addform__inner__close")
    .addEventListener("click", function () {
      document.querySelector(".addform").classList.remove("active");
      updateViews();
    });

  document
    .querySelector("#addform__inner__submit")
    .addEventListener("click", function () {
      const title = document.getElementById("addform__inner__name").value;
      const content = document.getElementById("addform__inner__content").value;

      if (title === "" || content === "") {
        alert("제목과 내용을 입력해주세요.");
        return;
      }

      // content 처리
      // 기본적으론 두 줄 기준 분리. 빈 줄 발생 시:
      // 빈 줄이 두 줄의 첫번째인 경우 -> 빈 줄 제거 후 바로 뒷 두 줄부터 다시 시작
      // 빈 줄이 두 줄의 두번째인 경우 -> 빈 줄 앞 문장 내비두고 빈 줄만 제거
      // 두 줄을 합쳐서 <br> 구분 후 한 줄로 만들어서 Array로 저장

      const lines = content.split("\n");
      let newContent = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "") {
          continue;
        }
        if (lines[i + 1] === undefined) {
          newContent.push(lines[i].trim().replace(/\n/g, "").trim());
          i++;
          continue;
        }
        if (lines[i + 1] === "") {
          newContent.push(lines[i].trim().replace(/\n/g, "").trim());
          i++;
          continue;
        }
        newContent.push(
          lines[i].trim().replace(/\n/g, "").trim() +
            "<br>" +
            lines[i + 1].trim().replace(/\n/g, "").trim()
        );
        i++;
      }

      views[title] = newContent;

      updateViews();
    });

  // ============================================================

  // View 키보드 이벤트
  document.addEventListener("keydown", function (event) {
    if (document.activeElement.tagName === "INPUT") {
      return;
    }
    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === " "
    ) {
      if (Object.keys(views).length === 0) {
        return;
      }
      if (Object.keys(views).indexOf(currentView) === -1) {
        currentView = Object.keys(views)[0];
        currentContent = 0;
        sendTitleContentInfo();
        updateViews();
        return;
      }
      if (currentContent < views[currentView].length - 1) {
        currentContent++;
        sendTitleContentInfo();
        updateViews();
        return;
      }
      if (
        Object.keys(views).indexOf(currentView) ===
        Object.keys(views).length - 1
      ) {
        currentView = Object.keys(views)[0];
        currentContent = 0;
        sendTitleContentInfo();
        updateViews();
        return;
      }
      currentView =
        Object.keys(views)[Object.keys(views).indexOf(currentView) + 1];
      currentContent = 0;
      sendTitleContentInfo();
      updateViews();
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      if (Object.keys(views).length === 0) {
        return;
      }
      if (Object.keys(views).indexOf(currentView) === -1) {
        currentView = Object.keys(views)[0];
        currentContent = 0;
        sendTitleContentInfo();
        updateViews();
        return;
      }
      if (currentContent > 0) {
        currentContent--;
        sendTitleContentInfo();
        updateViews();
        return;
      }
      if (Object.keys(views).indexOf(currentView) === 0) {
        currentView = Object.keys(views)[Object.keys(views).length - 1];
        currentContent = views[currentView].length - 1;
        sendTitleContentInfo();
        updateViews();
        return;
      }
      currentView =
        Object.keys(views)[Object.keys(views).indexOf(currentView) - 1];
      currentContent = views[currentView].length - 1;
      sendTitleContentInfo();
      updateViews();
    }
  });

  // ============================================================

  // Outline, Shadow 설정
  document.querySelector("#outline").addEventListener("click", function () {
    ipcRenderer.send("changeOutline");
    document.querySelectorAll(".look").forEach((look) => {
      look.classList.remove("active");
    });
    document.querySelector("#outline").classList.add("active");
  });

  document
    .querySelector("#outlineshadow")
    .addEventListener("click", function () {
      ipcRenderer.send("changeOutlineShadow");
      document.querySelectorAll(".look").forEach((look) => {
        look.classList.remove("active");
      });
      document.querySelector("#outlineshadow").classList.add("active");
    });

  // ============================================================

  // Black Screen
  function toggleBlackScreen() {
    if (document.querySelector("#blackscreen").classList.contains("active")) {
      ipcRenderer.send("blackScreen", false);
      document.querySelector("#blackscreen").classList.remove("active");
    } else {
      ipcRenderer.send("blackScreen", true);
      document.querySelector("#blackscreen").classList.add("active");
    }
  }

  document.querySelector("#blackscreen").addEventListener("click", function () {
    toggleBlackScreen();
  });

  document.addEventListener("keydown", function (event) {
    if (document.activeElement.tagName === "INPUT") {
      return;
    }
    if (
      event.key === "b" ||
      event.key === "B" ||
      event.key === "ㅠ" ||
      event.key === "d" ||
      event.key === "D" ||
      event.key === "ㅇ"
    ) {
      toggleBlackScreen();
    }
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
