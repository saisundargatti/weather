/* eslint-disable react/prop-types */
import "./searchbar.css";
function SearchBar({ city, handleCityChange, handleSearch }) {
  return (
    <div className="searchbar-container">
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city name"
      />
      <button onClick={handleSearch} className="item_bar">
        Search
      </button>
    </div>
  );
}

export default SearchBar;
