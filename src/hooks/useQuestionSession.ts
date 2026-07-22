import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMissionStore } from '@/store/useMissionStore'
import { fireStarBurst } from '@/utils/confetti'
import { playSound } from '@/utils/sound'
import {
  BONUS_QUESTION_COUNT,
  SESSION_QUESTION_COUNT,
} from '@/missions/modules/types'

interface UseQuestionSessionOptions<T> {
  generateQuestion: () => T
  /** Oturum başında benzersiz soru seti üretir. excludeKeys ile tekrar engellenir. */
  generateSession?: (count: number, excludeKeys?: string[]) => T[]
  getQuestionKey?: (question: T) => string
  onComplete: () => void
  minAccuracy?: number
}

function getAccuracy(correct: number, wrong: number): number {
  const total = correct + wrong
  if (total === 0) return 1
  return correct / total
}

export function useQuestionSession<T>({
  generateQuestion,
  generateSession,
  getQuestionKey,
  onComplete,
  minAccuracy = 0.6,
}: UseQuestionSessionOptions<T>) {
  const recordAnswer = useMissionStore((s) => s.recordAnswer)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)

  const [questions, setQuestions] = useState<T[]>(() =>
    generateSession
      ? generateSession(SESSION_QUESTION_COUNT)
      : Array.from({ length: SESSION_QUESTION_COUNT }, () => generateQuestion()),
  )
  const [questionIndex, setQuestionIndex] = useState(0)
  const [showWrong, setShowWrong] = useState(false)
  const [showBonusRound, setShowBonusRound] = useState(false)
  const [selectedValue, setSelectedValue] = useState<number | null>(null)
  const [answeredCorrectly, setAnsweredCorrectly] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [wrongAttemptsOnQuestion, setWrongAttemptsOnQuestion] = useState(0)

  const currentQuestion = questions[questionIndex]
  const totalQuestions = questions.length

  useEffect(() => {
    setWrongAttemptsOnQuestion(0)
  }, [questionIndex])

  const finishOrBonus = useCallback(() => {
    const progress = useMissionStore.getState().currentMissionProgress
    const accuracy = getAccuracy(
      progress?.correctCount ?? 0,
      progress?.wrongCount ?? 0,
    )

    if (!showBonusRound && accuracy < minAccuracy) {
      setShowBonusRound(true)
      setQuestions((prev) => {
        const excludeKeys = getQuestionKey ? prev.map(getQuestionKey) : []
        const bonus = generateSession
          ? generateSession(BONUS_QUESTION_COUNT, excludeKeys)
          : Array.from({ length: BONUS_QUESTION_COUNT }, () => generateQuestion())
        return [...prev, ...bonus]
      })
      setQuestionIndex(SESSION_QUESTION_COUNT)
      setSelectedValue(null)
      setAnsweredCorrectly(null)
      setLocked(false)
      return
    }

    onComplete()
  }, [showBonusRound, minAccuracy, generateQuestion, generateSession, getQuestionKey, onComplete])

  const advanceOrFinish = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        recordAnswer(true)
        fireStarBurst()
        if (soundEnabled) playSound('correct')

        window.setTimeout(() => {
          if (questionIndex + 1 >= totalQuestions) {
            finishOrBonus()
          } else {
            setQuestionIndex((i) => i + 1)
            setSelectedValue(null)
            setAnsweredCorrectly(null)
            setLocked(false)
            setWrongAttemptsOnQuestion(0)
          }
        }, 800)
        return
      }

      recordAnswer(false)
      setWrongAttemptsOnQuestion((n) => n + 1)
      setShowWrong(true)
      if (soundEnabled) playSound('wrong')
      window.setTimeout(() => {
        setShowWrong(false)
        setSelectedValue(null)
        setLocked(false)
      }, 1200)
    },
    [recordAnswer, questionIndex, totalQuestions, finishOrBonus, soundEnabled],
  )

  const handleAnswer = useCallback(
    (value: number, correctAnswer: number) => {
      if (locked) return

      setSelectedValue(value)
      setLocked(true)

      if (value === correctAnswer) {
        setAnsweredCorrectly(correctAnswer)
      }

      advanceOrFinish(value === correctAnswer)
    },
    [locked, advanceOrFinish],
  )

  const handleResult = useCallback(
    (isCorrect: boolean) => {
      if (locked) return
      setLocked(true)
      advanceOrFinish(isCorrect)
    },
    [locked, advanceOrFinish],
  )

  const progress = useMemo(
    () => ({
      current: questionIndex + 1,
      total: totalQuestions,
    }),
    [questionIndex, totalQuestions],
  )

  return {
    currentQuestion,
    progress,
    showWrong,
    showBonusRound,
    selectedValue,
    answeredCorrectly,
    locked,
    wrongAttemptsOnQuestion,
    handleAnswer,
    handleResult,
  }
}
