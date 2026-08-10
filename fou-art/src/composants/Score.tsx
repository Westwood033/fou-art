import { useState } from "react";
import "./../style/Score.css";
import logo from "./../images/foufou.jpg";


function Score({message, score, priorite, onSubmit }) {
    const [probabilite, setProbabilite] = useState("");
    const [avis, setAvis] = useState("");
    const [nom, setNom] = useState("");
    const [numProject, setNumProject] = useState("");
    const [newPriority, setNewPriority] = useState([]);

    const addPriority = () => {
        setNewPriority([
            ...newPriority,
            {
                id: newPriority.length ?? 0 ,
                value: ""
            }
        ]);
    };

    const feelPriority = (id, content) => {
        setNewPriority(
            newPriority.map((p) =>
                p.id === id
                    ? { ...p, value: content }
                    : p
            )
        );
    };

    const removePriority = (id) => {
        setNewPriority(
            newPriority.filter((p) => p.id !== id)
        );
    };

    const handleSubmit = () => {
        onSubmit({
            numProject,
            nom,
            probabilite,
            avis,
            priorite: [
                ...priorite,
                ...newPriority
            ]
        });
};
    return (
    <div className="score-page">

        <div className="score-circle">
            {score}/100
        </div>

        <div className="legende">{message}</div>

        <div className="question-card">

            <div className="title-container">
                <div className="score-title">
                    Numéro de projet
                </div>

                <input
                    value={numProject}
                    onChange={(e) => setNumProject(e.target.value)}
                />
            </div>

            <div className="title-container">
                <div className="score-title">
                    Nom de l'accompagnant
                </div>

                <input
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
            </div>


            <div className="title-container">
                <div className="score-title">
                    Commentaire
                </div>

                <textarea
                    value={probabilite}
                    onChange={(e) => setProbabilite(e.target.value)}
                />
            </div>

            {score < 70 && score > 40 && 
                (
                    <>
                        <div className="title-container">
                            <div className="score-title">
                                Avis de l'accompagnateur
                            </div>

                            <select
                                value={avis}
                                onChange={(e) => setAvis(e.target.value)}
                            >
                                <option value="">
                                    Sélectionner un avis
                                </option>
                                <option value="Validation sans réserve">
                                    Validation sans réserve
                                </option>
                                <option value="Validation sous conditions">
                                    Validation sous conditions
                                </option>
                                <option value="Report conseillé">
                                    Report conseillé
                                </option>
                                <option value="Refonte du projet">
                                    Refonte du projet
                                </option>
                                <option value="Refus de l'accompagnement">
                                    Refus de l'accompagnement
                                </option>
                            </select>
                        </div>
                    </>
                )
            }


            <div className="priority-section">
                <div className="score-title">
                    Priorité du projet
                </div>

                {priorite.length > 0 ? (
                    <ul>
                        {priorite.map((item, index) => (
                            <li key={index}>
                                {item.question.title} :  {item.answer}/5
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        Aucun critère avec un score insatisfaisant
                    </p>
                )}
            </div>


            <button onClick={addPriority}>
                Ajouter une priorité
            </button>


            {newPriority.length > 0 &&
                newPriority.map((p) => (
                    <div className="priority-input" key={p.id}>
                        <input
                            type="text"
                            onChange={(e) =>
                                feelPriority(p.id, e.target.value)
                            }
                        />

                        <button className="delete-button" onClick={() => removePriority(p.id)}>
                            Supprimer
                        </button>
                    </div>
                ))
            }


            <button onClick={() => handleSubmit()}>
                Valider
            </button>

        </div>

    </div>
);
}

export default Score;