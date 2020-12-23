import React from 'react';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const id = window.location.pathname.split('/')[1];
    this.loadListingPhotos(id);
    this.checkFavorite();
  }

  render() {
    return (
      <div>Hello World!</div>
    )
  }
}

export default App;
