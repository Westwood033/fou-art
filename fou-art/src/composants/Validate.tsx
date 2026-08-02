import "./../style/Validate.css";
import logo from "./../images/foufou.jpg";

function Validate({ message, score, questions = [], bonus = {} }) {

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
              <strong>Porteur du projet :</strong> {bonus.nom}
            </p>

            <p>
              <strong>Probabilité de réussite :</strong> {bonus.probabilite}
            </p>

            <p>
              <strong>Avis de l'accompagnateur :</strong> {bonus.avis}
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

      </div>
    </div>
  );
}

export default Validate;