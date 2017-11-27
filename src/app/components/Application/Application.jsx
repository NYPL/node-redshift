import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Store from '../../stores/Store.js';
import { compose } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
} from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';

const MapWithAMarkerWithLabel = compose(
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: -34.397, lng: 150.644 }}
  >
    <MarkerWithLabel
      position={{ lat: -34.397, lng: 150.644 }}
      labelAnchor={new google.maps.Point(0, 0)}
      labelStyle={{ backgroundColor: 'yellow', fontSize: '32px', padding: '16px' }}
    >
      <div>Hello There!</div>
    </MarkerWithLabel>
  </GoogleMap>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = Store.getState();
    this.getList = this.getList.bind(this);
  }

  // Helper functions below the render() function:
  getList(appsArray) {
    return appsArray.map((app, index) => (
      <li key={index}><a href={app.link}>{app.id}</a></li>
    ));
  }

  render() {
    console.log(this.state.data);

    return (
      <div className="app-wrapper">
        <Header
          skipNav={{ target: 'mainContent' }}
          navData={navConfig.current}
        />

        <div id="mainContent">
          <h2>more people reading more</h2>

          <MapWithAMarkerWithLabel
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCOrOqWfUgmOD3skbSJymXCjOb4bEFGugM&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '400px' }} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
