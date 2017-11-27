import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Store from '../../stores/Store.js';
import { compose, withProps, withStateHandlers } from 'recompose';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import {
  sortBy as _sortBy,
  extend as _extend,
} from 'underscore';

// Update this
const apiKey = '';

const InfoBoxPopUp = compose(
  withStateHandlers(() => ({
    isOpen: false,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    }),
  })
)(props =>
  <Marker
    position={{ lat: props.location.address.latitude, lng: props.location.address.longitude }}
    onClick={props.onToggleOpen}
  >
    {props.isOpen && <InfoBox
      onCloseClick={props.onToggleOpen}
      options={{ closeBoxURL: '', enableEventPropagation: true }}
    >
      <div style={{ backgroundColor: '#1B7FA7', opacity: 0.9, padding: '12px', color: '#fff' }}>
        <div>
          {props.location.name}<br />
        Total Checkouts: {parseInt(props.location.icode1Sum, 10).toLocaleString()}
        </div>
      </div>
    </InfoBox>}
  </Marker>
);

const StyledMapWithAnInfoBox = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
  >
    {props.data.map((location, i) => (<InfoBoxPopUp location={location} key={i} />))}
  </GoogleMap>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({ selected: null }, Store.getState());
    this.getList = this.getList.bind(this);
  }

  getList(appsArray) {
    return appsArray.map((app, index) => (
      <li key={index}><a href={app.link}>{app.id}</a></li>
    ));
  }

  render() {
    const sortedData = _sortBy(this.state.data, (loc) => parseInt(loc.icode1Sum, 10)).reverse();
    return (
      <div className="app-wrapper">
        <Header
          skipNav={{ target: 'mainContent' }}
          navData={navConfig.current}
        />

        <div id="mainContent">
          <h2>more people reading more</h2>

          <StyledMapWithAnInfoBox data={sortedData} />
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
