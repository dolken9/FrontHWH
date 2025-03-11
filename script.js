const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const city = ref("");
    const weatherData = ref([]);
    const errorMessage = ref("");

    const fetchWeather = async () => {
      const [lat, lon] = city.value.split(",").map(coord => coord.trim());

      if (!lat || !lon) {
        errorMessage.value = "Fill in latitude and longitude, separated by a comma.";
        return;
      }

      errorMessage.value = "";
      const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const timeseries = data.timeSeries.filter((_, index) => index % 6 === 0).slice(0, 12);

        weatherData.value = timeseries.map(item => {
            return {
            time: new Date(item.validTime).toLocaleString("sv-SE"),
            temp: item.parameters.find(p => p.name === "t").values[0],
            precipitation: item.parameters.find(p => p.name === "pmean").values[0],
            windSpeed: item.parameters.find(p => p.name === "ws").values[0] ? item.parameters.find(p => p.name === "ws").values[0] : "N/A",
            gustSpeed: item.parameters.find(p => p.name === "gust").values[0] ? item.parameters.find(p => p.name === "gust").values[0] : "N/A"
            };
        });

      } catch (error) {
        errorMessage.value = "Could not fetch data, try again later.";
        console.error("Error! Something went wrong while trying to fetch the forecast:", error);
      }
    };

    onMounted(() => {
      fetchWeather(); 

      setInterval(() => {
        fetchWeather();
      }, 300000);
    });

    return { city, weatherData, fetchWeather, errorMessage };
  }
}).mount("#app");

