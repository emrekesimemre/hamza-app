interface OptionButtonsProps {
  options: { value: number; label: string }[]
  onSelect: (value: number) => void
  disabled?: boolean
  selectedValue?: number | null
  correctValue?: number | null
}

export function OptionButtons({
  options,
  onSelect,
  disabled,
  selectedValue,
  correctValue,
}: OptionButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((option) => {
        const isSelected = selectedValue === option.value
        const showCorrect = correctValue !== null && correctValue !== undefined && isSelected
        const showWrong =
          isSelected && correctValue !== null && correctValue !== undefined && !showCorrect

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option.value)}
            className={`rounded-2xl py-6 text-3xl font-extrabold shadow-md transition active:scale-95 disabled:opacity-60 ${
              showCorrect
                ? 'bg-green-500 text-white'
                : showWrong
                  ? 'bg-orange-300 text-white'
                  : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
