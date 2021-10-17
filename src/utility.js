import jwt from 'jsonwebtoken'
const SITE_ROOT = process.env.REACT_APP_SITE_ROOT

const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + formatTime(dateInput);
}

const formatTime = (dateInput) => {
  console.log("Date Input:", dateInput)
  const date = new Date(dateInput);

  const AMPM = date.getHours() >= 12 ? "PM" : "AM";
  return ((date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + " " + AMPM);
}

const formatDateMillisTimeString = (dateInput, timeInput) => {
  let offset = new Date().getTimezoneOffset()

  let hoursOffset = parseInt(Math.abs(offset / 60))
  hoursOffset = hoursOffset < 10 ? "0" + hoursOffset : hoursOffset
  let minutesOffset = Math.abs(offset%60)
  minutesOffset = minutesOffset < 10 ? "0" + minutesOffset : minutesOffset
  const zeroesOffset = hoursOffset + ":" + minutesOffset
  const formattedOffset = offset > 0 ? ("-" + zeroesOffset) : (offset == 0 ?  ("Z" + zeroesOffset) : ("+" + zeroesOffset))

  const date = new Date(dateInput)
  const timeHour = Number(timeInput.substring(0,2))
  const formattedTimeHour = timeHour > 12 ? timeHour-12 : timeHour;
  const time = formattedTimeHour + ":" + timeInput.substring(3,5)
  const AMPM = Number(timeInput.substring(0,2)) >= 12 ? "PM" : "AM"
  return date.getMonth() +1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time + " " + AMPM + " " + formattedOffset
}

const verifyJWT = () => {
  let user = localStorage.getItem('token');
  let decoded;
  if (user) {
    try {
      decoded = jwt.verify(user, process.env.REACT_APP_SECRET_KEY)
    }
    catch (e) {
      console.log("JWT VERIFICATiON ERR: " , e);
      return null;
    }
    return decoded;
  }
  
}

const optionsParticles = {
  "particles": {
    "number": {
      "value": 251,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 11
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 65.59151245828784,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 5,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 174.44323534053805,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 1,
      },
      "repulse": {
        "distance": 107.98866949652357,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
  }

export {formatDate, formatTime, formatDateMillisTimeString, verifyJWT, SITE_ROOT, optionsParticles}
