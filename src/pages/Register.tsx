import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const rawPhone = phone.replace(/\D/g, '')

    if (rawPhone.length !== 11 || rawPhone[2] !== '9') {
      setError('O número deve ter 11 dígitos e começar com 9 após o DDD.')
      return
    }

    // Verifica se já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('USERS')
      .select('phone')
      .eq('phone', rawPhone)

    if (checkError) {
      console.error('Erro ao verificar duplicação:', checkError)
      setError('Erro interno, tente novamente mais tarde.')
      return
    }

    if (existingUser && existingUser.length > 0) {
      setError('Este número já foi registrado. Só é permitido um jogo por pessoa.')
      return
    }

    setError('')

    const { error: dbError } = await supabase.from('USERS').insert({
      name,
      phone: rawPhone,
    })

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError)
      setError('Erro ao registrar, tente novamente.')
      return
    }

    // Salva telefone no localStorage para usar depois no quiz
    localStorage.setItem('phone', rawPhone.replace(/\D/g, ''))
    navigate('/quiz')
  }

  const formatPhone = (value: string) => {
    const onlyDigits = value.replace(/\D/g, '').slice(0, 11)
    const match = onlyDigits.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/)

    if (!match) return value

    const [, ddd, first, second] = match
    let formatted = ''

    if (ddd) formatted += `(${ddd}`
    if (ddd && ddd.length === 2) formatted += ')'
    if (first) formatted += first
    if (second) formatted += `-${second}`

    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhone(input)
    setPhone(formatted)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <motion.h1
        className="text-5xl font-extrabold text-red-600 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Quiz England
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border-t-4 border-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          required
        />

        <input
          type="tel"
          placeholder="Número de celular (XX)9XXXX-XXXX"
          value={phone}
          onChange={handlePhoneChange}
          className={`w-full p-3 rounded-xl border ${
            error ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-red-500`}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-red-600 text-white p-3 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Play
        </motion.button>
      </motion.form>
    </div>
  )
}
