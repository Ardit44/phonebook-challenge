import { useEffect, useMemo, useState } from "react";
import "./App.css";
import Contact from "./components/Contact/Contact.jsx";

const AVATAR = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80";

const FALLBACK_CONTACTS = [
	{ id: 1,  name: "Darth Vader",      phone: "555-000-0001", email: "darth.vader@villains.dev",    photo: AVATAR },
	{ id: 2,  name: "The Joker",        phone: "555-000-0002", email: "joker@villains.dev",          photo: AVATAR },
	{ id: 3,  name: "Lord Voldemort",   phone: "555-000-0003", email: "voldemort@villains.dev",      photo: AVATAR },
	{ id: 4,  name: "Magneto",          phone: "555-000-0004", email: "magneto@villains.dev",        photo: AVATAR },
	{ id: 5,  name: "Loki",             phone: "555-000-0005", email: "loki@villains.dev",           photo: AVATAR },
	{ id: 6,  name: "Thanos",           phone: "555-000-0006", email: "thanos@villains.dev",         photo: AVATAR },
	{ id: 7,  name: "Maleficent",       phone: "555-000-0007", email: "maleficent@villains.dev",     photo: AVATAR },
	{ id: 8,  name: "Scar",             phone: "555-000-0008", email: "scar@villains.dev",           photo: AVATAR },
	{ id: 9,  name: "Ursula",           phone: "555-000-0009", email: "ursula@villains.dev",         photo: AVATAR },
	{ id: 10, name: "Sauron",           phone: "555-000-0010", email: "sauron@villains.dev",         photo: AVATAR }
];

const STORAGE_KEY = "contacts_v1";

const App = () => {
	const [contacts, setContacts] = useState([]);
	const [status, setStatus] = useState("idle"); // idle|loading|ready|error
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [form, setForm] = useState({ name: "", phone: "", email: "" });
	const [touched, setTouched] = useState({});
	const [submitting, setSubmitting] = useState(false);
	const [page, setPage] = useState(1);

	// Load from localStorage then fetch remote
	useEffect(() => {
		let cancelled = false;
		const stored = (() => {
			try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
			catch { return []; }
		})();
		if (stored.length) setContacts(stored);
		const load = async () => {
			setStatus("loading");
			try {
				const res = await fetch("/data/contacts.json", { cache: "no-store" });
				if (!res.ok) throw new Error("Network error");
				const data = await res.json();
				if (cancelled) return;
				const withPhotos = data.map(c => ({ ...c, photo: AVATAR }));
				if (!stored.length) setContacts(withPhotos);
				else {
					// Merge any new remote contacts not in stored (by id)
						const existingIds = new Set(stored.map(c => c.id));
						const merged = [...stored, ...withPhotos.filter(c => !existingIds.has(c.id))];
						setContacts(merged);
				}
				setStatus("ready");
			} catch (e) {
				if (cancelled) return;
				setError("Fetch failed. Using fallback list.");
				if (!stored.length) setContacts(FALLBACK_CONTACTS);
				setStatus("error");
			}
		};
		load();
		return () => { cancelled = true; };
	}, []);

	// Persist
	useEffect(() => {
		if (contacts.length) {
			try { localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts)); } catch {}
		}
	}, [contacts]);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return contacts;
		return contacts.filter(c =>
			c.name.toLowerCase().includes(q) ||
			c.phone.toLowerCase().includes(q)
		);
	}, [contacts, query]);

	// Pagination: one per page
	const totalPages = filtered.length || 1;
	useEffect(() => {
		if (page > totalPages) setPage(1);
	}, [filtered, totalPages, page]);

	const currentContact = filtered[page - 1];

	// Validation
	const nameErr = touched.name && (!form.name.trim() ? "Name required" :
		form.name.trim().length < 2 ? "Min 2 chars" : "");
	const phoneErr = touched.phone && (!form.phone.trim() ? "Phone required" : "");
	const emailErr = touched.email && (form.email && !/@/.test(form.email) ? "Invalid email" : "");
	const formValid = !nameErr && !phoneErr && !emailErr &&
		form.name.trim().length >= 2 && form.phone.trim() &&
		(!form.email || /@/.test(form.email));

	function handleChange(e) {
		const { name, value } = e.target;
		setForm(f => ({ ...f, [name]: value }));
	}
	function handleBlur(e) {
		setTouched(t => ({ ...t, [e.target.name]: true }));
	}
	function handleSubmit(e) {
		e.preventDefault();
		setTouched({ name: true, phone: true, email: true });
		if (!formValid) return;
		setSubmitting(true);
		const newContact = {
			id: Date.now(),
			name: form.name.trim(),
			phone: form.phone.trim(),
			email: form.email.trim(),
			photo: AVATAR
		};
		setContacts(prev => [newContact, ...prev]);
		setForm({ name: "", phone: "", email: "" });
		setTouched({});
		setPage(1);
		setSubmitting(false);
	}

	function prev() { setPage(p => Math.max(1, p - 1)); }
	function next() { setPage(p => Math.min(totalPages, p + 1)); }

	return (
		<main className="page">
			<header className="page__header">
				<h1 className="page__title">Villain Directory</h1>
				<p className="page__subtitle">
					{status === "loading" && "Loading contacts..."}
					{status === "ready" && "Contacts loaded"}
					{status === "error" && error}
				</p>
			</header>

			<section className="search" aria-labelledby="search-heading">
				<h2 id="search-heading" style={{margin:"0 0 .5rem"}}>Search</h2>
				<div className="search__controls">
					<label htmlFor="search-input">Name or Phone</label>
					<input
						id="search-input"
						type="search"
						placeholder="Type to filter..."
						value={query}
						onChange={(e) => { setQuery(e.target.value); setPage(1); }}
						disabled={status === "loading"}
					/>
				</div>
				<p className="search__results">
					{filtered.length} result{filtered.length !== 1 && "s"}
				</p>
			</section>

			<section className="contacts" aria-labelledby="contacts-heading">
				<h2 id="contacts-heading" style={{margin:"1.75rem 0 .75rem"}}>Contacts</h2>
				<ul className="contacts__grid">
					{currentContact ? (
						<li key={currentContact.id} style={{listStyle:"none", width:"100%"}}>
							<Contact {...currentContact} />
						</li>
					) : (
						status === "loading" ? <li>Loading…</li> : <li>No matches.</li>
					)}
				</ul>
				<div className="pagination">
					<button className="btn" onClick={prev} disabled={page <= 1}>Previous</button>
					<span style={{color:"#9ca3af"}}>Page {page} of {totalPages}</span>
            <button className="btn" onClick={next} disabled={page >= totalPages}>Next</button>
				</div>
			</section>

			<section className="form" aria-labelledby="add-heading">
				<h2 id="add-heading" style={{margin:"2rem 0 .75rem"}}>Add Contact</h2>
				<form className="form__body" onSubmit={handleSubmit} noValidate>
					<div className="field">
						<label htmlFor="name">Name *</label>
						<input
							id="name"
							name="name"
							value={form.name}
							onChange={handleChange}
							onBlur={handleBlur}
							minLength={2}
							required
							aria-invalid={!!nameErr}
							aria-describedby={nameErr ? "err-name" : undefined}
							placeholder="Villain name"
						/>
						{nameErr && <small id="err-name" className="err">{nameErr}</small>}
					</div>
					<div className="field">
						<label htmlFor="phone">Phone *</label>
						<input
							id="phone"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							onBlur={handleBlur}
							required
							aria-invalid={!!phoneErr}
							aria-describedby={phoneErr ? "err-phone" : undefined}
							placeholder="Contact number"
						/>
						{phoneErr && <small id="err-phone" className="err">{phoneErr}</small>}
					</div>
					<div className="field">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							onBlur={handleBlur}
							aria-invalid={!!emailErr}
							aria-describedby={emailErr ? "err-email" : undefined}
							placeholder="evil@domain.dev"
						/>
						{emailErr && <small id="err-email" className="err">{emailErr}</small>}
					</div>
					<div className="form__actions">
						<button className="btn" type="submit" disabled={submitting || status === "loading"}>
							{submitting ? "Adding..." : "Add Contact"}
						</button>
					</div>
				</form>
			</section>

			<footer className="page__footer">
				<small>Sections 3 & 4 implemented (pagination, data, search, add, validation).</small>
			</footer>
		</main>
	);
};

export default App;