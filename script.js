let weather = {
  apiKey: "Your key goes here",
  city: "",
  fetchWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=" +
        this.apiKey
    )
      .then((response) => {
        if (!response.ok) {
          console.log("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  },
  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = Math.round(temp) + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText =
      "Wind speed: " + Math.round(speed) + " mph";
    document.querySelector(".weather").classList.remove("loading");
    weather.getBackgroundImage(localStorage.getItem("city"));
    document.querySelector(".search-bar").value = name;
  },
  search: function (name) {
    city = document.querySelector(".search-bar").value;
    localStorage.setItem("city", city);
    this.fetchWeather(city);
  },
  getBackgroundImage: function (city) {
    console.log("running getBackgroundImage");
    fetch(
      `https://api.unsplash.com/search/photos?query=${city}&page=1&per_page=30&client_id=FRV-YYIQmUcBLvg44HVgWvzfZXetydbVMgOizbxzxDo`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let backgroundImages = [];
        data.results.forEach((element, key) => {
          backgroundImages.push(data.results[key].urls.regular);
        });
        imageKey = Math.floor(Math.random() * backgroundImages.length);
        let backgroundImage = backgroundImages[imageKey];
        document.body.style.backgroundImage = `url(${backgroundImage})`;
      });
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.fetchWeather(localStorage.getItem("city") || "Istanbul");
