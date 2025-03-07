async function fetchWeather() {
    const input = document.getElementById("city").value;
    const [lat, lon] = input.split(",").map(coord => coord.trim());
    
    if (!lat || !lon) {
        alert("Ange latitud och longitud, separerade med ett komma.");
        return;
    }
    
    const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        const timeseries = data.timeSeries.filter((_, index) => index % 6 === 0).slice(0, 12); 
        
        const weatherContainer = document.getElementById("weather-data");
        weatherContainer.innerHTML = ""; // Rensa eventuell tidigare data

        timeseries.forEach(item => {
            const time = new Date(item.validTime).toLocaleString("sv-SE");
            const temp = item.parameters.find(p => p.name === "t").values[0];
            const precipitation = item.parameters.find(p => p.name === "pmean").values[0];
            const windSpeed = item.parameters.find(p => p.name === "ws").values[0];
            
            weatherContainer.innerHTML += `<strong>${time}</strong><br>
                                           Temperatur: ${temp}°C<br>
                                           Nederbörd: ${precipitation} mm<br>
                                           Vindhastighet: ${windSpeed} m/s<br><br>`;
        });
    } catch (error) {
        console.error("Kunde inte hämta data", error);
    }
}
