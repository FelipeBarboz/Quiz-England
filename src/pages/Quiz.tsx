import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
// @ts-ignore
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";

type Question = {
  question: string;
  image: string;
  options: string[];
  answer: number;
};

const questions: Question[] = [
  {
    question: "Qual é a capital da Inglaterra?",
    image: "/images/londres.jpg",
    options: ["Londres", "Paris", "Berlim", "Roma"],
    answer: 0,
  },
  {
    question: "Quem escreveu 'Romeu e Julieta'?",
    image: "/images/romeu-and-julieta.jpg",
    options: ["Austen", "Dickens", "Tolkien", "Shakespeare"],
    answer: 3,
  },
  {
    question: "Qual país inventou o futebol moderno?",
    image: "/images/totao.jpg",
    options: ["Inglaterra", "Brasil", "Alemanha", "Argentina"],
    answer: 0,
  },
  {
    question: "Qual é o famoso relógio de Londres?",
    image: "/images/big-ben.jpg",
    options: ["Big Ben", "Tower Bridge", "London Eye", "Buckingham Palace"],
    answer: 0,
  },
  {
    question: "Qual desses é um prato típico inglês?",
    image: "/images/comida.jpg",
    options: ["Sushi", "Tacos", "Fish and Chips", "Curry"],
    answer: 2,
  },
  {
    question: "Como se chama a moeda usada na Inglaterra?",
    image: "/images/moeda.jpg",
    options: ["Dólar", "Euro", "Libra Esterlina", "Iene"],
    answer: 2,
  },
  {
    question: "Qual é o nome do famoso palácio onde vive o rei/monarca da Inglaterra?",
    image: "/images/palacio.jpg",
    options: [
      "Buckingham Palace",
      "Windsor Castle",
      "Kensington Palace",
      "St. James's Palace",
    ],
    answer: 0,
  },
  {
    question: "Quem criou a história do Harry Potter?",
    image: "/images/harrypotter.jpg",
    options: [
      "J.R.R. Tolkien",
      "Rick Riordan",
      "J.K. Rowling",
      "Suzanne Collins",
    ],
    answer: 2,
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(100);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const scoreRef = useRef<HTMLDivElement>(null);

  // Agora garantimos que o número está SEM máscara
  const rawPhone = localStorage.getItem("phone") || "";
  const cleanPhone = rawPhone.replace(/\D/g, "");

  const calculatePoints = (progress: number) => {
    const bonus = Math.round((progress / 100) * 30);
    return 20 + bonus;
  };

  const nextQuestion = () => {
    if (current + 1 < questions.length) {
      setSelected(null);
      setCurrent((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  async function saveScore(phone: string, score: number) {
    if (!phone) {
      console.error("Telefone vazio ao tentar salvar score.");
      return;
    }

  const { data, error } = await supabase
    .from("USERS")
    .update({ scores: score })
    .eq("phone", phone);

    if (error) {
      console.error("Erro ao salvar score:", error.message);
    } else {
      console.log("Score atualizado com sucesso!", data);
    }
  }

  useEffect(() => {
    if (selected !== null || isFinished) return;

    setProgress(100);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setSelected(-1);
          return 0;
        }
        return prev - 1.67;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [current, selected, isFinished]);

  useEffect(() => {
    if (isFinished) {
      saveScore(cleanPhone, score);

      let current = 0;
      const countInterval = setInterval(() => {
        current += 1;
        setAnimatedScore(current);
        if (current >= score) {
          clearInterval(countInterval);

          if (scoreRef.current) {
            const rect = scoreRef.current.getBoundingClientRect();
            const duration = 1000;
            const animationEnd = Date.now() + duration;
            const defaults = {
              startVelocity: 20,
              spread: 90,
              ticks: 60,
              zIndex: 1000,
            };

            const confettiInterval = setInterval(() => {
              const timeLeft = animationEnd - Date.now();
              if (timeLeft <= 0) {
                clearInterval(confettiInterval);
              } else {
                confetti({
                  ...defaults,
                  particleCount: 30,
                  origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight,
                  },
                });
              }
            }, 200);
          }
        }
      }, 20);
    }
  }, [isFinished, score]);

  if (isFinished) {
    return (
      <div className="w-full max-w-xl mx-auto p-4 text-center space-y-6">
        <h1 className="text-3xl font-bold text-red-600">Parabéns!</h1>
        <p className="text-xl">Sua pontuação final foi:</p>
        <motion.div
          ref={scoreRef}
          className="text-5xl font-extrabold text-purple-700"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {animatedScore}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 text-center space-y-6">
      <div className="h-2 animate-pulse">
        <Progress value={progress} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold">{questions[current].question}</h2>

          <motion.img
            src={questions[current].image}
            alt=""
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full h-40 object-cover mx-auto rounded-xl shadow-md"
          />

          <div className="grid grid-cols-2 gap-4">
            {questions[current].options.map((option, i) => {
              const color = "bg-red-500";
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-xl font-semibold transition-all duration-200 ${
                    selected === null
                      ? `${color} text-white`
                      : i === questions[current].answer
                      ? "bg-green-500 text-white"
                      : i === selected
                      ? "bg-red-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                  onClick={() => {
                    if (selected === null) {
                      setSelected(i);
                      const correct = i === questions[current].answer;
                      if (correct) {
                        const earned = calculatePoints(progress);
                        setScore((prev) => prev + earned);
                      }
                    }
                  }}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextQuestion}
              className="mt-4 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow"
            >
              Próxima
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}