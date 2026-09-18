import React, { useEffect, useState } from 'react';
import './IndianAmbulanceAnimation.css';

export const IndianAmbulanceAnimation: React.FC = () => {
  const [sirenOn, setSirenOn] = useState(false);

  useEffect(() => {
    return () => {
      setSirenOn(false);
    };
  }, []);

  return (
    <section className="ambulance-stage">
      <div className="ambulance-stage-glow" />

      <div className="ambulance-message">
        <span className="ambulance-live-dot" />
        EMERGENCY RESPONSE • 112
      </div>

      <button
        type="button"
        className={`siren-button ${sirenOn ? 'siren-active' : ''}`}
        onClick={() => setSirenOn(!sirenOn)}
      >
        {sirenOn ? '🔊 Siren ON' : '🔇 Start Siren'}
      </button>

      <div className="ambulance-road">
        <div className="road-line line-1" />
        <div className="road-line line-2" />
        <div className="road-line line-3" />
        <div className="road-line line-4" />
      </div>

      <div
        className={`indian-ambulance-wrap ${
          sirenOn ? 'ambulance-siren-active' : ''
        }`}
      >
        <div className="siren-light-bar">
          <span className="siren-red" />
          <span className="siren-blue" />
        </div>

        <div className="ambulance-body">
          <div className="ambulance-cabin">
            <div className="front-windshield">
              <div className="driver-silhouette" />
            </div>

            <div className="side-window">
              <div className="window-cross">
                <span />
                <span />
              </div>
            </div>
          </div>

          <div className="ambulance-front">
            <div className="front-light left-light" />
            <div className="front-light right-light" />

            <div className="ambulance-grille">
              <span />
              <span />
              <span />
            </div>

            <div className="ambulance-number">112</div>
          </div>

          <div className="ambulance-stripe">
            <span>AMBULANCE</span>
            <strong>✚</strong>
          </div>

          <div className="india-mark">
            <span>INDIA</span>
            <small>EMERGENCY MEDICAL SERVICE</small>
          </div>

          <div className="star-of-life">✚</div>

          <div className="ambulance-wheel wheel-back">
            <div className="wheel-center" />
          </div>

          <div className="ambulance-wheel wheel-front">
            <div className="wheel-center" />
          </div>
        </div>
      </div>

      <div className="ambulance-status">
        <span className="status-pulse" />
        Ambulance responding
      </div>
    </section>
  );
};