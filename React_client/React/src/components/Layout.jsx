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
    if (location.pathname === path) return true;
    return false;
  };

  // Affichage conditionnel des liens selon le rôle
  const navLinks = [
    { label: "Accueil", path: "/accueil", show: true },
    { label: "Nos Prestations", dropdown: [
        { label: "Test 1", path: "#" },
        { label: "Test 2", path: "#" }
      ], show: true
    },
    { label: "Nos Produits", path: "/produits", show: true },
    { label: "Contact", path: "/contact", show: true },
    // Dashboard client (rôle 1 uniquement)
    { label: "Mon espace client", path: "/dashboard/client", show: isLoggedIn && user?.role === 1 },
    // Dashboard commercial (rôle 2 uniquement)
    { label: "Dashboard commercial", path: "/dashboard/commercial", show: isLoggedIn && user?.role === 2 },
   
    // Gestion stock (rôle 5 uniquement)
    { label: "Gestion stock", path: "/dashboard/stock", show: isLoggedIn && user?.role === 5 },
    // Entrepôts (rôle 2 ou 5)
    { label: "Entrepôts", path: "/entrepots", show: isLoggedIn && (user?.role === 5) },
    // Profil (connecté)
    { label: "Profil", path: "/profil", show: isLoggedIn }
  ];

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
          {navLinks.map((link, idx) =>
            link.show && !link.dropdown ? (
              <li
                key={link.label}
                onClick={() => navigate(link.path)}
                className={isActive(link.path) ? "active" : ""}
                style={{ cursor: "pointer" }}
              >
                {link.label}
              </li>
            ) : link.show && link.dropdown ? (
              <li className="dropdown" key={link.label}>
                {link.label}
                <ul className="dropdown-content">
                  {link.dropdown.map((item) => (
                    <li
                      key={item.label}
                      onClick={() => item.path !== "#" && navigate(item.path)}
                      style={{ cursor: item.path !== "#" ? "pointer" : "default" }}
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </li>
            ) : null
          )}
        </ul>
        <div className="actions">
          {isLoggedIn ? (
            <div className="user-navbar">
              <button className="icon-button" style={{ marginRight: "1rem" }}>
                <FontAwesomeIcon icon={faBell} />
              </button>
              <div className="user-info-navbar" onClick={() => navigate("/profil")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.7rem" }}>
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="avatar-navbar"
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                    {user.prenom} {user.nom}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>
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