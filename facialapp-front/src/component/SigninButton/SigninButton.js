import React from 'react';

const SigninButton = ({onRouteChange}) => {
    return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p  onClick={()=>onRouteChange('signin')} className="pa3 f3 link dim black underline pointer">Sign in</p>
        </nav>
    );
}

export default SigninButton;