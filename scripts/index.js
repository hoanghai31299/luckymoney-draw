import Setting from "./setting.js";
const audio = new Audio("./tick.mp3");
//animation;
let isSpinning = false;
const timeline = gsap.timeline();
const winTimeline = gsap.timeline({ paused: true });
const winAnimate = winTimeline
  .to(
    ".prize-noti",
    {
      scale: 1,
      opacity: 1,
      ease: "back",
      duration: 0.7,
    },
    "start"
  )
  .to(".blur-bg", {
    visibility: "visible",
    opacity: 1,
    ease: "back",
    duration: 0.2,
  })
  .to(
    ".prize-value",
    {
      visibility: "visible",
      duration: 0.5,
      top: 20,
    },
    "end"
  );
timeline
  .to(
    ".wrapper",
    {
      css: {
        visibility: "visible",
      },
    },
    "start"
  )
  .from("h1", {
    duration: 1.3,
    y: 40,
    skewY: 22,
    opacity: 0,
  })
  .from(
    ".canvas-wrapper",
    {
      duration: 1,
      y: 20,
      rotate: 120,
      ease: "back",
      opacity: 0,
    },
    "createCanvas"
  )
  .from(".button.spin", {
    duration: 1,
    y: 20,
    scale: 1.2,
    opacity: 0,
    ease: "bounce",
  });

const spinTimeline = gsap.timeline({ paused: true });
const spinAnimate = spinTimeline
  .fromTo(
    ".spin-text",
    { y: 0, visibility: "visible", opacity: 1 },
    {
      y: -20,
      visibility: "hidden",
      opacity: 0,
      ease: "back",
      duration: 0.3,
    },
    "start"
  )
  .fromTo(
    ".goodluck-text",
    { visibility: "hidden", opacity: 0, y: 20, duration: 0.5 },
    {
      y: 0,
      visibility: "visible",
      opacity: 1,
      duration: 0.3,
    }
  )
  .to(
    ".pointer",
    {
      scale: 1.3,
      duration: 0.5,
      rotate: 360,
    },
    "<"
  );

const playSound = () => {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
};

const money = {
  10000: "./images/money/10k.png",
  5000: "./images/money/5k.jpg",
  20000: "./images/money/20k.jpg",
  50000: "./images/money/50k.jpg",
  30000: "./images/money/30k.png",
  100000: "./images/money/100k.jpg",
  200000: "./images/money/200k.jpg",
  500000: "./images/money/500k.jpg",
};
function onSaveSetting() {
  colourWheel = createWeel();
  colourWheel.draw();
  const settingContainer = document.querySelector(".modal.setting");
  settingContainer.classList.remove("open");
  timeline.play("createCanvas");
}

//setting prizes
const parentElement = document.querySelector(".setting-prizes");
const settings = new Setting(parentElement, onSaveSetting);
settings.renderSettingUI();

const getRandomSpin = () => Math.floor(8 + Math.random() * 10);

const getRandomDuration = () => Math.floor(8 + Math.random() * 5);

const clickAnywhere = (e) => {
  if (e.target !== document.querySelector(".prize-noti")) {
    winAnimate.reverse();
    spinAnimate.reverse();
    resetWheel();
    isSpinning = false;
    window.removeEventListener("click", clickAnywhere);
  }
};
function winAnimation() {
  const winningSegmentNumber = colourWheel.getIndicatedSegmentNumber();

  const winningPrize = colourWheel.getIndicatedSegment();
  for (let x = 1; x < colourWheel.segments.length; x++) {
    colourWheel.segments[x].fillStyle = "gray";
  }

  colourWheel.segments[winningSegmentNumber].fillStyle = "yellow";
  const moneyKey = winningPrize.text.replace(/\D/g, "");
  colourWheel.draw();
  addToHistory(moneyKey);
  document.querySelector(".prize-value").src = money[moneyKey];
  document.querySelector(".prize").innerHTML = `${winningPrize?.text}`;
  winAnimate.play("start");
  window.addEventListener("click", clickAnywhere);
}

const createWeel = () => {
  console.log("create weel");
  const settingPrize = settings.getSettings();
  const prizes = settingPrize.map((prize) => {
    return {
      text: settings.formatValueToText(prize.value * 1000),
      fillStyle: prize.color,
      size: winwheelPercentToDegrees(prize.rate),
    };
  });
  return new Winwheel({
    canvasId: "luckydraw",
    numSegments: prizes.length,
    lineWidth: 0.5,
    responsive: true,
    pointerAngle: 90,
    segments: prizes,
    animation: {
      easing: "Power4.out",
      type: "spinToStop", // Type of animation.
      duration: getRandomDuration(), // How long the animation is to take in seconds.
      spins: getRandomSpin(), // The number of complete 360 degree rotations the wheel is to do.
      callbackFinished: winAnimation,
      callbackSound: playSound, // Specify function to call when sound is to be triggered.
      soundTrigger: "pin",
    },
    pins: {
      number: 8,
      outerRadius: 3,
      fillStyle: "#FFCF99",
      strokeStyle: "#FFFFFF",
    },
  });
};

let colourWheel = createWeel();

const resetWheel = () => {
  const settingPrize = settings.getSettings();
  const prizes = settingPrize.map((prize) => {
    return {
      text: settings.formatValueToText(prize.value * 1000),
      fillStyle: prize.color,
      size: winwheelPercentToDegrees(prize.rate),
    };
  });
  for (let x = 1; x < colourWheel.segments.length; x++) {
    colourWheel.segments[x].fillStyle = prizes[x - 1].fillStyle;
  }
  colourWheel.rotationAngle = 0;
  colourWheel.animation.duration = getRandomDuration();
  colourWheel.animation.spins = getRandomSpin();

  colourWheel.draw();
};

const btn = document.querySelector(".button.spin");
btn.addEventListener("click", () => {
  if (isSpinning) return;
  spinAnimate.restart(true);
  colourWheel.startAnimation();
  isSpinning = true;
  window["colourWheel"] = colourWheel;
});

function addToHistory(prize) {
  const history = localStorage.getItem("spinHistory") || "[]";
  const date = moment().format("DD/MM, HH:mm");
  const historyList = JSON.parse(history);
  historyList.push({
    date,
    prize,
  });
  localStorage.setItem("spinHistory", JSON.stringify(historyList));
}

function getHistory() {
  const history = localStorage.getItem("spinHistory") || "[]";
  const historyList = JSON.parse(history);
  return historyList;
}

function renderHistory() {
  const historyList = getHistory();
  const historyContainer = document.querySelector(".list table tbody");
  let total = 0;
  historyContainer.innerHTML = "";
  historyList.forEach((prize) => {
    const row = document.createElement("tr");
    const sttColumn = document.createElement("th");
    const dateColumn = document.createElement("td");
    const prizeColumn = document.createElement("td");
    sttColumn.innerHTML = historyList.indexOf(prize) + 1;
    dateColumn.innerHTML = prize.date;
    prizeColumn.innerHTML = settings.formatValueToText(+prize.prize);
    row.appendChild(sttColumn);
    row.appendChild(dateColumn);
    row.appendChild(prizeColumn);
    historyContainer.appendChild(row);
    total += parseInt(prize.prize);
  });
  document.querySelector(".total span").innerHTML =
    settings.formatValueToText(total);
}
let isOpen = false;
const btnExpandControl = document.querySelector(".button.expand-control");
btnExpandControl.addEventListener("click", () => {
  if (isOpen) {
    expandAnimate.reverse();
    isOpen = false;
    return;
  }
  expandAnimate.play("start");
  isOpen = true;
});

const btnHistory = document.querySelector(".button.open-history");
btnHistory.addEventListener("click", () => {
  renderHistory();
  const historyContainer = document.querySelector(".modal.history");
  historyContainer.classList.add("open");
  btnExpandControl.dispatchEvent(new Event("click"));
});

const btnCloseHistory = document.querySelector(".button.close-history");
btnCloseHistory.addEventListener("click", () => {
  const historyContainer = document.querySelector(".modal.history");
  historyContainer.classList.remove("open");
});

const btnDeleteHistory = document.querySelector(".button.clear-history");
btnDeleteHistory.addEventListener("click", () => {
  localStorage.removeItem("spinHistory");
  renderHistory();
});

const btnOpenSetting = document.querySelector(".button.open-setting");
btnOpenSetting.addEventListener("click", () => {
  const settingContainer = document.querySelector(".modal.setting");
  settingContainer.classList.add("open");
  btnExpandControl.dispatchEvent(new Event("click"));
});

const btnCloseSetting = document.querySelector(".button.close-setting");
btnCloseSetting.addEventListener("click", () => {
  const settingContainer = document.querySelector(".modal.setting");
  settingContainer.classList.remove("open");
});

const expandTl = gsap.timeline({ paused: true });
const expandAnimate = expandTl.fromTo(
  ".control-list .button",
  {
    top: -30,
  },
  {
    top: 0,
    duration: 0.5,
    opacity: 1,
    visibility: "visible",
    ease: "back",
    stagger: 0.1,
  },
  "start"
);

const fullScreen = document.querySelector(".button.full-screen");
fullScreen.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullScreen.classList.remove("active");
  } else {
    document.documentElement.requestFullscreen();
    fullScreen.classList.add("active");
  }
  btnExpandControl.dispatchEvent(new Event("click"));
});
