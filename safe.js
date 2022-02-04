const timeline = gsap.timeline();
timeline
  .to('.wrapper', {
    css: {
      visibility: 'visible',
    },
  })
  .from('h1', {
    duration: 1.3,
    y: 40,
    skewY: 22,
    opacity: 0,
  })
  .from('.canvas-wrapper', {
    duration: 1,
    y: 20,
    rotate: 120,
    ease: 'back',
    opacity: 0,
  })
  .from('button', {
    duration: 1,
    y: 20,
    scale: 1.2,
    ease: 'bounce',
    opacity: 0,
  });

let audio = new Audio('./tick.mp3');
const playSound = () => {
  audio.pause();
  audio.currentTime = 0;
  audio.play();
};

const prizes = [
  {
    fillStyle: '#F15156',
    text: '10.000 VND',
    size: winwheelPercentToDegrees(40),
  },
  {
    fillStyle: '#C97064',
    text: '30.000 VND',
    size: winwheelPercentToDegrees(10),
  },

  {
    fillStyle: '#B5446E',
    text: '25.000 VND',
    size: winwheelPercentToDegrees(15),
  },

  {
    fillStyle: '#FFC07F',
    text: '5.000 VND',
    size: winwheelPercentToDegrees(30),
  },
  {
    fillStyle: '#BA324F',
    text: '50.000 VND',
    size: winwheelPercentToDegrees(5),
  },
];
const pointer = document.querySelector('.pointer');
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
    canvasId: 'luckydraw',
    numSegments: 5,
    lineWidth: 1,
    responsive: true,
    pointerAngle: 90,
    segments: prizes,
    animation: {
      easing: 'Power4.out',
      type: 'spinToStop', // Type of animation.
      duration: getRandomDuration(), // How long the animation is to take in seconds.
      spins: getRandomSpin(), // The number of complete 360 degree rotations the wheel is to do.
      callbackFinished: 'winAnimation()',
      callbackSound: playSound, // Specify function to call when sound is to be triggered.
      soundTrigger: 'pin',
    },
    pins: {
      number: 8,
      outerRadius: 3,
      fillStyle: '#FFCF99',
      strokeStyle: '#FFFFFF',
    },
  });
};

let colourWheel = createWeel();
const winAnimate = gsap.to('.prize-noti', {
  scale: 1,
  opacity: 1,
  ease: 'back',
  duration: 1,
  paused: true,
});

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
    colourWheel.segments[x].fillStyle = 'gray';
  }

  colourWheel.segments[winningSegmentNumber].fillStyle = 'yellow';

  colourWheel.draw();

  document.querySelector('.prize').innerHTML = `${winningPrize?.text}`;
  winAnimate.play();
  window.addEventListener('click', (e) => {
    if (e.target !== document.querySelector('.prize-noti')) {
      winAnimate.reverse();
      pointerAnimation.reverse();
      resetWheel();
    }
  });
}

const btn = document.querySelector('.button');
btn.addEventListener('click', () => {
  pointerAnimation.play();
  colourWheel.startAnimation();
});
