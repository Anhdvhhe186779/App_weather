const apiKey = "9a29f97208ee41bb8d021203261603";

async function getWeather(city) {
    document.getElementById("loading").style.display = "flex";

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7&aqi=yes`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);

        /* CURRENT WEATHER - GIỮ NGUYÊN 100% */
        document.getElementById("city").innerText = data.location.name + ", " + data.location.country;
        document.getElementById("time").innerText = data.location.localtime;
        document.getElementById("temp").innerText = data.current.temp_c + "°C";
        document.getElementById("condition").innerText = data.current.condition.text;
        document.getElementById("humidity").innerText = data.current.humidity + "%";
        document.getElementById("wind").innerText = data.current.wind_kph + " kph";
        document.getElementById("precip").innerText = data.current.precip_mm + " mm";
        document.getElementById("rainChance").innerText = data.forecast.forecastday[0].day.daily_chance_of_rain + "%";
        document.getElementById("windSpeed").innerText = data.current.wind_kph + " kph";
        document.getElementById("windDir").innerText = data.current.wind_dir;

        if (data.current.air_quality) {
            document.getElementById("airIndex").innerText = data.current.air_quality["us-epa-index"];
        }
        document.getElementById("uv").innerText = data.current.uv;
        document.getElementById("sunrise").innerText = data.forecast.forecastday[0].astro.sunrise;
        document.getElementById("sunset").innerText = data.forecast.forecastday[0].astro.sunset;
        document.getElementById("icon").src = "https:" + data.current.condition.icon;

        /* HOURLY - GIỮ NGUYÊN */
        const hourlyContainer = document.getElementById("hourly");
        hourlyContainer.innerHTML = "";
        const hours = data.forecast.forecastday[0].hour;
        for (let i = 0; i < 24; i += 3) {
            const hour = hours[i];
            const time = hour.time.split(" ")[1];
            hourlyContainer.innerHTML += `
                <div class="hour">
                    <p>${time}</p>
                    <img src="https:${hour.condition.icon}">
                    <p>${hour.temp_c}°</p>
                </div>
            `;
        }

        /* WEEKLY - GIỮ NGUYÊN */
        const weekContainer = document.getElementById("week");
        weekContainer.innerHTML = "";
        const days = data.forecast.forecastday;
        days.forEach(day => {
            const date = new Date(day.date);
            const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
            weekContainer.innerHTML += `
                <div class="day">
                    <p>${weekday}</p>
                    <img src="https:${day.day.condition.icon}">
                    <p>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
                </div>
            `;
        });

        /* ====================== CÁC HIỆU ỨNG ĐỘNG MỚI ====================== */
        // 1. Đếm số nhiệt độ mượt mà
        animateTemperature(data.current.temp_c);

        // 2. Background ngày/đêm
        const isDay = data.current.is_day;
        document.body.style.background = isDay === 1
            ? 'linear-gradient(135deg, #87CEEB 0%, #E0F7FA 100%)'
            : 'linear-gradient(135deg, #2C3E50 0%, #1A5276 100%)';

        // 3. Màu sắc AQI & UV
        if (data.current.air_quality) {
            const aqi = parseInt(document.getElementById("airIndex").innerText);
            const airEl = document.getElementById("airIndex");
            if (aqi <= 2) airEl.style.color = '#22c55e';
            else if (aqi <= 4) airEl.style.color = '#eab308';
            else if (aqi <= 6) airEl.style.color = '#f59e0b';
            else airEl.style.color = '#ef4444';
        }
        const uvVal = parseInt(data.current.uv || 0);
        const uvEl = document.getElementById("uv");
        if (uvVal <= 2) uvEl.style.color = '#22c55e';
        else if (uvVal <= 5) uvEl.style.color = '#eab308';
        else if (uvVal <= 7) uvEl.style.color = '#f59e0b';
        else uvEl.style.color = '#ef4444';

    } catch (error) {
        console.error(error);
        alert("Không thể lấy dữ liệu thời tiết. Vui lòng kiểm tra thành phố!");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

// Animation đếm nhiệt độ
function animateTemperature(target) {
    const tempEl = document.getElementById("temp");
    let start = 0;
    const duration = 1200;
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * target);
        tempEl.innerText = value + "°C";

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            tempEl.innerText = target + "°C";
        }
    }
    update();
}

// Hàm tìm kiếm mới
function searchWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (city) getWeather(city);
}

// Các hàm tab + hiệu ứng fade mượt (vẫn giữ nguyên tên hàm gốc)
// Ẩn tất cả các section một cách mượt mà
function hideAll(exceptId = null) {
    const sections = document.querySelectorAll('.section');

    sections.forEach(sec => {
        if (sec.id !== exceptId) {
            sec.style.opacity = '0';

            setTimeout(() => {
                sec.style.display = 'none';
            }, 500);
        }
    });
}

function showSection(sectionId, tabId) {

    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    hideAll(sectionId);

    targetSection.style.display = 'block';

    requestAnimationFrame(() => {
        targetSection.style.opacity = '1';
    });

    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
}
// Các hàm show cụ thể – giữ nguyên tên để onclick hoạt động
function showTemperature() {
    showSection('tempSection', 'tempTab');
}

function showPrecipitation() {
    showSection('precipSection', 'precipTab');
}

function showWind() {
    showSection('windSection', 'windTab');
}

function showAir() {
    showSection('airSection', 'airTab');
}

function showUV() {
    showSection('uvSection', 'uvTab');
}

function showSun() {
    showSection('sunSection', 'sunTab');
}

function setActiveTab(tabId) {
    document.querySelectorAll(".tabs button").forEach(tab => tab.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
}

// Khởi chạy
getWeather("Hanoi");