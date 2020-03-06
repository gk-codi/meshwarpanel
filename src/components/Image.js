import React from 'react';
import {Button} from 'primereact/button';

import { API_URL } from '../constants'

function Image(props) {
  
  return (
    <div style={{position:"relative"}}>
      <Button
      style={{position:"absolute", right:"20px", top:"10px"}}
      icon="pi pi-trash"
      onClick={() => props.handleDelete(props.image.picture_id)}
      />
      
       <img
       src={`${API_URL}/images/${props.image.name}`}
       style={{width: "300px", height: "300px"}}>
       </img>
    </div>
  )
}

export default Image;
