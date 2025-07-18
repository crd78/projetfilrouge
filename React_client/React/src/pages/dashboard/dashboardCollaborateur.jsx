import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API_CONFIG from "../../api.config";

export default function DashboardCollaborateur() {
  const { user, getToken } = useContext(AuthContext);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch(`${API_CONFIG.BASE_URL}api/collaborateurs/${user.id}/maintenances`, {
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
        setMaintenances(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des maintenances (non autorisé ou autre).");
        setMaintenances([]);
        setLoading(false);
      });
  }, [user, getToken]);

  const handleUpdateStatus = (maintenanceId, newStatus) => {
    fetch(`${API_CONFIG.BASE_URL}api/maintenances/${maintenanceId}/status/${newStatus}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken ? getToken() : ""}`
      }
    })
      .then(res => {
        if (res.ok) {
          setMaintenances(prev =>
            prev.map(m =>
              m.IdMaintenance === maintenanceId
                ? { ...m, StatutMaintenance: newStatus.toUpperCase() }
                : m
            )
          );
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        alert("Erreur lors de la mise à jour du statut.");
      });
  };

  if (loading) return <div>Chargement des maintenances...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Tableau de bord Collaborateur - Maintenance véhicules</h2>
      {maintenances.length === 0 ? (
        <div>Aucune maintenance à afficher.</div>
      ) : (
        <table className="table-maintenance">
          <thead>
            <tr>
              <th>ID</th>
              <th>Véhicule</th>
              <th>Date</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((m) => (
              <tr key={m.IdMaintenance}>
                <td>{m.IdMaintenance}</td>
                <td>{m.IdVehicule?.Immatriculation || "N/A"}</td>
                <td>{new Date(m.DateMaintenance).toLocaleString()}</td>
                <td>{m.TypeMaintenance}</td>
                <td>{m.StatutMaintenance}</td>
                <td>
                  {m.StatutMaintenance !== "TERMINEE" && (
                    <button
                      onClick={() => handleUpdateStatus(m.IdMaintenance, "TERMINEE")}
                      style={{ background: "#4caf50", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: "5px" }}
                    >
                      Marquer comme terminée
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}