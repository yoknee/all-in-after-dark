import { useState } from 'react'

const GRADES = ['K', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th']

interface GradeMultiSelectProps {
  selectedGrades: string[]
  onChange: (grades: string[]) => void
  error?: string
}

export function GradeMultiSelect({ selectedGrades, onChange, error }: GradeMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleGrade = (grade: string) => {
    if (selectedGrades.includes(grade)) {
      onChange(selectedGrades.filter((g) => g !== grade))
    } else {
      onChange([...selectedGrades, grade])
    }
  }

  const getDisplayText = () => {
    if (selectedGrades.length === 0) {
      return 'Select grade(s)'
    }
    if (selectedGrades.length === 1) {
      const grade = selectedGrades[0]
      return grade === 'K' ? 'Kindergarten' : `${grade} Grade`
    }
    return `${selectedGrades.length} grades selected`
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-dark-brown-2 border-2 border-gold rounded text-cream focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] font-baskerville text-left flex items-center justify-between ${
          error ? 'border-red-500' : ''
        }`}
      >
        <span className={selectedGrades.length === 0 ? 'opacity-50' : ''}>{getDisplayText()}</span>
        <span className="text-gold ml-2">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-dark-brown-2 border-2 border-gold rounded shadow-lg max-h-64 overflow-y-auto">
            <div className="p-2 space-y-2">
              {GRADES.map((grade) => {
                const isSelected = selectedGrades.includes(grade)
                return (
                  <label
                    key={grade}
                    className="flex items-center cursor-pointer px-3 py-2 hover:bg-[rgba(212,175,55,0.1)] rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleGrade(grade)}
                      className="mr-3 w-5 h-5 text-gold focus:ring-gold accent-gold cursor-pointer"
                    />
                    <span className="text-cream">
                      {grade === 'K' ? 'Kindergarten' : `${grade} Grade`}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        </>
      )}

      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  )
}
