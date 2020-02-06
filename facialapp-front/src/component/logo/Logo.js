import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import ai from './ai.png'

const Logo = () => {
 return(
    <div className= "ma4 mt0">
    <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 100, width: 100 }} >
            <div className="Tilt-inner"> <img src={ai} alt="ai brain" /> </div>
    </Tilt>
    </div>

    
 );
}

export default Logo;