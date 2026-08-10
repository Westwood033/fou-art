import Question from "./composants/Question.tsx";
import Score from "./composants/Score.tsx";
import Validate from "./composants/Validate.tsx";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./List.css";

function List() {
  const [dossier, setDossier] = useState([]);

  const navigate = useNavigate();

  async function goToDossier(dossier_id) {
  navigate(`/fou-art/show/${dossier_id}`);
}

 async function goToNew() {
  navigate('/fou-art/new');
}

  async function getDossier(dossier_id) {
  const { data, error } = await supabase
    .from("dossier")
    .select(`
      *,
      criteria(*)
    `)
    .eq("id", dossier_id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

  useEffect(() => {
  async function init() {
    const session = sessionStorage.getItem("user");

    if (!session) {
      navigate("/fou-art/");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.removeItem("user");
      navigate("/fou-art/");
      return;
    }

    await getDossiers();
  }

  init();
}, [navigate]);

  async function getDossiers() {
  const { data, error } = await supabase
    .from("dossier")
    .select(`
      *,
      criteria(*)
    `);

  if (error) {
    console.log(error);
    return;
  }
  setDossier(data);
}

async function deleteDossier(dossier_id) {
  const { error } = await supabase
    .from("dossier")
    .delete()
    .eq("id", dossier_id);

  if (error) {
    console.error(error);
    return;
  }

  console.log("Dossier supprimé");
  window.location.reload()
}




  return (
  <div className="list-page">
    <title>FOU-ART</title>
    <h1 className="list-title">
      Liste des dossiers
    </h1>

    <button className="new-button" onClick={() => goToNew()}>
  Créer un projet
</button>

{dossier.map((d) => (
  <div className="dossier-card" key={d.id}
  onClick={() => goToDossier(d.id)}>
    <div
      className="dossier-info"
    >

      <div className="score-badge">
        Score : {d.score}/100
      </div>

      <p><strong>Numéro de projet :</strong> {d.numProject}</p>

      <p><strong>Accompagnateur :</strong> {d.owner}</p>

      <p>
        <strong>Date :</strong>{" "}
        {new Date(d.created_at).toLocaleDateString("fr-FR")}
      </p>
    </div>

    <div className="actions">
      <button
        className="delete-button"
       onClick={(e) => {
  e.stopPropagation();
  deleteDossier(d.id);
}}
      >
        Supprimer
      </button>
    </div>
  </div>
))}

  </div>
);
}

export default List;
