import { useEffect, useState } from 'react';
import { api } from '../api.js';

const EMPTY = { name: '', category: 'Food', description: '', neighborhood: '', hours: '', phone: '', website: '' };
const FAVORITES_KEY = 'community-sprint-favorites';

function loadFavorites() {
  try {
    const saved = window.localStorage.getItem(FAVORITES_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter((value) => Number.isFinite(Number(value)) || typeof value === 'string') : [];
  } catch {
    return [];
  }
}

// Reads and writes the `resources` table through the API.
export default function ResourceBoard() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(() => loadFavorites());

  async function load(nextSearch = search, nextCategory = category) {
    try {
      const data = await api.resources({ search: nextSearch, category: nextCategory });
      setResources(data.resources);
      setCategories(data.categories);
    } catch (err) {
      setMessage({ kind: 'error', text: err.message });
    }
  }

  useEffect(() => {
    load('', '');
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage failures in private browsing or restricted environments.
    }
  }, [favoriteIds]);

  async function save(event) {
    event.preventDefault();
    try {
      await api.addResource(form);
      setForm(EMPTY);
      setShowForm(false);
      setMessage({ kind: 'ok', text: 'Saved to the database!' });
      load();
    } catch (err) {
      setMessage({ kind: 'error', text: err.message }); // zod's friendly message from the server
    }
  }

  const favoriteSet = new Set(favoriteIds.map((id) => String(id)));
  const favorites = resources.filter((resource) => favoriteSet.has(String(resource.id)));

  const toggleFavorite = (resourceId) => {
    const normalizedId = String(resourceId);
    setFavoriteIds((current) => {
      const asStrings = current.map((id) => String(id));
      return asStrings.includes(normalizedId)
        ? asStrings.filter((id) => id !== normalizedId)
        : [...asStrings, normalizedId];
    });
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <section className="card resources" aria-labelledby="res-title">
      <div className="card-head">
        <h2 id="res-title">Community resources</h2>
        <button type="button" className="ghost" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close' : '+ Add one'}
        </button>
      </div>

      <div className="favorites-panel" aria-live="polite">
        <h3>My favorites</h3>
        {favorites.length === 0 ? (
          <p className="favorites-empty">No favorites saved yet.</p>
        ) : (
          <ul className="favorite-list">
            {favorites.map((resource) => (
              <li key={resource.id}>
                <span>{resource.name}</span>
                <button type="button" className="favorite-toggle active" aria-label={`Remove ${resource.name} from favorites`} onClick={() => toggleFavorite(resource.id)}>
                  ★
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form className="filters" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <label className="sr-only" htmlFor="res-search">Search resources</label>
        <input id="res-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search: food, tutor, clinic..." />
        <label className="sr-only" htmlFor="res-cat">Category</label>
        <select id="res-cat" value={category} onChange={(e) => { setCategory(e.target.value); load(search, e.target.value); }}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button type="submit">Search</button>
      </form>

      {showForm && (
        <form className="add-form" onSubmit={save}>
          <input value={form.name} onChange={update('name')} placeholder="Name *" aria-label="Name" />
          <select value={form.category} onChange={update('category')} aria-label="Category">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <textarea value={form.description} onChange={update('description')} placeholder="What do they offer? *" aria-label="Description" rows={2} />
          <input value={form.neighborhood} onChange={update('neighborhood')} placeholder="Neighborhood" aria-label="Neighborhood" />
          <input value={form.hours} onChange={update('hours')} placeholder="Hours" aria-label="Hours" />
          <input value={form.phone} onChange={update('phone')} placeholder="Phone" aria-label="Phone" />
          <input value={form.website} onChange={update('website')} placeholder="https://..." aria-label="Website" />
          <button type="submit">Save</button>
        </form>
      )}

      {message && <p className={`notice ${message.kind}`} role="status">{message.text}</p>}

      <p className="result-count">{resources.length} result{resources.length === 1 ? '' : 's'}</p>
      <ul className="resource-list">
        {resources.map((r) => {
          const isFavorite = favoriteSet.has(String(r.id));
          return (
            <li key={r.id}>
              <span className="tag">{r.category}</span>
              <div className="resource-title-row">
                <h3>{r.name}</h3>
                <button
                  type="button"
                  className={`favorite-toggle ${isFavorite ? 'active' : ''}`}
                  aria-label={isFavorite ? `Remove ${r.name} from favorites` : `Add ${r.name} to favorites`}
                  aria-pressed={isFavorite}
                  onClick={() => toggleFavorite(r.id)}
                >
                  {isFavorite ? '★' : '☆'}
                </button>
              </div>
              <p>{r.description}</p>
              <small>{[r.neighborhood, r.hours, r.phone].filter(Boolean).join(' · ')}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
