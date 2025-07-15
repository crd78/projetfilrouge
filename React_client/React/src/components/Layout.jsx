import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

export default function Layout() {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Pour surligner la page active
  const isActive = (path) => {
    if (path === "/accueil" && (location.pathname === "/" || location.pathname === "/accueil")) return true;
    if (path === "/historique" && location.pathname === "/historique") return true;
    if (path === "/produit" && location.pathname === "/produit") return true;
    return false;
  };

  return (
    <>
      <nav
        className="navbar"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
          borderBottom: "1px solid #ddd",
          zIndex: 9999,
          padding: "1rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="logo" onClick={() => navigate("/accueil")}>MinoTor</div>
        <ul className="nav-links">
          <li onClick={() => navigate("/accueil")} className={isActive("/accueil") ? "active" : ""}>Accueil</li>
          <li className="dropdown">
            Nos Prestations
            <ul className="dropdown-content">
              <li style={{display: "none"}}>Test 1</li>
              <li style={{display: "none"}}>Test 2</li>
            </ul>
          </li>
          <li
            onClick={() => navigate("/produit")}
            className={isActive("/produit") ? "active" : ""}
            style={{ cursor: "pointer" }}
          >
            Nos Produits
          </li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/historique")} className={isActive("/historique") ? "active" : ""}>Mes Commandes</li>
        </ul>
        <div className="actions">
          {isLoggedIn ? (
            <div className="user-navbar">
              <button className="icon-button" style={{marginRight: "1rem"}}>
                <FontAwesomeIcon icon={faBell} />
              </button>
              <div className="user-info-navbar" onClick={() => navigate("/profil")} style={{cursor: "pointer", display: "flex", alignItems: "center", gap: "0.7rem"}}>
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="avatar-navbar"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
                <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                  <span style={{fontWeight: "bold", fontSize: "1rem"}}>
                    {user.prenom} {user.nom}
                  </span>
                  <span style={{fontSize: "0.85rem", color: "#888"}}>
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => navigate("/connexion")} className="btn-link">Se Connecter</button>
              <button onClick={() => navigate("/inscription")} className="btn-inscription">S'inscrire</button>
            </>
          )}
        </div>
      </nav>

      <main style={{ marginTop: "70px", padding: "1rem 2.5rem" }}>
        <Outlet />
      </main>
    </>
  );
}