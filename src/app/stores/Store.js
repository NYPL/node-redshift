import BookActions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateAngularApps: BookActions.UPDATE_ANGULAR_APPS,
      updateReactApps: BookActions.UPDATE_REACT_APPS,
    });

    this.on('init', () => {
      this.angularApps = [];
      this.reactApps = [];
    });
  }

  updateAngularApps(data) {
    this.angularApps = data;
  }

  updateReactApps(data) {
    this.reactApps = data;
  }
}

export default alt.createStore(Store, 'Store');
