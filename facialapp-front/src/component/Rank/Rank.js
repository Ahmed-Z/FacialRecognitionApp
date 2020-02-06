import React from 'react';

const Rank = ({name , entries}) => {
 return(
    <div>
      <div className="f3">
         <p>{name}, your currnet entry count is: </p>
      </div>
      <div className="f2">
         {entries}
      </div>
    </div>
    
 );
}

export default Rank;