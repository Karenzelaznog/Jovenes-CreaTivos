import { useState } from 'react'
import './CookieConsent.css'

const COOKIE = 'skincary_cookie_consent'

function leerPreferencia() {
  const preferencia = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${COOKIE}=`))
    ?.split('=')[1]

  return ['all', 'necessary'].includes(preferencia) ? preferencia : null
}

export default function CookieConsent() {
  const [preferencia, setPreferencia] = useState(leerPreferencia)
  const [error, setError] = useState('')

  const guardarPreferencia = (valor) => {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${COOKIE}=${valor}; Path=/; Max-Age=15552000; SameSite=Lax${secure}`

    if (leerPreferencia() !== valor) {
      setError('No pudimos guardar tu preferencia. Revisa la configuración de cookies de tu navegador.')
      return
    }

    setPreferencia(valor)
    setError('')
  }

  if (preferencia) return null

  return (
    <aside className="cookies-aviso" aria-label="Preferencias de cookies">
      <div className="cookies-texto">
        <strong>Tu privacidad también importa ☁</strong>
        <p>
          Usamos una cookie propia para recordar tu elección. Por ahora no activamos cookies
          de publicidad ni de análisis.
        </p>
      </div>
      <div className="cookies-acciones">
        <button type="button" className="cookies-necesarias" onClick={() => guardarPreferencia('necessary')}>
          Solo necesarias
        </button>
        <button type="button" className="cookies-aceptar" onClick={() => guardarPreferencia('all')}>
          Aceptar todas
        </button>
      </div>
      {error && <p className="cookies-error" role="alert">{error}</p>}
    </aside>
  )
}
