import React from 'react';
import './App.css';
import Audio from './components/Audio/Audio'

function App() {
    return (
        <div className="App">
            <div className="view"></div>
            <div className="top-part">
                <div className="window"></div>
            </div>
            <div className="bottom-part">
                <Audio></Audio>
            </div>
        </div>
    );
}

export default App;
