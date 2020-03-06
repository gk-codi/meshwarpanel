import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { API_URL } from '../constants'

import Image from './Image';

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gallery: [],
      image: '',
    };
  }
  
  componentDidMount = async () => {
    if (localStorage.getItem('login')) {
      this.getImages();
    } else {
      this.props.history.push('/');
    }
  };
  
  // changeHandler = (e) => {
  //   const image = e.target.value;
  //   console.log(image)
  //   this.setState({image})
  // }
  
  
  getImages = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery`);
      const image = await response.json();
      if (image.result.length > 0) {
        this.setState({gallery: image.result});
      }
    } catch (err) {
      console.log(err.message)
    }
  };
  
  addImage = async e => {
    e.preventDefault();
    const file = e.target.image.files[0]
    const body = new FormData();
    body.append('image', file);
    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: body,
      });
      const result = await response.json();
      this.getImages();
    } catch (err) {
      throw new Error(err)
    }
    
    
  };
  
  deleteImage = async id => {
    try {
      const response = await fetch(`${API_URL}/images/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        const gallery = this.state.gallery.filter(
            image => image.picture_id != id,
        );
        this.setState({gallery: gallery, error: ''});
      } else {
        this.setState({error: result.message});
      }
    } catch (err) {
      this.setState({error: err});
    }
  };
  
  render() {
    return (
        <>
          <form onSubmit={this.addImage}>
            <InputText
                name="image"
                type="file"
                style={{marginBottom: '20px'}}
                // onChange={this.changeHandler}
            />
            <Button label="Create" style={{padding: '5px 0'}}/>
          </form>
          
          <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
          >
            {this.state.gallery.map(image => {
              return <Image image={image} handleDelete={this.deleteImage}/>;
            })}
          </div>
        </>
    );
  }
}

export default Gallery;
