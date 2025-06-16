import React, { useState } from 'react';
import './Popup.css'; // optional CSS

const Popup = () => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPopup(true)}>Show Popup</button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Submission Result</h3>
            <p>Your solution passed all test cases! 🎉</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
