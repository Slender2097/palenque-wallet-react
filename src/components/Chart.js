import React from "react";
import LineChart from "react-linechart";
import "../../node_modules/react-linechart/dist/styles.css";
import "./Chart.css";

const Chart = ({ chartData }) => {
 if (!chartData && !chartData?.length) return null;

 const data = [
   {
     color: "steelblue",
     points: chartData,
   },
 ];

 return (
   <div className="chart-container">
     {chartData && chartData.length <= 1 ? (
       // ToDo: Add a loading spinner
       <div className="loading-spinner"></div>
     ) : (
       <LineChart
         xLabel="Time"
         height={250}
         //  ToDo: Customize width to be responsive based on screen size
         width={window.innerWidth < 768 ? 300 : 500}
         data={data}
         onPointHover={(obj) => `price: $${obj.y}<br />time: ${obj.x}`}
         ticks={4}
         hideYLabel={true}
         hideXLabel={true}
         xDisplay={(timestamp) =>
           new Date(timestamp).toLocaleTimeString("en-US")
         }
       />
     )}
   </div>
 );
};

export default Chart;