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
  navigate(`/show/${dossier_id}`);
}

 async function goToNew() {
  navigate('/new');
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
      navigate("/");
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      sessionStorage.removeItem("user");
      navigate("/");
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




  return (
  <div className="list-page">

    <h1 className="list-title">
      Liste des dossiers
    </h1>

    <div className="dossier-list">
        <button onClick={() => goToNew()}>Créer un dossier</button>
      {dossier.length > 0 ? (
        <>

        {dossier.map((d) => (
          <div className="dossier-card" key={d.id} onClick={() => goToDossier(d.id)}>

            <div className="dossier-info">
              <h2>{d.numProject}</h2>

              <p>
                <strong>Score :</strong> {d.score}
              </p>

              <p>
                <strong>Accompagnateur :</strong> {d.owner}
              </p>

              <p>
                <strong>Date de création :</strong> {new Date(d.created_at).toLocaleDateString()}
              </p>
            </div>


          </div>
        ))}
        
        
        </>
      ) : (<><p>Aucun dossier...</p></>)
        }
    </div>

  </div>
);
}

export default List;
