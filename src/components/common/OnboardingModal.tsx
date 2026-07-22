interface OnboardingModalProps {
  onComplete: () => void
}

const STEPS = [
  { emoji: '🎮', text: 'İstediğin oyunu seç ve oyna!' },
  { emoji: '⭐', text: '3 bonus macerayı bitir, ekstra yıldız kazan!' },
  { emoji: '⏰', text: 'Süren dolunca dinlen — yarın yine gel!' },
]

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="animate-bounce-in w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-sky-700">
          Hoş geldin Hamza! 🦖
        </h2>
        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl bg-sky-50 p-4">
              <span className="text-4xl">{step.emoji}</span>
              <p className="text-lg font-semibold text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="mt-8 w-full rounded-2xl bg-sky-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-sky-600 active:scale-95"
        >
          MACERAYA BAŞLA!
        </button>
      </div>
    </div>
  )
}
