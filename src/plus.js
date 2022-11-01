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

function forecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  // console.log(response.data);

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach((forecastDay, index) => {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
      
              <div class="col-2">
                <div class="weather-forecast-date">${forecastDate(
                  forecastDay.time
                )}</div>
                <img
                  src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png"
                 
                  alt=""
                  width="42"
                />
                
                <div class="weather-forecast-temps">
                  <span class="weather-forecast-temp-max">${Math.round(
                    forecastDay.temperature.maximum
                  )}°</span>
                  <span class="weather-forecast-temp-min">${Math.round(
                    forecastDay.temperature.minimum
                  )}°</span> 
                </div>
              </div>

    `;
    }
  });

  forecastHTML = forecastHTML + `</div> `;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  // console.log(coordinates);
  let apiKey = "c1d20ef03fedeaf4c6fca40d08bodtba";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  // console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  // console.log(response.data);

  document.querySelector("#city").innerHTML = response.data.city;

  document.querySelector("#country").innerHTML = response.data.country;

  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.temperature.current
  );

  document.querySelector("#description").innerHTML =
    response.data.condition.description;

  document.querySelector("#feels").innerHTML = Math.round(
    response.data.temperature.feels_like
  );

  document.querySelector("#humidity").innerHTML =
    response.data.temperature.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#date").innerHTML = formatDate(
    response.data.time * 1000
  );
  let newIcon = response.data.condition.icon_url;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", newIcon);
  iconElement.setAttribute("alt", response.data.condition.description);

  celsiusTemp = response.data.temperature.current;

  getForecast(response.data.coordinates);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
function searchLocation(position) {
  let apiKey = "c1d20ef03fedeaf4c6fca40d08bodtba";
  let lon = position.coordinates.longitude;
  let lat = position.coordinates.latitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
}
function search(city) {
  let apiKey = "c1d20ef03fedeaf4c6fca40d08bodtba";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
  // console.log(apiUrl);
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
