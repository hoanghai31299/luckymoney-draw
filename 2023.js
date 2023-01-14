const timeline = gsap.timeline();
timeline
  .to(".wrapper", {
    css: {
      visibility: "visible",
    },
  })
  .from("h1", {
    duration: 1.3,
    y: 40,
    skewY: 22,
    opacity: 0,
  })
  .from(".canvas-wrapper", {
    duration: 1,
    y: 20,
    rotate: 120,
    ease: "back",
    opacity: 0,
  })
  .from("button.spin", {
    duration: 1,
    y: 20,
    scale: 1.2,
    ease: "bounce",
    opacity: 0,
  });

let audio = new Audio("./tick.mp3");
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
};
const prizes = [
  {
    fillStyle: "#8DCBE6",
    text: "10.000 VND",
    size: winwheelPercentToDegrees(40),
  },

  {
    fillStyle: "#FFEA20",
    text: "5.000 VND",
    size: winwheelPercentToDegrees(20),
  },

  {
    fillStyle: "#9DF1DF",
    text: "20.000 VND",
    size: winwheelPercentToDegrees(20),
  },

  {
    fillStyle: "#E3F6FF",
    text: "50.000 VND",
    size: winwheelPercentToDegrees(5),
  },
  {
    fillStyle: "#C97064",
    text: "30.000 VND",
    size: winwheelPercentToDegrees(15),
  },
];
const pointer = document.querySelector(".pointer");
const pointerAnimation = gsap.to(pointer, {
  scale: 1.3,
  duration: 0.5,
  rotate: 360,
  paused: true,
});
const getRandomSpin = () => Math.floor(8 + Math.random() * 10);

const getRandomDuration = () => Math.floor(8 + Math.random() * 5);

const createWeel = () => {
  return new Winwheel({
    canvasId: "luckydraw",
    numSegments: 5,
    lineWidth: 1,
    responsive: true,
    pointerAngle: 90,
    segments: prizes,
    animation: {
      easing: "Power4.out",
      type: "spinToStop", // Type of animation.
      duration: getRandomDuration(), // How long the animation is to take in seconds.
      spins: getRandomSpin(), // The number of complete 360 degree rotations the wheel is to do.
      callbackFinished: "winAnimation()",
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
const winTimeline = gsap.timeline({ paused: true });
const winAnimate = winTimeline
  .to(
    ".prize-noti",
    {
      scale: 1,
      opacity: 1,
      ease: "back",
      duration: 1,
    },
    "start"
  )
  .to(
    ".prize-value",
    {
      visibility: "visible",
      duration: 0.5,
      top: 20,
    },
    "end"
  );

const resetWheel = () => {
  for (let x = 1; x < colourWheel.segments.length; x++) {
    colourWheel.segments[x].fillStyle = prizes[x - 1].fillStyle;
  }
  colourWheel.rotationAngle = 0;
  colourWheel.animation.duration = getRandomDuration();
  colourWheel.animation.spins = getRandomSpin();

  colourWheel.draw();
};

function winAnimation() {
  const winningSegmentNumber = colourWheel.getIndicatedSegmentNumber();

  const winningPrize = colourWheel.getIndicatedSegment();
  for (let x = 1; x < colourWheel.segments.length; x++) {
    colourWheel.segments[x].fillStyle = "gray";
  }

  colourWheel.segments[winningSegmentNumber].fillStyle = "yellow";
  const moneyKey = winningPrize.text.replace(/\D/g, "");
  console.log(moneyKey);
  colourWheel.draw();
  addToHistory(moneyKey);
  document.querySelector(".prize-value").src = money[moneyKey];
  document.querySelector(".prize").innerHTML = `${winningPrize?.text}`;
  winAnimate.play("start");
  window.addEventListener("click", (e) => {
    if (e.target !== document.querySelector(".prize-noti")) {
      winAnimate.reverse();
      pointerAnimation.reverse();
      resetWheel();
    }
  });
}

const btn = document.querySelector(".button.spin");
btn.addEventListener("click", () => {
  pointerAnimation.play();
  colourWheel.startAnimation();
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
    const sttColumn = document.createElement("td");
    const dateColumn = document.createElement("td");
    const prizeColumn = document.createElement("td");
    sttColumn.innerHTML = historyList.indexOf(prize) + 1;
    dateColumn.innerHTML = prize.date;
    prizeColumn.innerHTML = prize.prize;
    row.appendChild(sttColumn);
    row.appendChild(dateColumn);
    row.appendChild(prizeColumn);
    historyContainer.appendChild(row);
    total += parseInt(prize.prize);
  });
  document.querySelector(".total span").innerHTML = total + " VND";
}

const btnHistory = document.querySelector(".button.open-history");
btnHistory.addEventListener("click", () => {
  renderHistory();
  const historyContainer = document.querySelector(".history");
  historyContainer.classList.add("open");
});

const btnCloseHistory = document.querySelector(".button.close-history");
btnCloseHistory.addEventListener("click", () => {
  const historyContainer = document.querySelector(".history");
  historyContainer.classList.remove("open");
});

const btnDeleteHistory = document.querySelector(".button.clear-history");
btnDeleteHistory.addEventListener("click", () => {
  localStorage.removeItem("spinHistory");
  renderHistory();
});
