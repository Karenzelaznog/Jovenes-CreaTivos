export default function VideoFondo() {
  return (
    <div className="video-fondo" aria-hidden="true">
      <video autoPlay loop muted playsInline preload="metadata">
        <source src={`${import.meta.env.BASE_URL}video-fondo.mp4`} type="video/mp4" />
      </video>
    </div>
  )
}
