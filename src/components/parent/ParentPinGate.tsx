import { useState } from 'react'
import { verifyPin } from '@/utils/pin'

interface ParentPinGateProps {
  pinHash: string | null
  onVerified: () => void
  onSetupPin: (pin: string) => Promise<void>
}

export function ParentPinGate({ pinHash, onVerified, onSetupPin }: ParentPinGateProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isSetup = pinHash === null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSetup) {
        if (pin.length < 4) {
          setError('PIN en az 4 haneli olmalı')
          return
        }
        await onSetupPin(pin)
        onVerified()
      } else {
        const valid = await verifyPin(pin, pinHash)
        if (valid) {
          onVerified()
        } else {
          setError('Yanlış PIN, tekrar dene')
          setPin('')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl bg-white p-8 shadow-xl">
      <div className="mb-6 text-center text-5xl">👨‍👩‍👦</div>
      <h2 className="mb-2 text-center text-xl font-extrabold text-gray-800">Ebeveyn Alanı</h2>
      <p className="mb-6 text-center text-gray-500">
        {isSetup ? 'İlk kez giriyorsun — bir PIN belirle' : 'Devam etmek için PIN gir'}
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          placeholder="••••"
          className="mb-4 w-full rounded-2xl border-2 border-gray-200 px-4 py-4 text-center text-2xl tracking-widest focus:border-sky-400 focus:outline-none"
          autoFocus
        />
        {error && <p className="mb-4 text-center text-sm font-semibold text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || pin.length < 4}
          className="w-full rounded-2xl bg-sky-600 py-4 font-bold text-white transition hover:bg-sky-700 disabled:opacity-50 active:scale-95"
        >
          {isSetup ? 'PIN Oluştur' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  )
}
