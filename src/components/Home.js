import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const imageStyle = {
    width: '400px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const imageContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    margin: '12.5px 25px 0 25px',
    width: '400px',
    height: '200px',
  };

  const bottomImageContainerStyle = {
    ...imageContainerStyle,
    marginBottom: 0,
  };

  const buttonStyle = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    padding: '5px 10px',
    backgroundColor: '#C9E9D2',
    color: 'black',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '14px',
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0 50px',
    justifyContent: 'center',
    maxWidth: '1000px',
  };

  const homeStyle = {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 20px 0',
    backgroundColor: '#DFF2EB',
    height: 'calc(100vh - 80px)',
   };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="Home" style={homeStyle}>
      <div style={containerStyle}>
        <div style={imageContainerStyle}>
          <img 
            src="./inventory.png"
            alt="Inventory" 
            style={imageStyle}
            onClick={() => handleNavigation('/inventory')}
          />
          <div 
            style={buttonStyle}
            onClick={() => handleNavigation('/inventory')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E2F1E7'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#C9E9D2'}
          >
            Inventory
          </div>
        </div>
        <div style={imageContainerStyle}>
          <img 
            src="./prescription.jpg" 
            alt="Prescription" 
            style={imageStyle}
            onClick={() => handleNavigation('/prescription')}
          />
          <div 
            style={buttonStyle}
            onClick={() => handleNavigation('/prescription')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E2F1E7'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#C9E9D2'}
          >
            Prescription
          </div>
        </div>
        <div style={bottomImageContainerStyle}>
          <img 
            src="./Pharmacy.jpg"
            alt="Pharmacy" 
            style={imageStyle}
            onClick={() => handleNavigation('/pharmacy')}
          />
          <div 
            style={buttonStyle}
            onClick={() => handleNavigation('/pharmacy')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E2F1E7'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#C9E9D2'}
          >
            Pharmacy
          </div>
        </div>
        <div style={bottomImageContainerStyle}>
          <img 
            src="./orders.jpg" 
            alt="Orders" 
            style={imageStyle}
            onClick={() => handleNavigation('/orders')}
          />
          <div 
            style={buttonStyle}
            onClick={() => handleNavigation('/orders')}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#E2F1E7'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#C9E9D2'}
          >
            Orders
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
