import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, box}) =>{
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <div className='mt2'>
                    <img id='inputimage' src={imageUrl} width='500px' height='auto' alt="" />
                    <div className='boundingBox' style = {{top: box.toprow, right: box.rightcol, bottom: box.bottomrow, left: box.leftcol}}></div>
                </div>
            </div>
        </div>
    );
}

export default FaceRecognition;