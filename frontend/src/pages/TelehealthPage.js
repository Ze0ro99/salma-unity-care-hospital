import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './TelehealthPage.css'; // Import a CSS file for styling

const APP_ID = 'YOUR_APP_ID'; // Replace with your Agora App ID
const TOKEN = null; // Use a token if your Agora project requires it

const TelehealthPage = ({ appointmentId }) => {
  const [client, setClient] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initClient = async () => {
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      setClient(agoraClient);

      try {
        await agoraClient.join(APP_ID, `session_${appointmentId}`, TOKEN);
        const localStream = AgoraRTC.createStream({ video: true, audio: true });
        await localStream.init();
        localStream.play('video-container');
        await agoraClient.publish(localStream);
        setLocalStream(localStream);
      } catch (err) {
        setError('Error joining the channel: ' + err.message);
      }
    };

    initClient();

    return () => {
      if (client) {
        client.leave();
        if (localStream) {
          localStream.stop();
          localStream.close();
        }
      }
    };
  }, [appointmentId]);

  useEffect(() => {
    if (client) {
      client.on('stream-added', (evt) => {
        const remoteStream = evt.stream;
        client.subscribe(remoteStream, (err) => {
          console.error('Error subscribing to remote stream: ', err);
        });
      });

      client.on('stream-subscribed', (evt) => {
        const remoteStream = evt.stream;
        setRemoteStreams((prevStreams) => [...prevStreams, remoteStream]);
        remoteStream.play(`remote-video-${remoteStream.getId()}`);
      });

      client.on('stream-removed', (evt) => {
        const remoteStream = evt.stream;
        remoteStream.stop();
        setRemoteStreams((prevStreams) => prevStreams.filter((stream) => stream.getId() !== remoteStream.getId()));
      });
    }
  }, [client]);

  return (
    <div className="telehealth-container">
      {error && <div className="error-message">{error}</div>}
      <div id="video-container" className="telehealth-video">
        <div id="local-video" className="local-video"></div>
        {remoteStreams.map((stream) => (
          <div key={stream.getId()} id={`remote-video-${stream.getId()}`} className="remote-video"></div>
        ))}
      </div>
      <button onClick={() => localStream?.toggleAudio()} className="toggle-audio">
        Toggle Audio
      </button>
      <button onClick={() => localStream?.toggleVideo()} className="toggle-video">
        Toggle Video
      </button>
      <button onClick={() => localStream?.getMediaStream().getTracks().forEach(track => track.stop())} className="end-call">
        End Call
      </button>
    </div>
  );
};

export default TelehealthPage;
