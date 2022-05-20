import React, { useState, useEffect, useMemo } from "react";

//import { ThemeProvider } from "emotion-theming"; 已失效 正確寫法from "@emotion/react";
import { ThemeProvider } from "@emotion/react";
import WeatherCard from "./views/WeatherCard";
import WeatherSetting from "./views/WeatherSetting";
import { getMoment, findLocation } from "./utils/helpers";
import useWeatherAPI from "./hooks/useWeatherAPI";
import styled from "@emotion/styled";

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AUTHORIZATION_KEY = "CWB-B3809DDF-DDA6-404C-A109-D1055501A93F";

const App = () => {
  const [currentTheme, setCurrentTheme] = useState("light");
  //一開始進去畫面是沒有localstorage的紀錄，會跑不出東西！ 所以要給他default value
  const storageCity = localStorage.getItem("cityName") || "臺北市";
  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };

  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);
  const [weatherElement, fetchData] = useWeatherAPI({
    //useWeatherAPI used,APP used
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });

  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}

        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};
/*
const root = createRoot(document.getElementById("root"));
root.render(<App />);*/

export default App;
