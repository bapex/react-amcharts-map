import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

class App extends Component {

  componentDidMount() {
    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodataSource.url = "https://www.amcharts.com/lib/4/geodata/json/japanLow.json";
    chart.geodataSource.events.on("parseended", function(event) {
      let data = [];
      for(var i = 0; i < event.target.data.features.length; i++) {
        data.push({
          id: event.target.data.features[i].id,
          value: Math.round( Math.random() * 10000 )
        })
      }
      polygonSeries.data = data;
    })

    // Set projection
    chart.projection = new am4maps.projections.Mercator();

    // Add zoom control
    chart.zoomControl = new am4maps.ZoomControl();

    // Set initial zoom
    chart.homeZoomLevel = 1;

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.mapPolygons.template.strokeWidth = 0.5;


    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;

    polygonTemplate.tooltipText = "{name}: {value}";
    polygonTemplate.fill = am4core.color("#aac4e7");

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = chart.colors.getIndex(0);


    // Create active state
    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = chart.colors.getIndex(1);

    // Create an event to toggle "active" state
    polygonTemplate.events.on("hit", function (event) {
      event.target.isActive = !event.target.isActive;
    })

  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    return (
      <div>
        <div id="chartdiv" style={{ width: "100%", height: "750px" }}></div>
      </div>
    )
  }

}

export default App;
