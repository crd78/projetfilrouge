import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import API_CONFIG from '../../api.config.js';
import './dashboardStock.css';
import TransportRequestForm from './TransportRequestForm';

const DashboardStock = () => {
  const { getToken } = useAuth();
  
  // États pour les données de base
  const [produits, setProduits] = useState([]);
  const [entrepots, setEntrepots] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  
  // États pour les commandes et livraisons
  const [commandes, setCommandes] = useState([]);
 const [commandeSelections, setCommandeSelections] = useState({}); 
  const [livraisons, setLivraisons] = useState([]);
  
  // États pour les fournisseurs
  const [fournisseurs, setFournisseurs] = useState([]);
  const [newFournisseur, setNewFournisseur] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    adresse: ''
  });
  const [editFournisseur, setEditFournisseur] = useState(null);
  
  // États pour les formulaires
  const [ajout, setAjout] = useState({ produit: '', entrepot: '', quantite: '' });
  const [filtres, setFiltres] = useState({
    statut: '',
    date_debut: '',
    date_fin: ''
  });
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('stock'); // 'stock', 'commandes', 'livraisons', 'fournisseurs'

  // Fonction utilitaire pour générer les headers avec token
  const getAuthHeaders = () => {
    const token = getToken ? getToken() : localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  // Chargement initial des données
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const headers = getAuthHeaders();
    
    try {
      // Chargement en parallèle de toutes les données
      const [
        produitsRes,
        entrepotsRes,
        mouvementsRes,
        fournisseursRes,
        vehiculesRes,
        commandesRes,
        livraisonsRes
      ] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}api/produits`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}api/entrepots`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}api/stockmouvements`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}api/fournisseurs`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}api/vehicules`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}api/stock-manager/commandes/`, { headers }),
        fetch(`${API_CONFIG.BASE_URL}api/stock-manager/livraisons/`, { headers })
      ]);

      if (produitsRes.ok) setProduits(await produitsRes.json());
      if (entrepotsRes.ok) setEntrepots(await entrepotsRes.json());
      if (mouvementsRes.ok) setMouvements(await mouvementsRes.json());
      if (fournisseursRes.ok) setFournisseurs(await fournisseursRes.json());
      if (vehiculesRes.ok) setVehicules(await vehiculesRes.json());
      
      if (commandesRes.ok) {
        const commandesData = await commandesRes.json();
        setCommandes(commandesData.commandes || []);
      }
      
      if (livraisonsRes.ok) {
        const livraisonsData = await livraisonsRes.json();
        setLivraisons(livraisonsData.livraisons || []);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setMessage('Erreur lors du chargement des données');
    }
  };

  // Fonctions de calcul de stock
  const getStockGlobalProduit = (produitId) => {
    return mouvements
      .filter(m => m.IdProduit === produitId)
      .reduce((total, m) => {
        if (["ENTREE", "RETOUR"].includes(m.TypeMouvement)) return total + m.Quantite;
        if (["SORTIE"].includes(m.TypeMouvement)) return total - m.Quantite;
        if (["INVENTAIRE"].includes(m.TypeMouvement)) return m.Quantite;
        return total;
      }, 0);
  };

  const getQuantiteDansEntrepot = (entrepotId, produitId) => {
    return mouvements
      .filter(m => m.IdEntrepot === entrepotId && m.IdProduit === produitId)
      .reduce((total, m) => {
        if (["ENTREE", "RETOUR"].includes(m.TypeMouvement)) return total + m.Quantite;
        if (["SORTIE"].includes(m.TypeMouvement)) return total - m.Quantite;
        if (["INVENTAIRE"].includes(m.TypeMouvement)) return m.Quantite;
        return total;
      }, 0);
  };

  // Gestion des mouvements de stock
  const handleStockMovement = async (e, typeMovement) => {
    e.preventDefault();
    setMessage('');
    
    if (!ajout.produit || !ajout.entrepot || !ajout.quantite) {
      setMessage('Veuillez remplir tous les champs');
      return;
    }

    const headers = getAuthHeaders();
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/stockmouvements`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          IdProduit: Number(ajout.produit),
          IdEntrepot: Number(ajout.entrepot),
          Quantite: Number(ajout.quantite),
          TypeMouvement: typeMovement
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessage(`Stock ${typeMovement === 'ENTREE' ? 'ajouté' : 'retiré'} avec succès`);
        setAjout({ produit: '', entrepot: '', quantite: '' });
        setMouvements(m => [...m, data]);
      } else {
        setMessage('Erreur : ' + JSON.stringify(data));
      }
    } catch (error) {
      setMessage('Erreur lors de l\'opération');
    }
  };

  // Gestion des fournisseurs
  const handleAddFournisseur = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/fournisseurs/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newFournisseur)
      });
      
      if (res.ok) {
        const data = await res.json();
        setFournisseurs(f => [...f, data]);
        setNewFournisseur({ nom: '', prenom: '', telephone: '', email: '', password: '', adresse: '' });
        setMessage('Fournisseur ajouté avec succès');
      } else {
        setMessage('Erreur lors de l\'ajout du fournisseur');
      }
    } catch (error) {
      setMessage('Erreur lors de l\'ajout du fournisseur');
    }
  };

  const handleDeleteFournisseur = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) return;
    
    const headers = getAuthHeaders();
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/fournisseurs/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (res.ok) {
        setFournisseurs(f => f.filter(fou => (fou.id || fou.IdFournisseur) !== id));
        setMessage('Fournisseur supprimé avec succès');
      } else {
        setMessage('Erreur lors de la suppression');
      }
    } catch (error) {
      setMessage('Erreur lors de la suppression');
    }
  };

  const handleUpdateFournisseur = async (e) => {
    e.preventDefault();
    const headers = getAuthHeaders();
    const id = editFournisseur.id || editFournisseur.IdFournisseur;
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/fournisseurs/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          nom: editFournisseur.nom,
          prenom: editFournisseur.prenom,
          telephone: editFournisseur.telephone,
          email: editFournisseur.email,
          adresse: editFournisseur.adresse
        })
      });
      
      if (res.ok) {
        const updatedData = await res.json();
        setFournisseurs(f =>
          f.map(fou => (fou.id || fou.IdFournisseur) === id ? updatedData : fou)
        );
        setEditFournisseur(null);
        setMessage('Fournisseur mis à jour avec succès');
      } else {
        setMessage('Erreur lors de la mise à jour');
      }
    } catch (error) {
      setMessage('Erreur lors de la mise à jour');
    }
  };

  // Gestion des commandes et livraisons
  const loadCommandes = async () => {
    const headers = getAuthHeaders();
    const params = new URLSearchParams(filtres);
    
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/stock-manager/commandes/?${params}`, {
        headers
      });
      const data = await res.json();
      if (res.ok) {
        setCommandes(data.commandes || []);
      }
    } catch (error) {
      setMessage('Erreur lors du chargement des commandes');
    }
  };

  const creerLivraison = async (commandeId, entrepotId, vehiculeId = null) => {
    const headers = getAuthHeaders();
    const payload = {
      commande_id: commandeId,
      entrepot_id: entrepotId,
      vehicule_id: Number(vehiculeId),
      date_prevue: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    console.log("Payload envoyé à l'API /creer-livraison :", payload);

    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}api/stock-manager/creer-livraison/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Livraison créée avec succès !');
        loadCommandes();
        loadInitialData(); // Recharger les livraisons
      } else {
        setMessage('Erreur : ' + data.error);
      }
    } catch (error) {
      setMessage('Erreur lors de la création de la livraison');
    }
  };

  // Rendu des onglets
  const renderTabNavigation = () => (
    <div className="tab-navigation">
      <button 
        className={activeTab === 'stock' ? 'active' : ''} 
        onClick={() => setActiveTab('stock')}
      >
        📦 Gestion Stock
      </button>
      <button 
        className={activeTab === 'commandes' ? 'active' : ''} 
        onClick={() => setActiveTab('commandes')}
      >
        📋 Commandes
      </button>
      <button 
        className={activeTab === 'livraisons' ? 'active' : ''} 
        onClick={() => setActiveTab('livraisons')}
      >
        🚚 Livraisons
      </button>
      <button 
        className={activeTab === 'fournisseurs' ? 'active' : ''} 
        onClick={() => setActiveTab('fournisseurs')}
      >
        👥 Fournisseurs
      </button>
    </div>
  );

  // Rendu de l'onglet Stock
  const renderStockTab = () => (
    <>
      {/* Stocks produits */}
      <section>
        <h2>📊 Stocks produits</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Stock global</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {produits.map(p => {
                const stock = getStockGlobalProduit(p.IdProduit);
                return (
                  <tr key={p.IdProduit}>
                    <td>{p.NomProduit}</td>
                    <td>{stock}</td>
                    <td>
                      <span className={`status ${stock <= 10 ? 'low' : stock <= 50 ? 'medium' : 'high'}`}>
                        {stock <= 10 ? 'Stock faible' : stock <= 50 ? 'Stock moyen' : 'Stock élevé'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Entrepôts */}
      <section>
        <h2>🏭 Entrepôts</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Localisation</th>
                <th>Capacité max</th>
                <th>Produit associé</th>
                <th>Quantité stockée</th>
                <th>Taux d'occupation</th>
              </tr>
            </thead>
            <tbody>
              {entrepots.map(e => {
                const quantite = getQuantiteDansEntrepot(e.IdEntrepot, e.IdProduit);
                const tauxOccupation = (quantite / e.CapaciteStock * 100).toFixed(1);
                return (
                  <tr key={e.IdEntrepot}>
                    <td>{e.Localisation}</td>
                    <td>{e.CapaciteStock}</td>
                    <td>{e.IdProduit}</td>
                    <td>{quantite}</td>
                    <td>
                      <span className={`status ${tauxOccupation > 80 ? 'high' : tauxOccupation > 50 ? 'medium' : 'low'}`}>
                        {tauxOccupation}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Formulaires de gestion de stock */}
      <div className="stock-forms">
        <section className="form-section">
          <h2>➕ Ajouter du stock</h2>
          <form onSubmit={(e) => handleStockMovement(e, 'ENTREE')}>
            <select value={ajout.produit} onChange={e => setAjout(a => ({ ...a, produit: e.target.value }))}>
              <option value="">Sélectionner un produit</option>
              {produits.map(p => (
                <option key={p.IdProduit} value={p.IdProduit}>{p.NomProduit}</option>
              ))}
            </select>
            <select value={ajout.entrepot} onChange={e => setAjout(a => ({ ...a, entrepot: e.target.value }))}>
              <option value="">Sélectionner un entrepôt</option>
              {entrepots.map(e => (
                <option key={e.IdEntrepot} value={e.IdEntrepot}>{e.Localisation}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={ajout.quantite}
              onChange={e => setAjout(a => ({ ...a, quantite: e.target.value }))}
              placeholder="Quantité"
            />
            <button type="submit" className="btn-add">Ajouter</button>
          </form>
        </section>

        <section className="form-section">
          <h2>➖ Retirer du stock</h2>
          <form onSubmit={(e) => handleStockMovement(e, 'SORTIE')}>
            <select value={ajout.produit} onChange={e => setAjout(a => ({ ...a, produit: e.target.value }))}>
              <option value="">Sélectionner un produit</option>
              {produits.map(p => (
                <option key={p.IdProduit} value={p.IdProduit}>{p.NomProduit}</option>
              ))}
            </select>
            <select value={ajout.entrepot} onChange={e => setAjout(a => ({ ...a, entrepot: e.target.value }))}>
              <option value="">Sélectionner un entrepôt</option>
              {entrepots.map(e => (
                <option key={e.IdEntrepot} value={e.IdEntrepot}>{e.Localisation}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={ajout.quantite}
              onChange={e => setAjout(a => ({ ...a, quantite: e.target.value }))}
              placeholder="Quantité"
            />
            <button type="submit" className="btn-remove">Retirer</button>
          </form>
        </section>
      </div>
    </>
  );

  // Rendu de l'onglet Commandes
  const renderCommandesTab = () => (
    <>
      <section>
        <h2>📋 Commandes à traiter ({commandes.length})</h2>
        
        {/* Filtres */}
        <div className="filters">
          <select 
            value={filtres.statut} 
            onChange={e => setFiltres(f => ({ ...f, statut: e.target.value }))}
          >
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="EN_COURS">En cours</option>
            <option value="EXPEDIEE">Expédiée</option>
          </select>
          
          <input
            type="date"
            value={filtres.date_debut}
            onChange={e => setFiltres(f => ({ ...f, date_debut: e.target.value }))}
            placeholder="Date début"
          />
          
          <input
            type="date"
            value={filtres.date_fin}
            onChange={e => setFiltres(f => ({ ...f, date_fin: e.target.value }))}
            placeholder="Date fin"
          />
          
          <button onClick={loadCommandes} className="btn-filter">Filtrer</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Montant TTC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map(commande => {
                const selection = commandeSelections[commande.IdCommande] || { entrepot: '', vehicule: '' };
                const isEnCours = commande.Statut === 'EN_COURS';
                
                return (
                  <tr key={commande.IdCommande}>
                    <td>#{commande.IdCommande}</td>
                    <td>{commande.IdClient}</td>
                    <td>{new Date(commande.DateCommande).toLocaleDateString()}</td>
                    <td>
                      <span className={`status ${commande.Statut.toLowerCase()}`}>
                        {commande.Statut}
                      </span>
                    </td>
                    <td>{commande.MontantTotalTTC}€</td>
                    <td>
                      <div className="action-controls">
                        {isEnCours ? (
                          // Si EN_COURS, afficher seulement un message
                          <span className="status en-cours">Livraison déjà planifiée</span>
                        ) : (
                          // Sinon, afficher les contrôles normaux
                          <>
                            <select
                              value={selection.entrepot}
                              onChange={e =>
                                setCommandeSelections(s => ({
                                  ...s,
                                  [commande.IdCommande]: { ...selection, entrepot: e.target.value }
                                }))
                              }
                              className="select-entrepot"
                            >
                              <option value="">Choisir entrepôt</option>
                              {entrepots.map(entrepot => (
                                <option key={entrepot.IdEntrepot} value={entrepot.IdEntrepot}>
                                  {entrepot.Localisation}
                                </option>
                              ))}
                            </select>
                            <select
                              value={selection.vehicule}
                              onChange={e => {
                                console.log("VEHICULE SELECTIONNE:", e.target.value);
                                setCommandeSelections(s => {
                                  const newSelection = {
                                    ...s,
                                    [commande.IdCommande]: { ...selection, vehicule: e.target.value }
                                  };
                                  console.log("NOUVEAU STATE commandeSelections:", newSelection);
                                  return newSelection;
                                });
                              }}
                              className="select-vehicule"
                            >
                              <option value="">Choisir véhicule</option>
                              {vehicules.filter(v => v.Statut === 'DISPONIBLE').map(vehicule => (
                                <option key={vehicule.IdVehicule} value={vehicule.IdVehicule}>
                                  {vehicule.Immatriculation}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn-validate"
                              onClick={() => {
                                const selection = commandeSelections[commande.IdCommande] || { entrepot: '', vehicule: '' };
                                console.log("DEBUG AVANT ENVOI - sélection:", selection);
                                console.log("DEBUG AVANT ENVOI - entrepot:", selection.entrepot);
                                console.log("DEBUG AVANT ENVOI - vehicule:", selection.vehicule);
                                
                                creerLivraison(
                                  commande.IdCommande,
                                  selection.entrepot,
                                  selection.vehicule
                                );
                              }}
                              disabled={!selection.entrepot || !selection.vehicule}
                            >
                              Valider
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  // Rendu de l'onglet Livraisons
  const renderLivraisonsTab = () => (
    <section>
      <h2>🚚 Livraisons en cours ({livraisons.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Commande</th>
              <th>Statut</th>
              <th>Entrepôt</th>
              <th>Véhicule</th>
              <th>Date prévue</th>
              <th>Date création</th>
            </tr>
          </thead>
          <tbody>
            {livraisons.map(livraison => (
              <tr key={livraison.IdLivraison}>
                <td>#{livraison.IdLivraison}</td>
                <td>#{livraison.IdCommande}</td>
                <td>
                  <span className={`status ${livraison.Statut.toLowerCase()}`}>
                    {livraison.Statut}
                  </span>
                </td>
                <td>{livraison.IdEntrepot}</td>
                <td>{livraison.IdVehicule || 'Non assigné'}</td>
                <td>
                  {livraison.DatePrevue 
                    ? new Date(livraison.DatePrevue).toLocaleDateString() 
                    : '-'
                  }
                </td>
                <td>{new Date(livraison.DateCreation).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  // Rendu de l'onglet Fournisseurs
  const renderFournisseursTab = () => (
    <section>
      <h2>👥 Fournisseurs</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(fournisseurs) ? fournisseurs : []).map(fou => (
              <tr key={fou.id || fou.IdFournisseur}>
                <td>
                  {editFournisseur && (editFournisseur.id === fou.id || editFournisseur.IdFournisseur === fou.IdFournisseur) ? (
                    <input
                      value={editFournisseur.nom}
                      onChange={e => setEditFournisseur({ ...editFournisseur, nom: e.target.value })}
                    />
                  ) : (
                    fou.nom
                  )}
                </td>
                <td>
                  {editFournisseur && editFournisseur.id === fou.id ? (
                    <input
                      value={editFournisseur.prenom}
                      onChange={e => setEditFournisseur({ ...editFournisseur, prenom: e.target.value })}
                    />
                  ) : (
                    fou.prenom
                  )}
                </td>
                <td>
                  {editFournisseur && editFournisseur.id === fou.id ? (
                    <input
                      value={editFournisseur.telephone}
                      onChange={e => setEditFournisseur({ ...editFournisseur, telephone: e.target.value })}
                    />
                  ) : (
                    fou.telephone
                  )}
                </td>
                <td>
                  {editFournisseur && editFournisseur.id === fou.id ? (
                    <input
                      value={editFournisseur.email}
                      onChange={e => setEditFournisseur({ ...editFournisseur, email: e.target.value })}
                    />
                  ) : (
                    fou.email
                  )}
                </td>
                <td>
                  {editFournisseur && editFournisseur.id === fou.id ? (
                    <input
                      value={editFournisseur.adresse}
                      onChange={e => setEditFournisseur({ ...editFournisseur, adresse: e.target.value })}
                    />
                  ) : (
                    fou.adresse
                  )}
                </td>
                <td>
                  {editFournisseur && editFournisseur.id === fou.id ? (
                    <div className="action-buttons">
                      <button onClick={handleUpdateFournisseur} className="btn-save">💾</button>
                      <button onClick={() => setEditFournisseur(null)} className="btn-cancel">❌</button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button onClick={() => setEditFournisseur(fou)} className="btn-edit">✏️</button>
                      <button onClick={() => handleDeleteFournisseur(fou.id || fou.IdFournisseur)} className="btn-delete">🗑️</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Formulaire d'ajout de fournisseur */}
      <div className="add-supplier-form">
        <h3>Ajouter un nouveau fournisseur</h3>
        <form onSubmit={handleAddFournisseur}>
          <div className="form-grid">
            <input
              placeholder="Nom"
              value={newFournisseur.nom}
              onChange={e => setNewFournisseur(f => ({ ...f, nom: e.target.value }))}
              required
            />
            <input
              placeholder="Prénom"
              value={newFournisseur.prenom}
              onChange={e => setNewFournisseur(f => ({ ...f, prenom: e.target.value }))}
              required
            />
            <input
              placeholder="Téléphone"
              value={newFournisseur.telephone}
              onChange={e => setNewFournisseur(f => ({ ...f, telephone: e.target.value }))}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={newFournisseur.email}
              onChange={e => setNewFournisseur(f => ({ ...f, email: e.target.value }))}
              required
            />
            <input
              placeholder="Mot de passe"
              type="password"
              value={newFournisseur.password}
              onChange={e => setNewFournisseur(f => ({ ...f, password: e.target.value }))}
              required
            />
            <input
              placeholder="Adresse"
              value={newFournisseur.adresse}
              onChange={e => setNewFournisseur(f => ({ ...f, adresse: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn-add-supplier">Ajouter le fournisseur</button>
        </form>
      </div>
    </section>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>🏭 Dashboard Chargé de Stock</h1>
        {message && (
          <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>
            {message}
            <button onClick={() => setMessage('')} className="close-message">✕</button>
          </div>
        )}
      </div>

      {renderTabNavigation()}

      <div className="tab-content">
        {activeTab === 'stock' && renderStockTab()}
        {activeTab === 'commandes' && renderCommandesTab()}
        {activeTab === 'livraisons' && renderLivraisonsTab()}
        {activeTab === 'fournisseurs' && (
        <>
          {renderFournisseursTab()}
          <TransportRequestForm
            entrepots={entrepots}
            vehicules={vehicules}
            produits={produits}
          />
        </>
      )}
      </div>
    </div>
  );
};

export default DashboardStock;