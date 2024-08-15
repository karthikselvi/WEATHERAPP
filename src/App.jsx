import { useEffect, useState } from 'react'
import './App.css'
import searchicon from './assets/search.png'
import normalicon from './assets/sunny.png'
import rainicon from './assets/rain.png'
import sunicon from './assets/sun.png'
import cloudyicon from './assets/coludy.jpg'
import heavyrainicon from './assets/heavyrain.png'
import humidityIcon from './assets/humidity.png'
import windIcon from './assets/wind.png'
import drizzleicon from './assets/sunrain.png'
import snowicon from './assets/snowfall.png'

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="image" />
      </div>
      <div className="temp">{temp}^C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div className="lat">
          <span>lattitude </span>
          <span>{lat}</span>
        </div>
        <div className="log">
          <span>longitude </span>
          <span>{log}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className='icon' />
          <div className="data">
            <div className="humidity-percent">{humidity} %</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className='icon' />
          <div className="data">
            <div className="wind-percent">{wind} km/h</div>
            <div className="text">wind speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  let api_key = "5a5de2161bdf656c2f7eb378b644ec2d";
  const [text, settext] = useState("Chennai")
  const [icon, seticon] = useState(normalicon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("chennai");
  const [country, setCountry] = useState("IN");
  const [lat, setlat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, sethumidity] = useState(0);
  const [wind, setwind] = useState(0);

  const [cityNotFound, setcityNotfound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null)

  const weatherIconMap = {
    "01d": normalicon,
    "01n": normalicon,
    "02d": cloudyicon,
    "02n": cloudyicon,
    "03d": drizzleicon,
    "03n": drizzleicon,
    "04d": drizzleicon,
    "04n": drizzleicon,
    "09d": rainicon,
    "09n": rainicon,
    "10d": rainicon,
    "10n": rainicon,
    "13d": snowicon,
    "13n": snowicon

  }

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
    try {

      let res = await fetch(url);
      let data = await res.json();
      console.log(data);
      if (data.cod == "404") {
        console.error("City not found");
        setcityNotfound(true);
        setLoading(false);
        return;
      }
      sethumidity(data.main.humidity);
      setwind(data.wind.speed);
      setCity(data.name);
      setCountry(data.sys.country);
      setTemp(Math.floor(data.main.temp));
      setlat(data.coord.lat);
      setLog(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      seticon(weatherIconMap[weatherIconCode] || normalicon);
      setcityNotfound(false);

    } catch (error) {
      console.error("An error occured", error.message);
      seterror("an error occured while fetching data")
    }
    finally {
      setLoading(false);
    }
  };


  const handlecity = (e) => {
    settext(e.target.value);
  }
  const handlekeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  }
  useEffect(function () {
    search()
  }, [])
  return (
    <>
      <div className='container'>
        <div className="input-container">
          <input type="text"
            className='city-input'
            placeholder='search cities'
            onChange={handlecity}
            value={text} onKeyDown={handlekeyDown} />
          <div className='searchicon' onClick={() =>
            search()}>
            <img src={searchicon} alt="search" />
          </div>
        </div>
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found...</div>}

        {!loading && !cityNotFound && 
        <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log}
          humidity={humidity} wind={wind} />}
        <p className='copyright'>
          Designed by <span>Kartik Selvi</span>
        </p>
      </div>
    </>
  )
}

export default App
