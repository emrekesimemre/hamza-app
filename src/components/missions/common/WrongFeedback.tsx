interface WrongFeedbackProps {
  visible: boolean
}

export function WrongFeedback({ visible }: WrongFeedbackProps) {
  if (!visible) return null

  return (
    <div className="animate-bounce-in mb-4 rounded-2xl bg-orange-50 p-4 text-center text-lg font-bold text-orange-600">
      Bir daha deneyelim! 💪
    </div>
  )
}
