const { ipcRenderer } = require("electron");

// let views = {};
let views = {
  "어릿광대를 보내주오": [
    "저기 한 여인이 서있네<br>낡은 무대 위에",
    "더러운 맨발 헝클인 머리를 하고<br>그 이름은 루시",
    "누가 저 여인을 이곳에<br>내팽개쳐 뒀나",
    "어설픈 몸짓 초라한 행색을 하고<br>바보 같은 루시",
    "희붐하게 밝아오던 별빛<br>하롱하롱 꽃잎 내리던 밤",
    "죽은 나무토막에 온기를 불어넣고<br>가만히 나를 깨웠지요",
    "그는 나를 연주하는 손길<br>그는 나를 춤추게 하는 노래",
    "그를 따라 어두운 골목을 누비며<br>인생의 희락을 알았소",
    "사람들은 우리를 보며 웃네<br>손뼉 치고 때로는 미소 지어주며",
    "어릿광대 그리고 꼭두각시<br>내 심장에 무언가 피어나던 그때",
    "그는 노을 뒤로 스러져<br>별을 따라갔지",
    "아무도 그를 돌보지 않았었기에<br>그이 자신조차",
    "나는 여기 혼자 남겨진<br>낡은 꼭두각시",
    "누군가 나를 그에게 데려다주오<br>어리석은 루시",
    "은빛 현을 또다시 한번<br>나를 위해서 퉁겨주오",
    "나비처럼 그 곁을 날아<br>돌면서 춤을 추던 날들",
    "사람들은 단 한 치 앞도<br>알 수 없어 노래한다지",
    "떨어지는 꽃잎도 알고 있는 걸<br>사람들은 몰라",
    "저기 한 여인이 서있네<br>낡은 무대 위에",
    "꿈속에 보던 천사의 얼굴을 하고<br>춤을 추렴 루시",
    "누가 저 여인을 이곳에<br>내팽개쳐 뒀나",
    "눈물도 없고 슬픔도 모르는 인형<br>노래 하렴 루시",
    "노래해 (노래해)<br>(후 우우우 후 우우우 후 우우 후)",
    "우릴 위해 (우릴 위해)<br>우릴 위해 (우릴 위해)",
  ],
};
let currentView = "어릿광대를 보내주오";
let currentContent = 10;

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
      views[title].forEach((content) => {
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("top__right__view__content");
        if (
          title === currentView &&
          views[title].indexOf(content) === currentContent
        ) {
          contentDiv.classList.add("active");
          toscroll = contentDiv;
        }
        contentDiv.innerHTML = `<span>${content}</span>`;
        contentDiv.addEventListener("click", function () {
          currentView = title;
          currentContent = views[title].indexOf(content);
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
      });
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
