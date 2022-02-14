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
    document.querySelector(".temp").innerText = temp + "°F";
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " mph";
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
    let backgroundImage = fetch(
      `https://api.unsplash.com/search/photos?query=${city}&page=1&per_page=30&client_id=your-key-goes-here`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data.results.forEach((element, key) => {
          // Pick a random image from the array
          imageKey = Math.floor(Math.random() * data.results.length);
          let image = data.results[imageKey].urls.regular;
          document.body.style.backgroundImage = `url(${image})`;
        });
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
