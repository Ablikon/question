import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Survey from './components/Survey'
import Admin from './components/Admin'
import ThankYou from './components/ThankYou'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Survey />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin-secret-panel-2024" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
