import { useState } from "react";
import Question from "./composants/Question.tsx";
import Score from "./composants/Score.tsx";
import Validate from "./composants/Validate.tsx";
import "./App.css";

function List() {
  const [project, setProject] = useState({});

  fetch('/data/fichier.json')
  .then(response => response.json())
  .then(data => {
    setProject(data);
  })
  .catch(error => {
    console.error('Erreur :', error);
  });


  return (
    <div>

    </div>
  );
}

export default List;
