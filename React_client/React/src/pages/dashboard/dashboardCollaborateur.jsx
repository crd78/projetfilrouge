import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API_CONFIG from "../../api.config";

export default function DashboardCollaborateur() {
  const { user, getToken } = useContext(AuthContext);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vehicules, setVehicules] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Charger les véhicules
  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}api/vehicules`, {  // <-- Ajoute le slash final
      headers: {
        "Authorization": `Bearer ${getToken ? getToken() : ""}`
      }
    })
      .then(res => res.json())
      .then(data => setVehicules(data))
      .catch(err => console.error("Erreur chargement véhicules:", err));
  }, [getToken]);

  // Charger les maintenances
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}api/collaborateurs/${user.id}/maintenances/`, {  // <-- Ajoute le slash final
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken ? getToken() : ""}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Non autorisé");
        return res.json();
      })
      .then(data => {
        setMaintenances(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des maintenances (non autorisé ou autre).");
        setMaintenances([]);
        setLoading(false);
      });
  }, [user, getToken]);

  // Créer une nouvelle maintenance
  const handleCreerMaintenance = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const payload = {
      IdVehicule: parseInt(formData.get('IdVehicule')),  // <-- Convertis en nombre
      TypeMaintenance: formData.get('TypeMaintenance'),
      DateMaintenance: new Date(formData.get('DateMaintenance')).toISOString(),
      Description: formData.get('Description')
    };

    console.log("Payload envoyé:", payload);  // <-- Ajoute ce log

    fetch(`${API_CONFIG.BASE_URL}api/maintenances/creer/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken ? getToken() : ""}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        console.log("Status de la réponse:", res.status);  // <-- Ajoute ce log
        if (!res.ok) {
          return res.json().then(err => {
            console.error("Erreur détaillée:", err);  // <-- Ajoute ce log
            throw new Error(JSON.stringify(err));
          });
        }
        return res.json();
      })
      .then(data => {
        console.log("Données reçues:", data);  // <-- Ajoute ce log
        setMaintenances(prev => [...prev, data]);
        setShowForm(false);
        e.target.reset();
        alert("Maintenance créée avec succès !");
      })
      .catch(err => {
        console.error("Erreur complète:", err);  // <-- Améliore ce log
        alert("Erreur lors de la création de la maintenance: " + err.message);
      });
  };
  
 // Remplace ta fonction handleUpdateStatus existante par :
  const handleUpdateStatus = (maintenanceId, newStatus) => {
    const payload = {
      StatutMaintenance: newStatus.toUpperCase(),
      DateFinMaintenance: newStatus.toUpperCase() === 'TERMINEE' ? new Date().toISOString() : null
    };
    console.log("Données envoyées à l'API :", payload);

    fetch(`${API_CONFIG.BASE_URL}api/maintenances/${maintenanceId}/status/${newStatus}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken ? getToken() : ""}`
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur API");
        return res.json();
      })
      .then(data => {
        setMaintenances(prev =>
          prev.map(m =>
            m.IdMaintenance === maintenanceId
              ? { ...m, ...data }
              : m
          )
        );
        alert(`Maintenance mise à jour vers ${newStatus}`);
      })
      .catch(() => {
        alert("Erreur lors de la mise à jour du statut.");
      });
  };

    const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const thStyle = {
    background: "#f5f5f5",
    padding: "1rem",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold"
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #ddd",
    verticalAlign: "middle"
  };


  if (loading) return <div>Chargement des maintenances...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

   return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ color: "#333", marginBottom: "2rem" }}>
        Tableau de bord Collaborateur - Maintenance véhicules
      </h2>
      
      {/* Bouton pour afficher le formulaire */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{ 
          background: "#2196f3", 
          color: "white", 
          padding: "0.75rem 1.5rem", 
          border: "none", 
          borderRadius: "5px", 
          marginBottom: "1rem",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "500"
        }}
      >
        {showForm ? "❌ Annuler" : "➕ Nouvelle maintenance"}
      </button>

      {/* Formulaire de création */}
      {showForm && (
        <div style={{ 
          background: "#f9f9f9", 
          padding: "2rem", 
          borderRadius: "8px", 
          marginBottom: "2rem",
          border: "1px solid #e0e0e0"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>Créer une nouvelle maintenance</h3>
          
          <form onSubmit={handleCreerMaintenance} style={{ 
            display: "grid",
            gap: "1rem",
            maxWidth: "600px"
          }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Véhicule :
              </label>
              <select 
                name="IdVehicule" 
                required 
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicules.map(v => (
                  <option key={v.IdVehicule} value={v.IdVehicule}>
                    {v.Immatriculation} - {v.TypeVehicule}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Type de maintenance :
              </label>
              <select 
                name="TypeMaintenance" 
                required 
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              >
                <option value="REVISION">🔧 Révision</option>
                <option value="REPARATION">🛠️ Réparation</option>
                <option value="CONTROLE_TECHNIQUE">📋 Contrôle technique</option>
                <option value="VIDANGE">🛢️ Vidange</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Date prévue :
              </label>
              <input
                type="date"
                name="DateMaintenance"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                Description :
              </label>
              <textarea
                name="Description"
                placeholder="Description de la maintenance..."
                rows="3"
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: "#4caf50",
                color: "white",
                padding: "1rem",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500"
              }}
            >
              ✅ Créer la maintenance
            </button>
          </form>
        </div>
      )}

      {/* Tableau des maintenances */}
      {maintenances.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "3rem", 
          color: "#666",
          background: "#f9f9f9",
          borderRadius: "8px"
        }}>
          <h3>Aucune maintenance à afficher</h3>
          <p>Cliquez sur "Nouvelle maintenance" pour en créer une.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Immatriculation</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenances.map((m) => (
                <tr key={m.IdMaintenance} style={{ backgroundColor: "#fff" }}>
                  <td style={tdStyle}>#{m.IdMaintenance}</td>
                  <td style={tdStyle}>
                    <strong>{m.IdVehicule?.Immatriculation || "N/A"}</strong>
                  </td>
                  <td style={tdStyle}>
                    {new Date(m.DateMaintenance).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={tdStyle}>
                    <span style={{ fontSize: "0.9rem" }}>
                      {m.TypeMaintenance === "REVISION" && "🔧"} 
                      {m.TypeMaintenance === "REPARATION" && "🛠️"}
                      {m.TypeMaintenance === "CONTROLE_TECHNIQUE" && "📋"}
                      {m.TypeMaintenance === "VIDANGE" && "🛢️"}
                      {" " + m.TypeMaintenance}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      backgroundColor: 
                        m.StatutMaintenance === "PLANIFIEE" ? "#2196f3" :
                        m.StatutMaintenance === "EN_COURS" ? "#ff9800" :
                        m.StatutMaintenance === "TERMINEE" ? "#4caf50" : "#666",
                      color: "white"
                    }}>
                      {m.StatutMaintenance === "PLANIFIEE" && "📅 PLANIFIÉE"}
                      {m.StatutMaintenance === "EN_COURS" && "⚙️ EN COURS"}
                      {m.StatutMaintenance === "TERMINEE" && "✅ TERMINÉE"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {m.StatutMaintenance === "PLANIFIEE" && (
                        <button
                          onClick={() => handleUpdateStatus(m.IdMaintenance, "EN_COURS")}
                          style={{ 
                            background: "#ff9800", 
                            color: "#fff", 
                            border: "none", 
                            padding: "0.5rem 1rem", 
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "500"
                          }}
                        >
                          🔧 Démarrer
                        </button>
                      )}
                      {m.StatutMaintenance === "EN_COURS" && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(m.IdMaintenance, "TERMINEE")}
                            style={{ 
                              background: "#4caf50", 
                              color: "#fff", 
                              border: "none", 
                              padding: "0.5rem 1rem", 
                              borderRadius: "5px",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                              fontWeight: "500"
                            }}
                          >
                            ✅ Terminer
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(m.IdMaintenance, "PLANIFIEE")}
                            style={{ 
                              background: "#f44336", 
                              color: "#fff", 
                              border: "none", 
                              padding: "0.5rem 1rem", 
                              borderRadius: "5px",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                              fontWeight: "500"
                            }}
                          >
                            ⏸️ Suspendre
                          </button>
                        </>
                      )}
                      {m.StatutMaintenance === "TERMINEE" && (
                        <span style={{ 
                          color: "#4caf50", 
                          fontWeight: "bold",
                          fontSize: "0.9rem"
                        }}>
                          ✅ Terminée
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Statistiques rapides */}
      <div style={{ 
        marginTop: "2rem", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        <div style={{ 
          background: "#f5f5f5", 
          padding: "1rem", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: 0, color: "#2196f3" }}>
            {maintenances.filter(m => m.StatutMaintenance === "PLANIFIEE").length}
          </h4>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>Planifiées</p>
        </div>
        <div style={{ 
          background: "#f5f5f5", 
          padding: "1rem", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: 0, color: "#ff9800" }}>
            {maintenances.filter(m => m.StatutMaintenance === "EN_COURS").length}
          </h4>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>En cours</p>
        </div>
        <div style={{ 
          background: "#f5f5f5", 
          padding: "1rem", 
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h4 style={{ margin: 0, color: "#4caf50" }}>
            {maintenances.filter(m => m.StatutMaintenance === "TERMINEE").length}
          </h4>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>Terminées</p>
        </div>
      </div>
    </div>
  );
}