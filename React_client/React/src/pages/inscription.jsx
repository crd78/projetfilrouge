import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./inscription.css";

export default function Inscription() {
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    mail: "",
    telephone: "",
    motdepasse: "",
    confirm: "",
    siret: "",
    societe: "",
  });
  const [erreur, setErreur] = useState("");
  const { login, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const champsObligatoires = [
    "prenom", "nom", "mail", "motdepasse", "confirm", "siret", "societe"
  ];

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErreur(""); // Efface l'erreur en cas de modification
  };

  const handleInscription = (e) => {
    e.preventDefault();
    for (let champ of champsObligatoires) {
      if (!form[champ]) {
        setErreur("Un champ obligatoire est manquant.");
        return;
      }
    }
    if (form.motdepasse !== form.confirm) {
      setErreur("Les mots de passe ne correspondent pas.");
      return;
    }
    setUser({
      prenom: form.prenom,
      nom: form.nom,
      mail: form.mail,
      telephone: form.telephone,
      role: form.societe,
      siret: form.siret,
      avatar: "/avatar.jpg",
      identifiant: form.mail,
      motdepasse: form.motdepasse,
    });
    login();
    navigate("/accueil");
  };

  const mdpMatch = form.confirm.length > 0
    ? form.motdepasse === form.confirm
    : null;

  return (
    <div className="inscription-page">
      <h1 className="inscription-title">Inscrivez-vous</h1>
      <form className="inscription-form" onSubmit={handleInscription}>
        <div className="form-row">
          <div className="form-group">
            <label>
              Prénom <span className="asterisk">*</span>
            </label>
            <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Prénom" />
          </div>
          <div className="form-group">
            <label>
              Nom de Famille <span className="asterisk">*</span>
            </label>
            <input name="nom" value={form.nom} onChange={handleChange} placeholder="Nom de Famille" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Email <span className="asterisk">*</span>
            </label>
            <input name="mail" value={form.mail} onChange={handleChange} placeholder="Adresse e-mail" type="email" />
          </div>
          <div className="form-group">
            <label>
              Téléphone
            </label>
            <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="Numéro de téléphone" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Mot de Passe <span className="asterisk">*</span>
            </label>
            <input name="motdepasse" value={form.motdepasse} onChange={handleChange} placeholder="Mot de Passe" type="password" />
          </div>
          <div className="form-group">
            <label>
              Confirmer Mot de Passe <span className="asterisk">*</span>
            </label>
            <input name="confirm" value={form.confirm} onChange={handleChange} placeholder="Mot de Passe" type="password" />
            {form.confirm.length > 0 && (
              <div
                style={{
                  marginTop: "6px",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "0.97em",
                  color: mdpMatch ? "#217a3a" : "#b71c1c",
                  background: mdpMatch ? "#e6f4ea" : "#fdeaea",
                  border: `1.5px solid ${mdpMatch ? "#4caf50" : "#e53935"}`
                }}
              >
                {mdpMatch
                  ? "Les mots de passe correspondent"
                  : "Les mots de passe ne correspondent pas"}
              </div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>
              Nom de société <span className="asterisk">*</span>
            </label>
            <input name="societe" value={form.societe} onChange={handleChange} placeholder="Nom de société" />
          </div>
          <div className="form-group">
            <label>
              SIRET <span className="asterisk">*</span>
            </label>
            <input name="siret" value={form.siret} onChange={handleChange} placeholder="SIRET" />
          </div>
        </div>
        {erreur && <div className="erreur">{erreur}</div>}
        <button type="submit" className="btn-inscription">Inscription &nbsp;→</button>
      </form>
    </div>
  );
}