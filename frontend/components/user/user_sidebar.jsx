import React from 'react';
import { Link } from 'react-router';
import UserSidebarAvatar from './user_sidebar_avatar';
import UserSidebarLocation from './user_sidebar_location';
import UserSidebarBio from './user_sidebar_bio';

class UserSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarFile: null,
      avatarUrl: this.props.user.avatarUrl,
      location: this.props.user.location,
      bio: this.props.user.bio,
      editingLocation: false,
      editingBio: false
    };
    this.handleAddAvatar = this.handleAddAvatar.bind(this);
    this.handleSubmitAvatar = this.handleSubmitAvatar.bind(this);
    this.handleDeleteAvatar = this.handleDeleteAvatar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleOpenForm = this.handleOpenForm.bind(this);
    this.handleSaveLocation = this.handleSaveLocation.bind(this);
    this.handleSaveBio = this.handleSaveBio.bind(this);
    this.handleCancelLocation = this.handleCancelLocation.bind(this);
    this.handleCancelBio = this.handleCancelBio.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.user.avatarUrl !== newProps.user.avatarUrl) {
      this.setState({avatarUrl: newProps.user.avatarUrl});
    } else {
      this.setState({avatarUrl: this.props.user.avatarUrl});
    }
    if (this.props.user.location !== newProps.user.location) {
      this.setState({location: newProps.user.location});
    } else {
      this.setState({location: this.props.user.location});
    }
    if (this.props.user.bio !== newProps.user.bio) {
      this.setState({bio: newProps.user.bio});
    } else {
      this.setState({bio: this.props.user.bio});
    }
  }

  handleAddAvatar(e) {
    e.preventDefault();
    const file = e.currentTarget.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = (() => {
      this.setState({
        avatarFile: file,
        avatarUrl: fileReader.result
      });
    }).bind(this);
    if (file) {
      fileReader.readAsDataURL(file);
    }
    this.handleSubmitAvatar(file);
  }

  handleSubmitAvatar(avatarFile) {
    let formData = new FormData();
    formData.append('user[id]', this.props.user.id);
    formData.append('user[avatar]', avatarFile);
    this.props.updateUserAvatar(this.props.user.id, formData);
  }

  handleDeleteAvatar(e) {
    e.preventDefault();
    let formData = new FormData();
    formData.append('user[id]', this.props.user.id);
    formData.append('user[avatar]', null);
    this.props.updateUserAvatar(this.props.user.id, formData);
  }

  handleOpenForm(editingField) {
    return (e) => {
      e.preventDefault();
      this.setState({ [editingField]: true });
    };
  }

  handleSaveLocation(e) {
    e.preventDefault();
    const user = {
      id: this.props.user.id,
      location: this.state.location,
    };
    this.props.updateUser(user);
    this.setState({
      location: e.currentTarget.value,
      editingLocation: false
    });
  }

  handleSaveBio(e) {
    e.preventDefault();
    const user = {
      id: this.props.user.id,
      bio: this.state.bio,
    };
    this.props.updateUser(user);
    this.setState({
      bio: e.currentTarget.value,
      editingBio: false
    });
  }

  handleCancelLocation(e) {
    e.preventDefault();
    this.setState({
      location: this.props.user.location,
      editingLocation: false
    });
  }

  handleCancelBio(e) {
    e.preventDefault();
    this.setState({
      bio: this.props.user.bio,
      editingBio: false
    });
  }

  handleChange(field) {
    return (e) => {
      this.setState({
        [field]: e.currentTarget.value
      });
    };
  }

  render() {
    let avatar;
    if (this.state.avatarUrl === '/avatars/original/missing.png') {
      avatar = <div><p>add photo</p></div>;
    } else {
      avatar = <img width='120px' src={ this.state.avatarUrl } />;
    }
    const username = <p>{ this.props.user.username }</p>;
    let location = <p>{ this.props.user.location }</p>;
    let bio = <p>{ this.props.user.bio }</p>;
    if (this.props.ownProfile) {
      if (this.state.avatarUrl === '/avatars/original/missing.png') {
        avatar = (
          <div>
            { avatar }
            <input type='file' onChange={ this.handleAddAvatar } />
          </div>
        );
      } else {
        avatar = (
          <div>
            { avatar }
            <a href='' onClick={ this.handleDeleteAvatar }>x</a>
          </div>
        );
      }
      if (this.state.editingLocation) {
        location = (
          <div>
            <input
              onChange={ this.handleChange('location') }
              value={this.state.location} />
            <button
              onClick={ this.handleSaveLocation }>save</button>
            <a href=''
              onClick={ this.handleCancelLocation }>cancel</a>
          </div>
        );
      } else {
        location = (
          <div>
            { location }
            <a href=''
              onClick={ this.handleOpenForm('editingLocation') }>edit location</a>
          </div>
        );
      }
      if (this.state.editingBio) {
        bio = (
          <div>
            <input
              onChange={ this.handleChange('bio') }
              value={this.state.bio} />
            <button
              onClick={ this.handleSaveBio }>save</button>
            <a href=''
              onClick={ this.handleCancelBio }>cancel</a>
          </div>
        );
      } else {
        bio = (
          <div>
            { bio }
            <a href=''
              onClick={ this.handleOpenForm('editingBio') }>edit bio</a>
          </div>
        );
      }
    }

    return(
      <aside>
        <UserSidebarAvatar
          avatarUrl={ this.state.avatarUrl }
          ownProfile={ this.props.ownProfile }
          handleAddAvatar={ this.handleAddAvatar }
          handleDeleteAvatar={ this.handleDeleteAvatar } />
        { username }
        { location }
        <UserSidebarLocation
          locationFromProps={ this.props.user.location }
          locationFromState={ this.state.location }
          ownProfile={ this.props.ownProfile }
          editingLocation={ this.state.editingLocation }
          handleChange={ this.handleChange('location') }
          handleSaveLocation={ this.handleSaveLocation }
          handleCancelLocation={ this.handleCancelLocation }
          handleOpenForm={ this.handleOpenForm('editingLocation') }
          />
        { bio }
        <UserSidebarBio
          bioFromProps={ this.props.user.bio }
          bioFromState={ this.state.bio }
          ownProfile={ this.props.ownProfile }
          editingBio={ this.state.editingBio }
          handleChange={ this.handleChange('bio') }
          handleSaveBio={ this.handleSaveBio }
          handleCancelBio={ this.handleCancelBio }
          handleOpenForm={ this.handleOpenForm('editingBio') }
          />
      </aside>
    );
  }
}

export default UserSidebar;
