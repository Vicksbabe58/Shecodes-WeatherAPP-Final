function formatDate(timestamp) {
  //calculate the date and time

  let date = new Date(timestamp);
  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];
  let forDate = date.getDate();
  let fullYear = date.getFullYear();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let newDate = `${day}, ${month} ${forDate} ${fullYear} `;
  let newTime = `${hours}:${minutes}`;
  return `${newDate}  ${newTime}`;
}

function displayForecast(response) {
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  days.forEach((day) => {
    forecastHTML =
      forecastHTML +
      ` 
      
              <div class="col-2">
                <div class="weather-forecast-date">${day}</div>
                <img
                  src="http://openweathermap.org/img/wn/04d@2x.png"
                  alt=""
                  width="42"
                />
                <div class="weather-forecast-temps">
                  <span class="weather-forecast-temp-max">18°</span>
                  <span class="weather-forecast-temp-min">12°</span>
                </div>
              </div>

    `;
  });

  forecastHTML = forecastHTML + `</div> `;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  //let apiKey = "6ca604c95283a09c75d6e1f82b1cae7e";
  let apiKey = "c1d20ef03fedeaf4c6fca40d08bodtba";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.lon}&lat=${coordinates.lat}&key=${apiKey}&units=metric`;
  // console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data);
  let cityElement = (document.querySelector("#city").innerHTML =
    response.data.name);
  let temperatureElement = (document.querySelector("#temperature").innerHTML =
    Math.round(response.data.main.temp));
  let descriptionElement = (document.querySelector("#description").innerHTML =
    response.data.weather[0].description);
  let feelsElement = (document.querySelector("#feels").innerHTML = Math.round(
    response.data.main.feels_like
  ));
  let humidityElement = (document.querySelector("#humidity").innerHTML =
    response.data.main.humidity);
  let windElement = (document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  ));
  let dateElement = (document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  ));
  let newIcon = response.data.weather[0].icon;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${newIcon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  celsiusTemp = response.data.main.temp;

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "6ca604c95283a09c75d6e1f82b1cae7e";
  // let apiKey = "c1d20ef03fedeaf4c6fca40d08bodtba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  // let apiUrl = `https:api/shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
  console.log(apiUrl);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

function displayFahrenheitTemp(event) {
  event.preventDefault();
  let fahrenheitTemp = Math.round(celsiusTemp * 9) / 5 + 32;
  // remove the class of celsius link
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let temperatureElement = (document.querySelector("#temperature").innerHTML =
    Math.round(fahrenheitTemp));
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  // add the class of celsius link
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  let temperatureElement = (document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemp));
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemp);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);

let celsiusTemp = null;

search("Awka");
