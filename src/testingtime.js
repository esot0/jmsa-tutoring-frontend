const formatDateMillisTimeString = (dateInput, timeInput) => {
	//Date in ms, time in string format "XX:XX" military time
	const date = new Date(dateInput)
	const timeHour = Number(timeInput.substring(0,2))
	const formattedTimeHour = timeHour > 12 ? timeHour-12 : timeHour;
	const time = formattedTimeHour + ":" + timeInput.substring(3,5)
	const AMPM = Number(timeInput.substring(0,2)) >= 12 ? "PM" : "AM"
	return date.getMonth() +1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + time + " " + AMPM
  }
  
print(formatTime)