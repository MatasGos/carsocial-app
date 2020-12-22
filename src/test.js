import React from 'react';

export class Image extends React.Component {
    render()
    {
      return <div className="container"><div className="col">
          <h1>Nuotrauka</h1>
          <img src="http://netdna.webdesignerdepot.com/uploads/2013/11/picjumbo.com_DSC_3274.jpg" style={{"maxWidth":"50%"}} />
      </div>
      </div>
    }
  }

