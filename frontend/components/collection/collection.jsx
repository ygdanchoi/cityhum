import React from 'react';
import { Link } from 'react-router';
import UserSidebarContainer from '../user_sidebar/user_sidebar_container';

class Collection extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchCollection(this.props.params.collectionId);
    this.props.fetchCollectionSounds(this.props.params.collectionId);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.params.collectionId !== newProps.params.collectionId) {
      this.props.fetchCollection(newProps.params.collectionId);
      this.props.fetchCollectionSounds(newProps.params.collectionId);
    }
  }

  render() {
    if (this.props.collection === undefined) {
      return(
        <div className='collection-page'>
          <main className='collection-main'>
            <p>loading...</p>
          </main>
        </div>
      );
    }
    const soundListItems = this.props.collection.soundIds.map(
      (id) => {
        if (this.props.sounds[id]) {
          return <li key={ id }>{ this.props.sounds[id].title }</li>;
        } else {
          return <li key={ id } />;
        }
      }
    );
    return (
      <div className='collection-page'>
        <main className='collection-main'>
          <section className='collection-info-section'>
            <p>{ this.props.collection.title }</p>
            <p>by { this.props.collection.user.username }</p>
            <p>{ this.props.collection.description }</p>
            <ul>
              { soundListItems }
            </ul>
            <img src={ this.props.collection.artworkUrl } />
          </section>
          <UserSidebarContainer userId={ this.props.collection.user.id } />
        </main>
      </div>
    );
  }
}

export default Collection;
