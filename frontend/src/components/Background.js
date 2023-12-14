import React from 'react';
import backgroundImage from '../../assets/volcano.png'

function Background() {
  const sectionStyle = {
    width: '100%',
    height: '400px', // or '100vh' for full viewport height
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative', // Needed to position the overlay
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // This is a black overlay with 50% opacity
  };

  return (
    <div style={sectionStyle}>
      <div style={overlayStyle} />
      {/* Content of your component */}
    </div>
  );
}

export default Background;
