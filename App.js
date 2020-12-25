import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
 
am4core.useTheme(am4themes_animated);

class App extends Component {
  state = {
    id: null,
    name: null
  };
  componentDidMount() {
    this.mapConfiguration();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  mapConfiguration = () => {
    let userData;
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    this.chart = chart;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#E1F6F0");

    polygonTemplate.events.on("hit", function(ev) {
      let data = ev.target.dataItem.dataContext;
      userData = data;
      getClickData(userData);
    });

    let getClickData = userData => {
      this.setState({ name: userData.name, id: userData.id });
    };

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#64CF7E");
    // Remove Antarctica
    polygonSeries.exclude = ["AQ"];

    // Add zoom control
    chart.zoomControl = new am4maps.ZoomControl();
  };

  render() {
    console.log(this.state);
    const { name } = this.state;
    return (
      <React.Fragment>
        <div
          id="chartdiv"
          // style={{ width: 100 + "vw", height: 100 + "vh" }}
        ></div>

        <div class="wrapper">
          <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Modal title</h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Modal body text goes here.</p>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary">
                    Save changes
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
