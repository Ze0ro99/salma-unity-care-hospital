import React, { useEffect } from 'react';
import 'aframe';
import 'aframe-ar';

const ARViewer = () => {
  useEffect(() => {
    // Add event listeners for interactivity
    const boxes = document.querySelectorAll('.interactive');
    boxes.forEach(box => {
      box.addEventListener('click', () => {
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        box.setAttribute('color', randomColor);
      });
    });
  }, []);

  return (
    <a-scene embedded arjs>
      <a-assets>
        <img id="sky" src="https://example.com/sky.jpg" />
      </a-assets>

      <a-sky src="#sky" rotation="0 -130 0"></a-sky>

      <a-light type="ambient" color="#FFF" intensity="0.5"></a-light>
      <a-light type="directional" color="#FFF" intensity="0.5" position="-1 1 1"></a-light>

      <a-box className="interactive" position="0 0 -5" rotation="0 45 0" color="#4CC3D9" animation="property: rotation; to: 0 405 0; loop: true; dur: 2000"></a-box>
      <a-sphere className="interactive" position="2 0 -5" radius="1" color="#EF2D5E" animation="property: position; to: 2 1 -5; dir: alternate; loop: true; dur: 1000"></a-sphere>
      <a-cylinder className="interactive" position="-2 0 -5" radius="0.5" height="1.5" color="#FFC65D" animation="property: scale; to: 1 1.5 1; dir: alternate; loop: true; dur: 1000"></a-cylinder>

      <a-camera position="0 1.6 0"></a-camera>
    </a-scene>
  );
};

export default ARViewer;
