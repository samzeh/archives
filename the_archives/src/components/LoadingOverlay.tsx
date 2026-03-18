import loadingGif from '../assets/loading.gif';

export default function LoadingOverlay({ message = 'loading...', style = {}, imgSize = 300 }) {
  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#44362d', fontSize: '1.5rem', zIndex: 10,
        flexDirection: 'column',
        background: '#FFF8EE',
        ...style,
      }}
    >
      <img src={loadingGif} alt="Loading..." style={{ width: imgSize, height: imgSize }} />
      <p>{message}</p>
    </div>
  );
}
