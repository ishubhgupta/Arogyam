import React, { useState } from 'react';
import './RoutineGenerator.css';
import TherapyNavbar from '../components/TherapyNavbar';

const RoutineGenerator = () => {
  const [selectedPainPoints, setSelectedPainPoints] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [routineResponse, setRoutineResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const rows = [
    // First row (4)
    ['stress', 'anxiety', 'insomnia', 'headaches'],
    // Second row (4)
    ['digestive-issues', 'skin-issues', 'respiratory', 'muscle-pain'],
    // Third row (2)
    ['hormonal-imbalance', 'mood-swings']
  ];

  const handlePainPointChange = (point) => {
    setSelectedPainPoints(prev => 
      prev.includes(point) 
        ? prev.filter(p => p !== point)
        : [...prev, point]
    );
  };

  const generateRoutine = async () => {
    if (selectedPainPoints.length === 0) {
      alert('Please select at least one pain point.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8002/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Generate a weekly aroma therapy routine for the following conditions: ${selectedPainPoints.join(', ')}`
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRoutineResponse(data.response);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate routine. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TherapyNavbar />
      <div className="routine-page">
        <div className="container">
          <h2>Aroma Therapy Routine Generator</h2>
          
          <div className="pain-points-grid">
            {rows.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className={`pain-points-row ${rowIndex === 2 ? 'last-row' : ''}`}
              >
                {row.map(point => (
                  <div className="pain-point" key={point}>
                    <input
                      type="checkbox"
                      id={point}
                      checked={selectedPainPoints.includes(point)}
                      onChange={() => handlePainPointChange(point)}
                    />
                    <label htmlFor={point}>
                      {point.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                      <span className="checkmark"></span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="button-container">
            <button 
              className={`button ${isLoading ? 'loading' : ''}`} 
              onClick={generateRoutine}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate My Weekly Routine'}
            </button>
          </div>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Your Weekly Routine</h3>
              <div className="routine-text">
                {routineResponse.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              <button className="close-button" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RoutineGenerator;