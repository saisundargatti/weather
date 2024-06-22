import { useState, useEffect } from "react";
import ErrorComponent from "../error/error";
import SearchBar from "../searchbar/searchbar";
import ComboChartComponent from "../charts/combochart";
import PieChartComponent from "../charts/piechart";
import LineChartComponent from "../charts/linechart";
import TimeTable from "../charts/timetable";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: "",
  });
  const [highlightedRow, setHighlightedRow] = useState(0);
  const [selectedOption, setSelectedOption] = useState("temperature");
  const [error, setError] = useState(true);
  const [location, setLocation] = useState("");

  useEffect(() => {
    // Fetch data from Open Meteo API
    if (coordinates.latitude && coordinates.longitude) {
      axios
        .get(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max&timezone=GMT`
        )
        .then((response) => {
          const dailyData = response.data.daily;
          const formattedData = dailyData.time.map((time, index) => ({
            name: time,
            temperature: {
              max: dailyData.temperature_2m_max[index],
              min: dailyData.temperature_2m_min[index],
            },
            sunrise: dailyData.sunrise[index],
            sunset: dailyData.sunset[index],
            daylight_duration: dailyData.daylight_duration[index],
            sunshine_duration: dailyData.sunshine_duration[index],
            uv_index_max: dailyData.uv_index_max[index],
          }));
          setData(formattedData);
          setError(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setError(true);
        });
    }
  }, [coordinates]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    if (!city.trim()) {
      alert("Please enter a valid city name.");
      return;
    }

    // Fetch coordinates from Open Meteo Geocoding API
    setLoading(true);
    axios
      .get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=10&language=en&format=json`
      )
      .then((response) => {
        setLoading(false);
        if (response.data.results && response.data.results.length > 0) {
          setSearchResults(response.data.results);
        } else {
          alert("No results found. Please try another city name.");
        }
      })
      .catch((error) => {
        console.error("Error fetching coordinates:", error);
        setLoading(false);
        alert(
          "An error occurred while fetching coordinates. Please try again later."
        );
      });
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      const location = searchResults[highlightedRow];
      setLocation(location);
      setCoordinates({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [highlightedRow, searchResults]);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  return (
    <div className="dashboard">
      <h2>Get weather forecast for upcoming 7 days</h2>
      <div className="result_container">
        <SearchBar
          city={city}
          handleCityChange={handleCityChange}
          handleSearch={handleSearch}
        />
        <div className="search-results">
          <table>
            <thead>
              <tr>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
              </tr>
            </thead>
            {error && <ErrorComponent />}
            {!error && (
              <tbody>
                {searchResults.map((result, index) => (
                  <tr
                    key={index} // Add key prop to each <tr>
                    className={index === highlightedRow ? "highlight_cell" : ""}
                    onClick={() => setHighlightedRow(index)}
                  >
                    <td>{result.name}</td>
                    <td>{result.admin1}</td>
                    <td>{result.country}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        <div className="controls">
          <label htmlFor="dataSelect">choose parameter: </label>
          <select
            id="dataSelect"
            value={selectedOption}
            onChange={handleOptionChange}
            className="item_bar"
          >
            <option value="temperature">Temperature</option>
            <option value="sunrise">Sunrise</option>
            <option value="sunset">Sunset</option>
            <option value="daylight_duration">Daylight Duration</option>
            <option value="uv_index_max">UV Index Max</option>
          </select>
        </div>
        {loading && <div>Loading...</div>}

        {!loading && (
          <div>
            <h2 className="chart_heading">
              {selectedOption.replace(/_/g, " ").charAt(0).toUpperCase() +
                selectedOption.replace(/_/g, " ").slice(1)}{" "}
              Over Time - {location.name}/{location.admin1}/{location.country}
            </h2>
            {selectedOption === "temperature" && (
              <ComboChartComponent
                data={data.map((d) => ({
                  name: d.name,
                  max: d.temperature.max,
                  min: d.temperature.min,
                  average: parseFloat(
                    ((d.temperature.max + d.temperature.min) / 2).toFixed(2)
                  ),
                }))}
              />
            )}
            {selectedOption === "uv_index_max" && (
              <LineChartComponent
                data={data.map((d) => ({
                  name: d.name,
                  uv_index_max: d.uv_index_max,
                }))}
              />
            )}
            {selectedOption === "daylight_duration" && (
              <PieChartComponent
                data={data.map((d) => ({
                  name: d.name,
                  value: d.daylight_duration,
                }))}
              />
            )}
            {selectedOption === "sunrise" && (
              <TimeTable
                data={data.map((d) => ({
                  name: d.name,
                  sunrise: d.sunrise,
                }))}
                selectedOption={selectedOption}
              />
            )}
            {selectedOption === "sunset" && (
              <TimeTable
                data={data.map((d) => ({
                  name: d.name,
                  sunset: d.sunset,
                }))}
                selectedOption={selectedOption}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
