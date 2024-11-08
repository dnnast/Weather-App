import "./style.css";
import "./reset.css";
import "./inputRangeStyle.css";
import "./searchField.css";

const searchBtn = document.getElementById("search-btn");
const searchCity = document.getElementById("search-city");
const headerContent = document.getElementById("header-content");

const sidebarBTNs = document.getElementById("sidebar");
const sidebarBtnItems = document.querySelectorAll(".sidebar-items");

const weatherContainer = document.getElementById("main-container");

// create DOM elements for slider-container
const sliderContainer = document.createElement("div");
sliderContainer.id = "slider-container";

const slider = document.createElement("input");
slider.id = "slider";
slider.type = "range";
slider.min = "5";
slider.max = "23";
slider.step = "3";

const datalist = `
            <datalist id="temperature">
                <option value="5" label="5:00 AM"></option>
                <option value="8" label="8:00 AM"></option>
                <option value="11" label="11:00 AM"></option>
                <option value="14" label="2:00 PM"></option>
                <option value="17" label="5:00 PM"></option>
                <option value="20" label="8:00 PM"></option>
                <option value="23" label="11:00 PM"></option>
            </datalist>
    `;

let fragmentFromString = function (strHTML) {
    return document.createRange().createContextualFragment(strHTML);
};
const datalistHTML = fragmentFromString(datalist);

// variables for storing weather and date information
let time = 5;
let date = 0;
let weatherData;

// ----------------------- CREATE URL ----------------------------------------------
function createURL(city) {
    const urlStart =
        "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
    const urlEnd = "?key=7ALLJ5Y2V62DWF4B8H42DBS9P";

    return urlStart + city.toLowerCase() + urlEnd;
}

// ----------------------- API CALL -----------------------------------------------
async function getData(city) {
    try {
        const response = await fetch(createURL(city), { mode: "cors" });
        const weather = await response.json();

        return weather;
    } catch (error) {
        console.log("City Not Found");
    }
}

// ------------------------ HELPER FUNCTIONS ---------------------------------------
function addDatesToSidebar(days) {
    for (let i = 0; i < 7; i++) {
        const { month, dayMonth, dayWeek } = dateFormat(days[i].datetime);

        sidebarBtnItems[i].innerText = `${month} ${dayMonth}\n${dayWeek}`;
    }
}

function dateFormat(date) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dateFormatted = new Date(date);

    const dayMonth = dateFormatted.getDate();
    const dayWeek = days[dateFormatted.getDay()];
    const month = months[dateFormatted.getMonth()];

    return { month, dayMonth, dayWeek };
}

function getCurrTime() {
    const time = new Date();
    const hour = parseInt(time.getHours());
    const hours = [5, 8, 11, 14, 17, 20, 23];

    for (let i = 0; i < hours.length; i++) {
        if (hour <= hours[i]) {
            return hours[i];
        }
    }

    return 23;
}

function fahrenheitToCelsius(fahrenheit) {
    let celsius = ((fahrenheit - 32) * 5) / 9;
    return Math.round(celsius);
}

function timePmOrAm(time) {
    if (time < 12) {
        return `${time}:00 AM`;
    }
    return `${time - 12}:00 PM`;
}

// ---------------------- DOM MANIPULATION -----------------------------------------
function showWeather(weatherData, date, time) {
    slider.value = time;
    const currWeatherInfo = weatherData.days[date].hours[time];

    weatherContainer.innerHTML = `
                                    <div id="current-weather-container">
                                        <div id="temp-container" class="weather-container-item">
                                            <p id="temp">${fahrenheitToCelsius(
                                                currWeatherInfo.temp
                                            )}</p><p id="celcius">℃</p>
                                        </div>

                                        <div id="time-weather-container" class="weather-container-item">
                                            <p id="time-weather">${timePmOrAm(time)}, ${
        currWeatherInfo.conditions
    }</p>
                                        </div> 
                                    </div>

                                    <div id="icon-container">
                                        <img id="weather-icon" src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/2nd%20Set%20-%20Color/${
                                            currWeatherInfo.icon
                                        }.svg">
                                    </div>

                                    

                                    <div id="additional-details-container">
                                        <div id="precip-container" class="weather-container-item">                
                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M96 320c-53 0-96-43-96-96c0-42.5 27.6-78.6 65.9-91.2C64.7 126.1 64 119.1 64 112C64 50.1 114.1 0 176 0c43.1 0 80.5 24.3 99.2 60c14.7-17.1 36.5-28 60.8-28c44.2 0 80 35.8 80 80c0 5.5-.6 10.8-1.6 16c.5 0 1.1 0 1.6 0c53 0 96 43 96 96s-43 96-96 96L96 320zm-6.8 52c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3l0 3c0 26.5-21.5 48-48 48s-48-21.5-48-48l0-3c0-8.5 2.1-16.9 6.2-24.3L89.2 372zm160 0c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3l0 3c0 26.5-21.5 48-48 48s-48-21.5-48-48l0-3c0-8.5 2.1-16.9 6.2-24.3L249.2 372zm124.9 64.6L409.2 372c1.3-2.5 3.9-4 6.8-4s5.4 1.5 6.8 4l35.1 64.6c4.1 7.5 6.2 15.8 6.2 24.3l0 3c0 26.5-21.5 48-48 48s-48-21.5-48-48l0-3c0-8.5 2.1-16.9 6.2-24.3z"/></svg>
                                            <p id="precip"> ${
                                                currWeatherInfo.precipprob
                                            }% Prexipitation</p>
                                        </div>

                                        <div id="wind-container" class="weather-container-item">                
                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M288 32c0 17.7 14.3 32 32 32l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128c-17.7 0-32 14.3-32 32s14.3 32 32 32l320 0c53 0 96-43 96-96s-43-96-96-96L320 0c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32l32 0c53 0 96-43 96-96s-43-96-96-96L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32zM128 512l32 0c53 0 96-43 96-96s-43-96-96-96L32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/></svg>
                                            <p id="wind"> ${currWeatherInfo.windspeed} km/h Wind</p>
                                        </div>

                                        <div id="humidity-container" class="weather-container-item">
                                            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0l1.8 0c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg>
                                            <p id="humidity"> ${
                                                currWeatherInfo.humidity
                                            }% Humidity</p>                                    
                                        </div>
                                    </div>
                                 `;

    console.log(weatherData);

    weatherContainer.appendChild(sliderContainer);

    sliderContainer.appendChild(datalistHTML);
    sliderContainer.appendChild(slider);
    slider.setAttribute("list", "temperature");
}

function removeClassBtnActive() {
    sidebarBtnItems.forEach((btn) => {
        btn.classList.remove("btnActive");
    });
}

// ---------------------- EVENT LISTENERS ------------------------------------------
searchBtn.addEventListener("click", async (e) => {
    weatherData = await getData(searchCity.value);
    if (weatherData) {
        console.log(weatherData);

        // add name of the city to the header
        headerContent.innerHTML = weatherData.address.toUpperCase();
        //headerContent.innerHTML += dateFormat(weatherData.)
        // show sidebar and main-content containers
        weatherContainer.classList.remove("hiddenElement");
        sidebarBTNs.classList.remove("hiddenElement");
        // remove highlight from every button except for the 1st one
        removeClassBtnActive();
        sidebarBtnItems[0].classList.add("btnActive");
        // add names for the buttons in the sidebar
        addDatesToSidebar(weatherData.days);
        // get current time
        time = getCurrTime();
        // show weather
        showWeather(weatherData, date, time);
    } else {
        headerContent.innerHTML = `<p>Incorrect input. Try again.</p>`;
    }
    searchCity.value = "";
});

searchCity.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
    }
});

sidebarBtnItems.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        removeClassBtnActive();
        // get index of the pressed button
        date = Array.from(sidebarBtnItems).indexOf(e.target);
        // show weather
        showWeather(weatherData, date, time);
        // highlight the pressed button
        e.target.classList.add("btnActive");
    });
});

slider.addEventListener("input", (e) => {
    // get selected hour
    time = e.target.value;
    // show weather
    showWeather(weatherData, date, time);
});
