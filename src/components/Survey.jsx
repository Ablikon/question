import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

const questions = [
  {
    id: 1,
    text: "Как ты себя чувствуешь в последнее время?",
    minLabel: "Очень плохо",
    maxLabel: "Отлично"
  },
  {
    id: 2,
    text: "Что-то случилось или просто плохое настроение?",
    minLabel: "Что-то случилось",
    maxLabel: "Просто настроение"
  },
  {
    id: 3,
    text: "Есть ли у тебя что-то на душе, о чем ты не можешь рассказать?",
    minLabel: "Да, многое",
    maxLabel: "Нет, все рассказываю"
  },
  {
    id: 4,
    text: "Есть ли что-то, что тебя беспокоит в наших отношениях?",
    minLabel: "Очень беспокоит",
    maxLabel: "Ничего не беспокоит"
  },
  {
    id: 5,
    text: "Чувствуешь ли ты напряжение или усталость в последние дни?",
    minLabel: "Очень сильно",
    maxLabel: "Совсем не чувствую"
  },
  {
    id: 6,
    text: "Есть ли что-то, что ты хочешь мне сказать, но боишься или не знаешь как?",
    minLabel: "Да, есть",
    maxLabel: "Нет, говорю все"
  },
  {
    id: 7,
    text: "Раздражает ли тебя что-то в моем поведении в последнее время?",
    minLabel: "Очень раздражает",
    maxLabel: "Совсем не раздражает"
  },
  {
    id: 8,
    text: "Есть ли что-то, что ты хотела бы изменить между нами?",
    minLabel: "Многое хочу изменить",
    maxLabel: "Ничего менять не хочу"
  },
  {
    id: 9,
    text: "Переживаешь ли ты из-за чего-то, что не связано со мной?",
    minLabel: "Да, очень переживаю",
    maxLabel: "Нет, все спокойно"
  },
  {
    id: 10,
    text: "Напиши все, что у тебя на душе. Что угодно, что хочешь мне сказать 💜",
    minLabel: "",
    maxLabel: "",
    textOnly: true
  }
]

function Survey() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSliderChange = (value) => {
    setAnswers({
      ...answers,
      [currentQuestion]: {
        ...answers[currentQuestion],
        value: parseInt(value)
      }
    })
  }

  const handleTextChange = (text) => {
    setAnswers({
      ...answers,
      [currentQuestion]: {
        ...answers[currentQuestion],
        comment: text
      }
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formattedAnswers = questions.map((q, index) => ({
        questionId: q.id,
        questionText: q.text,
        value: answers[index]?.value || 5,
        comment: answers[index]?.comment || ''
      }))

      // Определение устройства
      const userAgent = navigator.userAgent
      let device = 'Desktop'
      if (/iPhone/i.test(userAgent)) {
        device = 'iPhone'
      } else if (/iPad/i.test(userAgent)) {
        device = 'iPad'
      } else if (/Android/i.test(userAgent)) {
        device = 'Android'
      } else if (/Mobile/i.test(userAgent)) {
        device = 'Mobile'
      }

      await axios.post('/api/survey', {
        answers: formattedAnswers,
        submittedAt: new Date().toISOString(),
        device: device,
        userAgent: userAgent
      })

      navigate('/thank-you')
    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('Произошла ошибка. Пожалуйста, попробуй еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentAnswer = answers[currentQuestion] || { value: 5, comment: '' }
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isTextOnlyQuestion = questions[currentQuestion].textOnly

  return (
    <div className="survey-container">
      <div className="survey-header">
        <h1>💜 Давай поговорим, котя 💜</h1>
        <p>Ответь честно, мне важно понять тебя</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="question-card">
            <div className="question-number">
              Вопрос {currentQuestion + 1} из {questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].text}
            </div>

            {!isTextOnlyQuestion && (
              <div className="slider-container">
                <div className="slider-labels">
                  <span>{questions[currentQuestion].minLabel}</span>
                  <span>{questions[currentQuestion].maxLabel}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentAnswer.value}
                  onChange={(e) => handleSliderChange(e.target.value)}
                  className="slider"
                />
                <div className="slider-value">
                  {currentAnswer.value}/10
                </div>
              </div>
            )}

            <textarea
              className="text-input"
              placeholder={isTextOnlyQuestion ? "Напиши все, что у тебя на душе..." : "Если хочешь, напиши подробнее..."}
              value={currentAnswer.comment}
              onChange={(e) => handleTextChange(e.target.value)}
              style={isTextOnlyQuestion ? { minHeight: '200px' } : {}}
            />

            <div className="button-container">
              {currentQuestion > 0 && (
                <button className="btn btn-secondary" onClick={handlePrevious}>
                  Назад
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {currentQuestion === questions.length - 1
                  ? isSubmitting ? 'Отправка...' : 'Отправить'
                  : 'Далее'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Survey
