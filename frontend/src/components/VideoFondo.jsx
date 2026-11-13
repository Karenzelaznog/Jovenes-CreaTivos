// Video decorativo de la portada. Silenciado y en bucle: los navegadores solo
// permiten reproducirlo solo si tiene muted + playsInline.
export default function VideoFondo() {
  const src = import.meta.env.BASE_URL + 'video-fondo.mp4'
  return (
    <video
      className="video-fondo"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  )
}