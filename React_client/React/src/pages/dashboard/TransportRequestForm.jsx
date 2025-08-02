import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../api.config.js';
import { useAuth } from '../../context/AuthContext';

const TransportRequestForm = ({ entrepots, vehicules, produits }) => {
  const { getToken } = useAuth();
  const [fournisseurs, setFournisseurs] = useState([]);
  const [form, setForm] = useState({
    fournisseur: '',
    telephone: '',
    email: '',
    commandeFournisseur: '',
    dateTransport: '',
    produits: [],
    typeCamion: '',
    camion: '',
    destination: '',
    distance: ''
  });
    // Charger la liste des fournisseurs (role=6)
    useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}api/fournisseurs/`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setFournisseurs(Array.isArray(data) ? data.filter(f => f.role === 6 || f.Role === 6) : []);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchFournisseurs();
  }, [getToken]);
  const [produitLigne, setProduitLigne] = useState({ id: '', quantite: '' });
  const [message, setMessage] = useState('');

  const addProduit = () => {
    if (!produitLigne.id || !produitLigne.quantite) return;
    setForm(f => ({
      ...f,
      produits: [...f.produits, { ...produitLigne }]
    }));
    setProduitLigne({ id: '', quantite: '' });
  };
  const [produitsEntrepot, setProduitsEntrepot] = useState([]);
  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

  // Calcul des frais fixes
  const totalQuantite = form.produits.reduce((acc, p) => acc + Number(p.quantite), 0);
  const fraisFixes = 20 + (2 * totalQuantite);

  const coutKilometre = 1.25; // ou laisse saisir si tu veux
  const distance = Number(form.distance) || 0;

  // Calcul du prix total
  const prixTotal = (coutKilometre * 50) + fraisFixes + distance;

  const dateDebutISO = form.dateTransport
    ? `${form.dateTransport}T00:00:00`
    : null;

  const payload = {
    ...form,
    camion: form.camion ? Number(form.camion) : null,
    destination: form.destination ? Number(form.destination) : null,
    produits: form.produits.map(p => ({
      id: Number(p.id),
      quantite: Number(p.quantite)
    })),
    CoutKilometre: 0,
    FraisFixes: 0,
    IdVehicule: form.camion ? Number(form.camion) : null,
    CoutTotal: 0,
    Distance: Number(form.distance) || 0,
    DateDebut: dateDebutISO,
    Commentaire: "Commande fournisseur",
  };

  

  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}api/transport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setMessage('Demande de transport envoyée !');
      setForm({
        fournisseur: '',
        telephone: '',
        email: '',
        commandeFournisseur: '',
        dateTransport: '',
        produits: [],
        typeCamion: '',
        camion: '',
        destination: ''
      });
    } else {
      const err = await res.text();
      setMessage('Erreur lors de l\'envoi: ' + err);
    }
  } catch (err) {
    setMessage('Erreur lors de l\'envoi');
  }
};

  return (
    <section>
      <h2>🚚 Demande de transport fournisseur</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit} className="transport-form">
        {/* Sélection du fournisseur */}
        <label>Fournisseur :</label>
        <select
          value={form.fournisseur}
          onChange={e => {
            const selectedId = e.target.value;
            const selected = fournisseurs.find(f => String(f.id || f.IdFournisseur) === String(selectedId));
            setForm(f => ({
              ...f,
              fournisseur: selectedId,
              telephone: selected ? (selected.telephone || selected.Telephone) : '',
              email: selected ? (selected.email || selected.Email) : ''
            }));
          }}
          required
        >
          <option value="">Sélectionner un fournisseur</option>
          {fournisseurs.map(f => (
            <option key={f.id || f.IdFournisseur} value={f.id || f.IdFournisseur}>
              {f.nom || f.Nom || f.NomFournisseur} {f.prenom || f.Prenom || ''}
            </option>
          ))}
        </select>
        <input
          placeholder="Téléphone"
          value={form.telephone}
          readOnly
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          readOnly
        />
        <input
          placeholder="N° commande fournisseur"
          value={form.commandeFournisseur}
          onChange={e => setForm(f => ({ ...f, commandeFournisseur: e.target.value }))}
          required
        />
        <input
          type="date"
          value={form.dateTransport}
          onChange={e => setForm(f => ({ ...f, dateTransport: e.target.value }))}
          required
        />
        {/* Produits à transporter */}
        <div>
          <label>Produits à transporter :</label>
          <select
            value={produitLigne.id}
            onChange={e => setProduitLigne(l => ({ ...l, id: e.target.value }))}
          >
            <option value="">Produit</option>
            {produits.map(p => (
              <option key={p.IdProduit} value={p.IdProduit}>{p.NomProduit}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            placeholder="Quantité"
            value={produitLigne.quantite}
            onChange={e => setProduitLigne(l => ({ ...l, quantite: e.target.value }))}
          />
          <button type="button" onClick={addProduit}>Ajouter</button>
          <ul>
            {form.produits.map((p, i) => (
              <li key={i}>
                {produits.find(prod => prod.IdProduit == p.id)?.NomProduit || p.id} : {p.quantite}
              </li>
            ))}
          </ul>
        </div>
        {/* Type de camion */}
        <select
          value={form.typeCamion}
          onChange={e => setForm(f => ({ ...f, typeCamion: e.target.value }))}
          required
        >
          <option value="">Type de camion</option>
          <option value="petit">Petit</option>
          <option value="moyen">Moyen</option>
          <option value="grand">Grand</option>
        </select>
        {/* Camion */}
        <select
          value={form.camion}
          onChange={e => setForm(f => ({ ...f, camion: e.target.value }))}
          required
        >
          <option value="">N° du camion</option>
          {vehicules.map(v => (
            <option key={v.IdVehicule} value={v.IdVehicule}>
              {v.Immatriculation} ({v.TypeCamion})
            </option>
          ))}
        </select>

        <input
            type="number"
            min="0"
            step="0.1"
            placeholder="Distance (km)"
            value={form.distance}
            onChange={e => setForm(f => ({ ...f, distance: e.target.value }))}
            required
            />
        {/* Destination */}
        <select
          value={form.destination}
          onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
          required
        >
          <option value="">Destination</option>
          {entrepots.map(e => (
            <option key={e.IdEntrepot} value={e.IdEntrepot}>{e.Localisation}</option>
          ))}
        </select>
        <button type="submit" className="btn-add">Envoyer la demande</button>
      </form>
    </section>
  );
};

export default TransportRequestForm;