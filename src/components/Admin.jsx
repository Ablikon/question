import { useState, useEffect } from 'react'
import axios from 'axios'
import './Admin.css'

function Admin() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (authenticated) {
      fetchResponses()
    }
  }, [authenticated])

  const fetchResponses = async () => {
    try {
      const res = await axios.get('/api/survey')
      setResponses(res.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching responses:', error)
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Точно удалить это прохождение?')) {
      try {
        await axios.delete(`/api/survey/${id}`)
        setResponses(responses.filter(r => r.id !== id))
      } catch (error) {
        console.error('Error deleting response:', error)
        alert('Ошибка при удалении')
      }
    }
  }

  const handleLogin = () => {
    if (password === 'altyn2024') {
      setAuthenticated(true)
    } else {
      alert('Неверный пароль')
    }
  }

  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Админ-панель</h2>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Войти</button>
        </div>
      </div>
    )
  }

  if (loading) {
    return <div className="admin-container"><p>Загрузка...</p></div>
  }

  if (responses.length === 0) {
    return <div className="admin-container"><p>Пока нет ответов</p></div>
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>💜 Ответы на опросник</h1>
        <p>Всего прохождений: {responses.length}</p>
      </div>

      {responses.map((response, index) => {
        const averageScore = (response.answers.reduce((sum, a) => sum + a.value, 0) / response.answers.length).toFixed(1)
        
        return (
          <div key={response.id} className="response-section">
            <div className="response-header">
              <div>
                <h2>Прохождение #{responses.length - index}</h2>
                <div className="response-meta">
                  <span className="device-badge">{response.device || 'Desktop'}</span>
                  <span className="date-time">
                    {new Date(response.submittedAt).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="avg-score">Средний балл: {averageScore}/10</span>
                </div>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(response.id)}>
                🗑️ Удалить
              </button>
            </div>

            <div className="answers-list">
              {response.answers.map((answer, ansIndex) => (
                <div key={ansIndex} className="answer-card">
                  <div className="answer-header">
                    <span className="question-number">Вопрос {answer.questionId}</span>
                    <span className="answer-value">Оценка: {answer.value}/10</span>
                  </div>
                  <p className="question-text">{answer.questionText}</p>
                  {answer.comment && (
                    <div className="answer-comment">
                      <strong>Комментарий:</strong>
                      <p>{answer.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Admin
