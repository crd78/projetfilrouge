import React, { useContext, useState } from "react";
import "./profil.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profil() {
  const { user, logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

const [form, setForm] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    mail: user?.mail || "",
    telephone: user?.telephone || "",
    societe: user?.role || "",
    siret: user?.siret || "",
    rue: user?.rue || "",
    adresse: user?.adresse || "",
    codepostal: user?.codepostal || "",
    ville: user?.ville || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    logout();
    navigate("/accueil");
  };

  return (
    <div className="profil-container">
      <h1 className="profil-title">Mon profil</h1>
      {isLoggedIn && (
        <button
          className="btn-cancel"
          style={{ marginBottom: "2rem", float: "right" }}
          onClick={handleLogout}
          type="button"
        >
          Déconnexion
        </button>
      )}
      <form className="profil-form">
        <div className="form-row">
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Nom de Famille</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="mail"
              value={form.mail}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>N° Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Boulangerie</label>
            <input
              type="text"
              name="societe"
              value={form.societe}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>N° SIRET</label>
            <input
              type="text"
              name="siret"
              value={form.siret}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group small">
            <label>N° Rue</label>
            <input
              type="text"
              name="rue"
              value={form.rue}
              onChange={handleChange}
            />
          </div>
          <div className="form-group wide">
            <label>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
            />
          </div>
          <div className="form-group small">
            <label>Code Postal</label>
            <input
              type="text"
              name="codepostal"
              value={form.codepostal}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ville</label>
            <input
              type="text"
              name="ville"
              value={form.ville}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="profil-actions">
          <button className="btn-confirm">Confirmer les changements</button>
          <button type="button" className="btn-cancel">Annuler les modifications</button>
        </div>
      </form>
    </div>
  );
}