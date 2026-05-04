# Project Context: Wedding Organizer

## 1. Struttura Completa delle Cartelle e File
```text
wedding-organizer/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── index.html
├── README.md
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── App.css
    ├── lib/
    │   └── supabase.js
    ├── contexts/
    │   └── AuthContext.jsx
    ├── components/
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   ├── LoginForm.jsx
    │   ├── SignupForm.jsx
    │   ├── GuestForm.jsx
    │   └── GuestTable.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Dashboard.jsx
    │   └── Guests.jsx
    ├── hooks/
    │   ├── useGuests.js
    │   └── useStats.js
    └── assets/
```

## 2. Contenuto dei File di Codice Importanti

### `src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Guests from './pages/Guests'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-8 text-center">Caricamento...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="guests" element={<Guests />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```

### `src/pages/Dashboard.jsx`
```jsx
import { useAuth } from '../contexts/AuthContext'
import { useStats } from '../hooks/useStats'

export default function Dashboard() {
  const { user } = useAuth()
  const { totalGuests, confirmedGuests, totalTables, loading } = useStats()

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Caricamento...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Benvenuto, {user?.email}!</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Totale invitati</h2>
          <p className="text-3xl font-bold mt-2">{totalGuests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Confermati</h2>
          <p className="text-3xl font-bold mt-2">{confirmedGuests}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Tavoli</h2>
          <p className="text-3xl font-bold mt-2">{totalTables}</p>
        </div>
      </div>
    </div>
  )
}
```

### `src/pages/Guests.jsx`
```jsx
import { useState } from 'react'
import { useGuests } from '../hooks/useGuests'
import GuestTable from '../components/GuestTable'
import GuestForm from '../components/GuestForm'

export default function Guests() {
  const { guests, loading, error, addGuest, updateGuest, deleteGuest } = useGuests()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenModal = (guest = null) => {
    setEditingGuest(guest)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingGuest(null)
  }

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      if (editingGuest) {
        await updateGuest(editingGuest.id, data)
      } else {
        await addGuest(data)
      }
      handleCloseModal()
    } catch (err) {
      alert("Errore durante il salvataggio: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo ospite?")) {
      try {
        await deleteGuest(id)
      } catch (err) {
        alert("Errore durante l'eliminazione: " + err.message)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestione Invitati</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          + Nuovo ospite
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded mb-4">{error}</div>}

      {loading && guests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Caricamento ospiti...</div>
      ) : (
        <GuestTable 
          guests={guests} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
        />
      )}

      {isModalOpen && (
        <GuestForm 
          initialData={editingGuest} 
          onSubmit={handleSubmit} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  )
}
```

## 3. Package.json
```json
{
  "name": "wedding-organizer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@supabase/supabase-js": "^2.49.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.0"
  }
}
```

## 4. Schema Database
Lo schema definisce i dati per la gestione degli invitati e l'assegnazione dei tavoli usando PostgreSQL in Supabase, con le regole RLS per la sicurezza dei dati:

```sql
create extension if not exists "uuid-ossp";

create table guests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  full_name text not null,
  email text,
  phone text,
  plus_one boolean default false,
  plus_one_name text,
  invitation_status text default 'pending' check (invitation_status in ('pending','sent','opened','accepted','declined')),
  rsvp_status text default 'pending' check (rsvp_status in ('pending','confirmed','declined','no_response')),
  dietary_restrictions text,
  notes text,
  table_id uuid,
  user_id uuid references auth.users(id) on delete cascade not null
);

create table tables (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  updated_at timestamtz default now(),
  name text not null,
  capacity integer not null default 8 check (capacity > 0),
  shape text default 'round' check (shape in ('round','rectangular','head')),
  position_x integer default 0,
  position_y integer default 0,
  user_id uuid references auth.users(id) on delete cascade not null
);

create table table_assignments (
  id uuid default gen_random_uuid() primary key,
  guest_id uuid references guests(id) on delete cascade not null,
  table_id uuid references tables(id) on delete cascade not null,
  seat_number integer,
  unique(guest_id, table_id)
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_guests_updated_at before update on guests for each row execute function update_updated_at_column();
create trigger update_tables_updated_at before update on tables for each row execute function update_updated_at_column();

alter table guests enable row level security;
alter table tables enable row level security;
alter table table_assignments enable row level security;

create policy "Users can CRUD own guests" on guests for all using (auth.uid() = user_id);
create policy "Users can CRUD own tables" on tables for all using (auth.uid() = user_id);
create policy "Users can manage assignments via guests" on table_assignments for all using (exists (select 1 from guests g where g.id = table_assignments.guest_id and g.user_id = auth.uid()));
create policy "Users can manage assignments via tables" on table_assignments for all using (exists (select 1 from tables t where t.id = table_assignments.table_id and t.user_id = auth.uid()));
```

## 5. Variabili di Ambiente Necessarie
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Come funziona l'app in breve
L'applicazione **Wedding Organizer** è sviluppata come una Single Page Application (SPA) utilizzando **React 19**, impacchettata e buildata con **Vite 6** e stilizzata in modo moderno con **Tailwind CSS 4**. Per quanto riguarda il backend (BaaS), si appoggia integralmente a **Supabase**, il quale fornisce sia l'autenticazione (login/signup) sia il database in tempo reale basato su PostgreSQL.

*   **Autenticazione**: È gestita nel componente globale `AuthContext.jsx` in combinazione con Supabase Auth. Le rotte sensibili (`/` dashboard e `/guests`) sono avvolte in un `ProtectedRoute` (nel file `App.jsx`) che blocca l'accesso se un utente non è autenticato, rimandandolo al `/login`.
*   **Gestione Ospiti e Tavoli**: Attraverso i Custom Hooks (come `useGuests` e `useStats`) i componenti possono interfacciarsi con il database in modo reattivo. L'utente ha accesso ai propri invitati in isolamento grazie alle Row Level Security (RLS) policies impostate su Supabase. L'utente può creare e aggiornare dati (anagrafica, RSVP, diete speciali) dal database tramite form specifici (`GuestForm`).
*   **Interfaccia Utente**: È progettata con layout responsivo tramite Tailwind CSS, suddividendo logicamente le view in `Dashboard` (che dà un resoconto e statistiche degli invitati e tavoli) e in `Guests` (che presenta la tabella CRUD degli invitati e la logica per aggiungerne di nuovi e cancellarli).
