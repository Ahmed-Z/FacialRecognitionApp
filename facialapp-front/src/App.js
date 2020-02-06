import React, {Component} from 'react';
import './App.css';
import Navigation from './component/navigation/Navigation';
import Register from './component/Register/Register';
import Logo from './component/logo/Logo';
import ImageLinkForm from './component/ImageLinkForm/ImageLinkForm';
import Rank from './component/Rank/Rank';
import Signin from './component/signin/signin';
import FaceRecognition from './component/FaceRecognition/FaceRecognition';
import SigninButton from './component/SigninButton/SigninButton';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '6a37c71793ef446baef8d0a8c08651ea'
 });

const particlesOptions = {
  "particles": {
    "number": {
      "value": 200,
      "density": {
        "enable": true,
        "value_area": 1000 // Denser the smaller the number.
      }
    },
    "color": { // The color for every node, not the connecting lines.
      "value": "#000000" // Or use an array of colors like ["#9b0000", "#001378", "#0b521f"]
    },
    "shape": {
        "type": "circle", // Can show circle, edge (a square), triangle, polygon, star, img, or an array of multiple.
        "stroke": { // The border
          "width": 0.5,
          "color": "#000000"
        },

    },

    "size": {
      "value": 5,
      "random": true
    },
    "line_linked": {
      "enable": true,
      "distance": 200, // The radius before a line is added, the lower the number the more lines.
      "color": "#000000",
      "opacity": 0.5,
      "width": 0.5
    },
    "move": {
      "enable": true,
      "speed": 1,
      "direction": "none", // Move them off the canvas, either "none", "top", "right", "bottom", "left", "top-right", "bottom-right" et cetera...
      "random": true,
      "straight": false, // Whether they'll shift left and right while moving.
      "out_mode": "bounce", // What it'll do when it reaches the end of the canvas, either "out" or "bounce".
      "bounce": false, 
      "attract": { // Make them start to clump together while moving.
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  }
  }

const intialState = {
      input: '',
      imageUrl: '',
      box: '',
      user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
      }
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: '',
      route: 'signin',
      user: {
            id: '',
            name: '',
            email: '',
            entries: 0,
            joined: ''
      }
    }
  }


loadUser = (data) => {
  this.setState({user:{
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
  },
  imageUrl: '',
  input: ''
}
  )
  this.setState(Object.assign(this.state.user,this.state.user));
}
  onRouteChange = (route) => {
    this.setState({route: route})
    if (this.state.route === 'signin'){
      this.setState(intialState)
    }
  }

  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width); 
    const height = Number(image.height);
    return{
      leftcol: face.left_col * width,
      toprow: face.top_row * height,
      rightcol: width - (face.right_col * width),
      bottomrow: height - (face.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box})
  }

  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response =>{
        if (response){
        fetch('https://facialreco.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response=> response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user,{entries: count}))
        })
      }
       this.displayFaceBox(this.calculateFaceLocation(response))
      })
    .catch(err => {});
    }

  render(){
    return (
    <div className='App'>
      <Particles className='particles'
      params={particlesOptions}/>
      
      {this.state.route === 'signin'?
          <div>
              <Logo />
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> 
           </div>  
          
          :(this.state.route === 'home' ?
            <div>
            <div className='rowC'>
              <Logo />
              <Navigation onRouteChange={this.onRouteChange} />   
            </div>
              <Rank name={this.state.name} entries={this.state.entries} />
              <ImageLinkForm onSubmit={this.onSubmit} onInputChange={this.onInputChange} />
              <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box} />
            </div>

        :<div>
        <div className='rowC'>
          <Logo />
          <SigninButton onRouteChange={this.onRouteChange} />
          </div>
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          </div>
        )
        
        
        }
    </div>
  );
  }
  
}

export default App;
