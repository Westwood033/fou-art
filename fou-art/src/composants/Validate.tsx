import "./../style/Validate.css";
import logo from "./../images/foufou.jpg";
import { supabase } from "./../lib/supabase"

function Validate({ message, score, questions = [], bonus = {} , onSave}) {
    

    const today = new Date();

    async function handleSave() {

    const { data: dossier, error: dossierError } = await supabase
  .from("dossier")
  .insert([
    {
      score: score,
      numProject: bonus.numProject,
      comment: bonus.probabilite,
      avis: bonus.avis,
      owner: bonus.nom
    }
  ])
  .select()
  .single();

if (dossierError) {
  console.error(dossierError);
  return;
}


const criterias = []

questions.map((item) => (
    criterias.push({
        title: item.question?.title,
        score: item.answer,
        priority: item.answer < 3,
        dossier_id: dossier.id
    })
));

bonus.priorite.map((item, index) => {
    if( item.question?.title === undefined){
       criterias.push({
            title: item.value,
            score: null,
            priority: true,
            dossier_id: dossier.id
        })
    }
    });

// Création des critères liés au dossier
const { data: criteria, error: criteriaError } = await supabase
  .from("criteria")
  .insert(criterias);

if (criteriaError) {
  console.error(criteriaError);
  return;
}

onSave()

}

  return (
    <div className="container-validate">

      <div className="card">

        <img className="logo" src={logo} alt="logo" />

        <h2>Récapitulatif du projet</h2>

        <div className="result-box">
          <h3>Résultat</h3>
          <p>{message}</p>
          <strong>Score : {score}/100</strong>
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
              {questions.map((item) => (
                <tr key={item.question.id}>
                  <td>{item.question.title}</td>
                  <td>{item.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>


        <section className="info-section">

          <h3>Informations complémentaires</h3>

          <div className="info-card">

            <p>
              <strong>Numéro de projet</strong> {bonus.numProject}
            </p>

            <p>
              <strong>Date de reception</strong> {today.toLocaleDateString()}
            </p>

            <p>
              <strong>Porteur du projet :</strong> {bonus.nom}
            </p>

            <p>
              <strong>Commentaire :</strong> {bonus.probabilite}
            </p>

            <p>
              <strong>Avis de l'accompagnateur :</strong> {score < 40 ? "A revoir" : score > 70 ? "Ok" : bonus.avis}
            </p>
          </div>

        </section>


        {bonus.priorite?.length > 0 && (
          <section>

            <h3>Priorités du projet</h3>

            <table className="result-table">
              <thead>
                <tr>
                  <th>Priorité</th>
                </tr>
              </thead>

              <tbody>
                {bonus.priorite.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td>
                      {item.question?.title ?? item.value}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </section>
        )}

        <button onClick={() => handleSave()}>
        Enregistrer
        </button>
        <button onClick={() => window.print()}>
        Télécharger en PDF
        </button>

      </div>
    </div>
  );
}

export default Validate;