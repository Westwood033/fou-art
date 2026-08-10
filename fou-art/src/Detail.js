import "./style/Validate.css";
import logo from "./images/foufou.jpg";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Detail() {
  const { dossier_id_receive } = useParams();

  const [dossier, setDossier] = useState(null);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [score, setScore] = useState([]);

  const [numProject, setNumProject] = useState("");
  const [owner, setOwner] = useState("");
  const [comment, setComment] = useState("");
  const [avis, setAvis] = useState("");

  const navigate = useNavigate();

  const cancel = () => {
    window.location.reload()
  }

  const addPriority = () => {
  setScore((prevScores) => [
    ...prevScores,
    {
      id: `new-${Date.now()}`,
      created_at: new Date().toISOString(),
      title: "",
      score: null,
      priority: true,
      dossier_id: dossier.id,
      isNew: true,
    },
  ]);
};

const feelPriority = (id, content) => {
  setScore((prevScores) =>
    prevScores.map((item) =>
      item.id === id
        ? {
            ...item,
            title: content,
          }
        : item
    )
  );
};

  const updateScore = (id, newScore) => {
    setScore((prevScores) =>
      prevScores.map((item) =>
        item.id === id
          ? {
              ...item,
              score: newScore,
              priority: newScore !== "" && Number(newScore) < 3,
            }
          : item
      )
    );
  };

  function goToList() {
    navigate("/fou-art/list");
  }

  function deletePriority(id) {
    setScore((prevScores) =>
        prevScores.filter((item) =>
        item.id !== id
    ));
  }

async function save() {
  if (!dossier) {
    return;
  }

  const cleanScore = score.map(
    ({ isNew, ...item }) => item
  );

  const deletedCriteria = dossier.criteria.filter(
    (oldCriterion) =>
      !cleanScore.some(
        (newCriterion) =>
          newCriterion.id === oldCriterion.id
      )
  );

  const deletedIds = deletedCriteria.map(
    (criterion) => criterion.id
  );

  if (deletedIds.length > 0) {
    const { error } = await supabase
      .from("criteria")
      .delete()
      .in("id", deletedIds);

    if (error) {
      console.error(
        "Erreur suppression critères :",
        error
      );
      return;
    }
  }

  const createdCriteria = cleanScore.filter(
    (criterion) =>
      !dossier.criteria.some(
        (oldCriterion) =>
          oldCriterion.id === criterion.id
      )
  );

  const criteriaToCreate = createdCriteria.map(
    ({ id, ...criterion }) => ({
      ...criterion,
      dossier_id: dossier.id,
    })
  );

  let insertedCriteria = [];

  if (criteriaToCreate.length > 0) {
    const {
      data,
      error,
    } = await supabase
      .from("criteria")
      .insert(criteriaToCreate)
      .select();

    if (error) {
      console.error(
        "Erreur création critères :",
        error
      );
      return;
    }

    insertedCriteria = data || [];
  }

  for (const criterion of cleanScore) {

    if (
      criterion.id
        ?.toString()
        .startsWith("new-")
    ) {
      continue;
    }

    const { error: criteriaError } =
      await supabase
        .from("criteria")
        .update({
          score:
            criterion.score === ""
              ? 0
              : criterion.score,

          priority:
            criterion.score !== null &&
            Number(criterion.score) < 3,
        })
        .eq("id", criterion.id)
        .eq("dossier_id", dossier.id);

    if (criteriaError) {
      console.error(
        "Erreur critère :",
        criteriaError
      );
      return;
    }
  }


  const scoreCalculated =
    cleanScore.reduce(
      (total, item) =>
        total + Number(item.score ?? 0),
      0
    );

  const dossierData = {
    owner,
    numProject,
    score: scoreCalculated,
    comment,
    avis,
  };

  const {
    data: updatedDossier,
    error: dossierError,
  } = await supabase
    .from("dossier")
    .update(dossierData)
    .eq("id", dossier.id)
    .select()
    .single();

  if (dossierError) {
    console.error(
      "Erreur dossier :",
      dossierError
    );
    return;
  }

  const newCriteriaWithRealIds =
    insertedCriteria;

  const updatedCriteria =
    cleanScore.map((criterion) => {

      if (
        criterion.id
          ?.toString()
          .startsWith("new-")
      ) {
        const created =
          newCriteriaWithRealIds.find(
            (item) =>
              item.title === criterion.title
          );

        return (
          created || criterion
        );
      }

      return {
        ...criterion,
        score:
          criterion.score === ""
            ? 0
            : criterion.score,
        priority:
          criterion.score !== null &&
          Number(criterion.score) < 3,
      };
    });

  setDossier({
    ...updatedDossier,
    criteria: updatedCriteria,
  });

  setScore(updatedCriteria);

  updateMessage(scoreCalculated);

  setEdit(false);
  window.location.reload()
}


  function updateMessage(currentScore) {
    if (currentScore >= 90) {
      setMessage(
        "Projet prêt au lancement. Validation recommandée."
      );
    } else if (currentScore >= 75) {
      setMessage(
        "Projet solide. Quelques ajustements sont conseillés avant validation."
      );
    } else if (currentScore >= 60) {
      setMessage(
        "Projet réalisable mais nécessitant un accompagnement renforcé. Ainsi que l'avis accompagnateur"
      );
    } else if (currentScore >= 40) {
      setMessage(
        "Projet insuffisamment préparé. Des actions correctives sont indispensables."
      );
    } else {
      setMessage(
        "Projet non viable dans son état actuel. Une refonte est recommandée avec toute mise en oeuvre."
      );
    }
  }

  useEffect(() => {
    async function init() {
      const session = sessionStorage.getItem("user");

      if (!session) {
        navigate("/fou-art/");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        sessionStorage.removeItem("user");
        navigate("/fou-art/");
        return;
      }

      await getDossier(dossier_id_receive);
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
        console.error(
          "Erreur récupération dossier :",
          error
        );
        return;
      }

      console.log("Dossier récupéré :", data);

      setDossier(data);
      setScore(data.criteria || []);

      setNumProject(data.numProject ?? "");
      setOwner(data.owner ?? "");
      setComment(data.comment ?? "");
      setAvis(data.avis ?? "");

      updateMessage(data.score ?? 0);
    }

    init();
  }, [navigate, dossier_id_receive]);

  async function deleteCriteria(criteria_id) {
    const { error } = await supabase
      .from("criteria")
      .delete()
      .eq("id", criteria_id);

    if (error) {
      console.error(error);
      return;
    }

    setScore((prevScore) =>
      prevScore.filter(
        (criterion) => criterion.id !== criteria_id
      )
    );

    console.log("Critère supprimé");
  }

  return (
    <div className="container-validate">
      <div className="card">

        <img
          className="logo"
          src={logo}
          alt="logo"
        />

        <h2>Récapitulatif du projet</h2>

        <div className="result-box">
          <h3>Résultat</h3>

          <p>{message}</p>

          <strong>
            Score : {dossier?.score ?? 0}/100
          </strong>
        </div>

        {!edit && (
          <button
            type="button"
            onClick={() => setEdit(true)}
          >
            Editer le projet
          </button>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >

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
                {score.map((item) => (
                  item.score !== null && (
                    <tr key={item.id}>
                      <td>
                        {item.title}
                      </td>

                      <td>
                        {edit ? (
                          <input
                            required
                            type="number"
                            min="0"
                            max="5"
                            value={item.score ?? ""}
                            onChange={(e) =>
                              updateScore(
                                item.id,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          item.score
                        )}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </section>

          <section className="info-section">

            <h3>
              Informations complémentaires
            </h3>

            <div className="info-card">

              <p>
                <strong>
                  Numéro de projet :{" "}
                </strong>

                {edit ? (
                  <input
                    required
                    type="text"
                    value={numProject}
                    onChange={(e) =>
                      setNumProject(e.target.value)
                    }
                  />
                ) : (
                  dossier?.numProject
                )}
              </p>

              <p>
                <strong>
                  Date de reception :{" "}
                </strong>

                {dossier?.created_at
                  ? new Date(
                      dossier.created_at
                    ).toLocaleDateString()
                  : ""}
              </p>

              <p>
                <strong>
                  Porteur du projet :{" "}
                </strong>

                {edit ? (
                  <input
                    required
                    type="text"
                    value={owner}
                    onChange={(e) =>
                      setOwner(e.target.value)
                    }
                  />
                ) : (
                  dossier?.owner
                )}
              </p>

              <p>
                <strong>
                  Commentaire :{" "}
                </strong>

                {edit ? (
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) =>
                      setComment(e.target.value)
                    }
                  />
                ) : (
                  dossier?.comment
                )}
              </p>

              <p>
                <strong>
                  Avis de l'accompagnateur :{" "}
                </strong>

                {edit ? (
                  <input
                    type="text"
                    value={avis}
                    onChange={(e) =>
                      setAvis(e.target.value)
                    }
                  />
                ) : (
                  dossier?.score < 40
                    ? "A revoir"
                    : dossier?.score > 70
                    ? "Ok"
                    : dossier?.avis
                )}
              </p>

            </div>
          </section>

          {score.length > 0 && (
            <section>

              <h3>
                Priorités du projet
              </h3>

              <table className="result-table">

                <thead>
                  <tr>
                    <th>Priorité</th>

                    {edit && (
                      <th>Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>

                  {score.map((item) => {

                    if (!item.priority) {
                      return null;
                    }

                    return (
                      <tr key={item.id}>

                        <td>
  {item.isNew && edit ? (
    <input
      type="text"
      value={item.title}
      placeholder="Nom de la priorité"
      onChange={(e) =>
        feelPriority(
          item.id,
          e.target.value
        )
      }
    />
  ) : (
    item.title
  )}
</td>

                        {edit && (
                          <td>
                            {item.score === null ? (
                              <button
                                type="button"
                                className="delete-button"
                                onClick={() =>
                                  deletePriority(
                                    item.id
                                  )
                                }
                              >
                                Supprimer
                              </button>
                            ) : (
                              "/"
                            )}
                          </td>
                        )}

                      </tr>
                    );
                  })}

                </tbody>
              </table>

            </section>
          )}

          {edit && (<>

            <button type="button" className="add-priority" onClick={addPriority}>
                Ajouter une priorité
            </button>

            <div className="form-buttons">

              <button type="submit">
                Enregistrer
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() => cancel()}
              >
                Annuler
              </button>

            </div>
            </>
          )}

        </form>

        <button
          type="button"
          onClick={goToList}
        >
          Retour à la liste
        </button>

      </div>
    </div>
  );
}

export default Detail;

