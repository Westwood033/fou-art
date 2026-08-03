import { useState } from "react";
import Question from "./composants/Question.tsx";
import Score from "./composants/Score.tsx";
import Validate from "./composants/Validate.tsx";
import "./App.css";

function App() {
  const questions = [
    { id: 1, title: "Objectifs clairement définis" },
    { id: 2, title: "Budget réalisé" },
    { id: 3, title: "Date et horaires validés" },
    { id: 4, title: "Lieu adapté à l'événement" },
    { id: 5, title: "Capacité d'accueil suffisante" },
    { id: 6, title: "Moyens techniques disponibles" },
    { id: 7, title: "Communication préparée" },
    { id: 8, title: "Équipe mobilisée" },
    { id: 9, title: "Animations définies" },
    { id: 10, title: "Partenaires confirmés" },
    { id: 11, title: "Sécurité anticipée" },
    { id: 12, title: "Assurances et autorisations" },
    { id: 13, title: "Plan B prévu" },
    { id: 14, title: "Gestion des ressources du site" },
    { id: 15, title: "Suivi de fichier" },
    { id: 16, title: "Motivation du porteur de projet" },
    { id: 17, title: "Potentiel d'attractivité" },
    { id: 18, title: "Faisabilité logistique" },
    { id: 19, title: "Approbation du conseiller" },
    { id: 20, title: "Risques identifiés et maîtrisés" },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bonus, setBonus] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [showValidate, setShowValidate] = useState(false);
  const [scoreData, setScoreData] = useState({});
  const [message, setMessage] = useState("");
  const [questionToScore, setQuestionToScore] = useState({});

  const goToPrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = (bonusData: {}) => {
    setBonus(bonusData);
    console.log(bonusData)
    console.log(bonus)
    setShowValidate(true);
  };

  const handleAnswer = (answer: number | string) => {
    const question = questions[currentQuestion];

    const newAnswers = {
      ...answers,
      [question.id]: answer,
    };

    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      return;
    }

    let score = 0;

    Object.values(newAnswers).forEach((answer) => {
      if (answer !== "NA" && typeof answer === "number") {
        score += answer;
      }
    });

    
    
    setQuestionToScore(Object.entries(newAnswers)
      .map(([id, answer]) => ({
        question: questions.find(
          (question) => question.id === Number(id)
        ),
        answer,
      })))

    const priorites = Object.entries(newAnswers)
      .filter(([_, answer]) => answer === "NA" || Number(answer) < 3)
      .map(([id, answer]) => ({
        question: questions.find(
          (question) => question.id === Number(id)
        ),
        answer,
      }));


    if (score >= 90) {
      setMessage("Projet prêt au lancement. Validation recommandée.");
    } else if (score >= 75) {
      setMessage("Projet solide. Quelques ajustements sont conseillés avant validation.");
    } else if (score >= 60) {
      setMessage("Projet réalisable mais nécessitant un accompagnement renforcé. Ainsi que l'avis accompagnateur");
    } else if (score >= 40) {
      setMessage("Projet insuffisamment préparé. Des actions correctuves sont indispensables.");
    } else if (score >= 0) {
      setMessage("Projet non viable dans son état actuel. Une reffonte est recommandée avec toute mise en oeuvre.");
    }


    setScoreData({
      score,
      priorite: priorites,
    });

    setShowScore(true);
  };


  return (
    <div>
      {showValidate ? (
        <Validate
          message={message}
          score={scoreData?.score ?? 0}
          questions={questionToScore}
          bonus={bonus}
        />
      ) : showScore ? (
        <Score
          message={message}
          score={scoreData?.score ?? 0}
          priorite={scoreData?.priorite ?? []}
          onSubmit={handleSubmit}
        />
      ) : (
        <>
          <h2 className="progression">
            {currentQuestion + 1} / {questions.length}
          </h2>

          <Question
            question={questions[currentQuestion]}
            onAnswer={handleAnswer}
          />

          {currentQuestion > 0 && (
            <div className="container-prev">
              <button
                className="button-prev"
                onClick={goToPrev}
              >
                Revenir au critère précédent
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
