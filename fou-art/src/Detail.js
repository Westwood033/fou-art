import "./style/Validate.css";
import logo from "./images/foufou.jpg";
import { supabase } from "./lib/supabase"
import { useEffect, useState } from "react";
import { useNavigate, useParams  } from "react-router-dom";

function Detail() {
    const { dossier_id_receive } = useParams();
    const [dossier, setDossier] = useState(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    async function goToList() {
    
        navigate("/list");
    
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
  }


  init();


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

  setDossier(data);

     if (data.score >= 90) {
      setMessage("Projet prêt au lancement. Validation recommandée.");
    } else if (data.score >= 75) {
      setMessage("Projet solide. Quelques ajustements sont conseillés avant validation.");
    } else if (data.score >= 60) {
      setMessage("Projet réalisable mais nécessitant un accompagnement renforcé. Ainsi que l'avis accompagnateur");
    } else if (data.score >= 40) {
      setMessage("Projet insuffisamment préparé. Des actions correctuves sont indispensables.");
    } else if (data.score >= 0) {
      setMessage("Projet non viable dans son état actuel. Une reffonte est recommandée avec toute mise en oeuvre.");
    }
}

getDossier(dossier_id_receive);


}, [navigate, dossier_id_receive]);

    console.log("gaga")
    console.log(dossier)

  return (
    <div className="container-validate">

      <div className="card">

        <img className="logo" src={logo} alt="logo" />

        <h2>Récapitulatif du projet</h2>

        <div className="result-box">
          <h3>Résultat</h3>
          <p>{message}</p>
          <strong>Score : {dossier?.score}/100</strong>
        </div>


        <section>
          <h3>Résultat du formulaire</h3>

          <table className="result-table">
            <thead>
              <tr>
                <th>Critère</th>
                <th>Notation</th>
              </tr>
            </thead>

            <tbody>
              {dossier?.criteria?.map((item) => {

                if(item.score){
                     return (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.score}</td>
                </tr>
                     )
                }
                return null;
            })}
            </tbody>
          </table>
        </section>


        <section className="info-section">

          <h3>Informations complémentaires</h3>

          <div className="info-card">

            <p>
              <strong>Numéro de projet : </strong> {dossier?.numProject}
            </p>

            <p>
              <strong>Date de reception :</strong> {new Date(dossier?.created_at).toLocaleDateString()}
            </p>

            <p>
              <strong>Porteur du projet :</strong> {dossier?.owner}
            </p>

            <p>
              <strong>Commentaire :</strong> {dossier?.comment}
            </p>

            <p>
              <strong>Avis de l'accompagnateur :</strong> {dossier?.score < 40 ? "A revoir" : dossier?.score > 70 ? "Ok" : dossier?.avis}
            </p>
          </div>

        </section>


        {dossier?.criteria?.length > 0 && (
          <section>

            <h3>Priorités du projet</h3>

            <table className="result-table">
              <thead>
                <tr>
                  <th>Priorité</th>
                </tr>
              </thead>

              <tbody>
                {dossier?.criteria?.map((item, index) => {

                    if(item.priority){
                        return (
                        <tr key={index}>
                        <td>
                        {item.title}
                        </td>
                    </tr>
                        )
                    }
                    return null;
                })}
              </tbody>

            </table>

          </section>
        )}

        <button onClick={() => goToList()}>
        Retour à la liste
        </button>

      </div>
    </div>
  );
}

export default Detail;