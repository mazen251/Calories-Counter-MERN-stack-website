import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart, CategoryScale, LinearScale, Title, ArcElement } from 'chart.js';
import { BarElement, BarController } from 'chart.js';

const Delayed = ({ children, waitBeforeShow = 4500 }) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShown(true);
    }, waitBeforeShow);
  }, [waitBeforeShow]);

  return isShown ? children : null;
};

const UserChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    async function getData() {
      let username = [];
      let calories = [];
      try {
        const response = await axios.get("http://localhost:5000/calorie/");
        for (const dataObj of response.data) {
          username.push(dataObj.username);
          calories.push(parseInt(dataObj.calories));
        }
        setChartData({
          labels: username,
          datasets: [{
            label: "Calories",
            data: calories,
            backgroundColor: [
              "#f42f42",
              "#5ab950",
              "#fe812a",
              "#ffc748",
              "#6b71c7",
              "#8661d1",
              "#8a2cba"
            ],
            borderColor: [
              "#f42f42",
              "#5ab950",
              "#fe812a",
              "#ffc748",
              "#6b71c7",
              "#8661d1",
              "#8a2cba"
            ],
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    Chart.register(CategoryScale, LinearScale, Title, ArcElement, BarElement, BarController);

    return () => {
      Chart.unregister(CategoryScale, LinearScale, Title, ArcElement, BarElement, BarController);
    };
  }, []);

  return (
    <div className="App">
      <div>
        <h5
          style={{
            fontSize: "20",
            textAlign: "center",
            marginTop: "1em",
            marginBottom: "1em",
          }}
        >
          Calorie per user
        </h5>
        <Delayed>
          <Pie
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: "Calorie per User",
                  font: { size: 20 },
                  color: "#212529",
                },
              },
              maintainAspectRatio: true,
            }}
          />
        </Delayed>
      </div>
    </div>
  );
};

export default UserChart;
