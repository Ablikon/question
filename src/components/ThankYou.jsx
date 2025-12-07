import { motion } from 'framer-motion'

function ThankYou() {
  return (
    <div className="thank-you-container">
      <motion.div
        className="thank-you-content"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>💜 Спасибо, солнышко! 💜</h1>
        <p>Твои ответы очень важны для меня.</p>
        <p>Я люблю тебя и всегда готов выслушать ❤️</p>
      </motion.div>
    </div>
  )
}

export default ThankYou
