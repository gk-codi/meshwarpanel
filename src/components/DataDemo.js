import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Panel } from 'primereact/panel';
import { InputMask } from 'primereact/inputmask';

import { CarService } from '../service/CarService';
import { NodeService } from '../service/NodeService';
import { EventService } from '../service/EventService';
import Event from './event';

import { API_URL } from '../constants';

export class DataDemo extends Component {
  constructor() {
    super();
    this.state = {
      rows: 3,
      first: 0,
      dataViewValue: [],
      selectedFile: null,
      selectedFiles: null,
      documents: [],
      documentsSelection: null,
      fullCalendarEvents: [],
      layout: 'list',
      // sortOptions: [
      //     {label: 'Newest First', value: '!year'},
      //     {label: 'Oldest First', value: 'year'},
      //     {label: 'Brand', value: 'brand'}
      // ],
      eventInfo: {
        location: '',
        date: '',
        title: '',
        price: '',
        image: '',
        seats: '',
        description: '',
      },
      error: '',
      searchInput: '',
    };
    
    this.carService = new CarService();
    this.nodeService = new NodeService();
    this.eventService = new EventService();
    this.dataViewItemTemplate = this.dataViewItemTemplate.bind(this);
  }
  
  updateEvent = async (e, id, props) => {
    e.preventDefault();
    try {
      const events = [...this.state.dataViewValue];
      const body = new FormData();
      
      
      const event = events.find(event => {
        return event.event_id === id;
      })
      
      const index = events.indexOf(event);
      
      Object.keys(props).forEach(prop => {
        if (props[prop] !== '' && prop !== 'event_id') {
          event[prop] = props[prop];
          console.log(prop, props[prop])
          body.append(prop, props[prop]);
        }
      });
      
      
      const response = await fetch(`${API_URL}/events/${id}`, {method: `PUT`, body: body});
      const result = await response.json();
      events[index] = event;
      this.setState({events});
      
    } catch (err) {
      this.setState({error: err.message})
    }
  }
  
  
  deleteEvent = async (id) => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {method: 'DELETE'})
      const result = await response.json()
      console.log(result);
      if (result.success) {
        const events = this.state.dataViewValue.filter(event => event.event_id != id)
        this.setState({dataViewValue: events, error: ''})
      } else {
        this.setState({error: result.message})
      }
    } catch (err) {
      this.setState({error: err})
    }
  }
  
  async componentDidMount() {
    //this.carService.getCarsMedium().then(data => this.setState({dataTableValue: data}));
    this.nodeService.getTreeNodes(this).then(nodes => this.setState({treeData1: nodes}));
    this.nodeService.getTreeNodes(this).then(nodes => this.setState({treeData2: nodes}));
    //this.carService.getCarsLarge().then(data => this.setState({dataViewValue: data}));
    const response = await fetch(`${API_URL}/events`);
    const event = await response.json()
    console.log(event.result)
    this.setState({dataViewValue: event.result})
    this.getEvents();
    //this.nodeService.getTreeTa1xbleNodes().then(files => this.setState({documents: files}));
    // this.carService.getCarsMedium().then(data => this.setState({picklistSourceCars: data}));
    // this.carService.getCarsSmall().then(data => this.setState({orderlistCars: data}));
    // this.eventService.getEvents().then(events => this.setState({fullCalendarEvents: events}));
  }
  
  getEvents = async () => {
    console.log('here')
    const response = await fetch(`${API_URL}/events`)
    const event = await response.json()
    console.log(event.result)
    this.setState({dataViewValue: event.result})
  }
  
  
  dataViewItemTemplate(event, layout) {
    if (!event) {
      return;
    }
    
    if (layout === 'list') {
      return <Event
          data={event}
          handleDelete={this.deleteEvent}
          handleUpdate={this.updateEvent}/>
    }
    
    if (layout === 'grid') {
      return (
          <div style={{padding: '.5em'}} className="p-col-12 p-md-3">
            <Panel header={event.title} style={{textAlign: 'center'}}>
              <img style={{width: '200px'}} src={`${API_URL}/images/${event.image_src}`} alt="asd"/>
              <div className="car-detail">{event.title} - {event.location}</div>
              <Button icon="pi pi-trash"></Button>
            </Panel>
          </div>
      );
    }
  }
  
  onSortChange(event) {
    let value = event.value;
    
    if (value.indexOf('!') === 0)
      this.setState({sortOrder: -1, sortField: value.substring(1, value.length), sortKey: value});
    else
      this.setState({sortOrder: 1, sortField: value, sortKey: value});
  }
  
  searchHandler = (e) => {
    this.setState({searchInput: e.target.value});
  }
  
  changeHandler = (e) => {
    let eventInfo = {...this.state.eventInfo};
    let name = e.target.name;
    eventInfo[name] = e.target.value;
    this.setState({eventInfo})
  }
  
  handleCreate = async (e) => {
    e.preventDefault();
    const file = e.target.image.files[0];
    console.log(file)
    const body = new FormData();
    body.append('image', file);
    body.append('location', this.state.eventInfo.location);
    body.append('date', this.state.eventInfo.date);
    body.append('title', this.state.eventInfo.title);
    body.append('price', parseInt(this.state.eventInfo.price));
    body.append('remaining_seats', parseInt(this.state.eventInfo.seats));
    body.append('description', this.state.eventInfo.description);
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      body: body,
    })
    const result = await response.json();
    this.setState({
      eventInfo: {
        location: '',
        date: '',
        title: '',
        price: '',
        image: '',
        seats: '',
        description: '',
      },
    })
    this.getEvents()
  }
  
  
  render() {
    
    const header = (
        <div className="p-grid">
          <div className="p-col-6 p-md-6">
            <InputText placeholder="Search by title" value={this.state.searchInput} onChange={this.searchHandler}/>
          </div>
          <div className="p-col-6 p-md-6" style={{textAlign: 'right'}}>
            <DataViewLayoutOptions layout={this.state.layout} onChange={event => this.setState({layout: event.value})}/>
          </div>
        </div>
    );
    
    return (
        <>
          <div className="p-grid">
            <div className="p-col-12">
              <div className="card card-w-title">
                <h1>Events</h1>
                <form style={{margin: '20px 0', display: 'flex'}} onSubmit={this.handleCreate}>
                  <label for="title">
                    <div style={{textAlign: 'center'}}>Title</div>
                    <InputText
                        style={{width: '100px', marginRight: '10px'}}
                        value={this.state.eventInfo.title}
                        onChange={this.changeHandler}
                        name="title"/>
                  </label>
                  <label for="location">
                    <div style={{textAlign: 'center'}}>Location</div>
                    <InputText
                        style={{width: '100px', marginRight: '10px'}}
                        value={this.state.eventInfo.location}
                        onChange={this.changeHandler}
                        name="location"/>
                  </label>
                  <label for="seats">
                    <div style={{textAlign: 'center'}}>Seats</div>
                    <InputText
                        style={{width: '100px', marginRight: '10px'}}
                        value={this.state.eventInfo.seats}
                        onChange={this.changeHandler}
                        name="seats"/>
                  </label>
                  <label for="price">
                    <div style={{textAlign: 'center'}}>Price</div>
                    <InputText
                        style={{width: '100px', marginRight: '10px'}}
                        value={this.state.eventInfo.price}
                        onChange={this.changeHandler}
                        name="price"/>
                  </label>
                  <label for="date">
                    <div style={{textAlign: 'center'}}>Date</div>
                    <InputMask
                        mask="9999-99-99"
                        slotChar="yyyy-mm-dd"
                        style={{width: '100px', marginRight: '10px'}}
                        value={this.state.eventInfo.date}
                        onChange={this.changeHandler}
                        name="date"/>
                  </label>
                  <label for="description">
                    <div style={{textAlign: 'center'}}>Description</div>
                    <InputText
                        style={{width: '100px', marginRight: '10px'}}
                        value={this.state.eventInfo.description}
                        onChange={this.changeHandler}
                        name="description"/>
                  </label>
                  <label for="image">
                    <div style={{textAlign: 'center'}}>Image</div>
                    <InputText
                        type="file"
                        style={{width: '220px', marginRight: '10px', height: '35px'}}
                        onChange={this.changeHandler}
                        name="image"/>
                  
                  </label>
                  <Button
                      label="Create"
                      style={{padding: '0 10px', height: '50px', marginTop: '10px'}}
                  />
                </form>
                <DataView ref={el => this.dv = el} value={this.state.dataViewValue}
                          itemTemplate={this.dataViewItemTemplate} layout={this.state.layout}
                          paginator={false} header={header}/>
              
              </div>
            </div>
          </div>
        </>
    );
  }
}
