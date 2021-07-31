import jwt from 'jsonwebtoken'

const SITE_ROOT = process.env.SITE_ROOT
const parseDate = (dateInput) => {
  const date = new Date(dateInput);
  return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + parseTime(dateInput);
}

const parseTime = (dateInput) => {
  const date = new Date(dateInput);
  const AMPM = date.getHours() >= 12 ? "PM" : "AM";
  return ((date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) + ":" + date.getMinutes() + " " + AMPM);
}



const verifyJWT = () => {
  let user = localStorage.getItem('token');
  let decoded;
  if (user) {
    try {
      decoded = jwt.verify(user, process.env.SECRET_KEY)
    }
    catch (e) {
      console.log(e);
      return null;
    }
    return decoded;
  }
  
}

export {parseDate, parseTime,verifyJWT, SITE_ROOT}
