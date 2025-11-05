import { useEffect, useMemo, useState } from "react";
import "./App.css";

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
	{ id: 10, name: "Sauron",           phone: "555-000-0010", email: "sauron@villains.dev",         photo: AVATAR },
];

const PLACEHOLDER_PHOTO = AVATAR;

const App = () => {
	const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
	const [query, setQuery] = useState("");
	const [form, setForm] = useState({ name: "", phone: "", email: "" });
	const [currentPage, setCurrentPage] = useState(1);

	const filteredContacts = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return contacts;
		return contacts.filter((c) => {
			const email = c.email || "";
			return (
				c.name.toLowerCase().includes(q) ||
				c.phone.toLowerCase().includes(q) ||
				email.toLowerCase().includes(q)
			);
		});
	}, [contacts, query]);

	const totalPages = Math.max(1, filteredContacts.length);
	// clamp currentPage when filteredContacts changes
	useEffect(() => {
		if (currentPage > totalPages) setCurrentPage(1);
	}, [filteredContacts, totalPages, currentPage]);

	const currentContact = filteredContacts.length ? filteredContacts[currentPage - 1] : null;

	function handleSubmit(e) {
		e.preventDefault();
		const { name, phone, email } = form;
		if (!name.trim() || !phone.trim()) return;
		const newContact = {
			id: Date.now(),
			name: name.trim(),
			phone: phone.trim(),
			email: (email || "").trim(),
			photo: AVATAR,
		};
		setContacts((prev) => [newContact, ...prev]);
		setForm({ name: "", phone: "", email: "" });
		setCurrentPage(1);
	}

	function goPrev() {
		setCurrentPage((p) => Math.max(1, p - 1));
	}

	function goNext() {
		setCurrentPage((p) => Math.min(totalPages, p + 1));
	}

	return (
		<main className="page" data-testid="page-root">
			<header className="page__header">
				<h1 className="page__title">Phonebook Challenge</h1>
				<p className="page__subtitle">A simple contact directory</p>
			</header>

			<section className="search" aria-labelledby="search-heading">
				<h2 id="search-heading">Search Contacts</h2>
				<div className="search__controls">
					<label htmlFor="search-input">Search</label>
					<input
						id="search-input"
						type="search"
						placeholder="Search by name, phone, or email"
						value={query}
						onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
						data-testid="search-input"
					/>
				</div>
				<p className="search__results" data-testid="results-count">
					Showing {filteredContacts.length} {filteredContacts.length === 1 ? "result" : "results"}
				</p>
			</section>

			<section className="contacts" aria-labelledby="contacts-heading">
				<h2 id="contacts-heading">Contacts</h2>

				<ul className="contacts__grid">
					{currentContact ? (
						<li key={currentContact.id}>
							<article className="contact-card">
								<img
									src={currentContact.photo || PLACEHOLDER_PHOTO}
									alt={`Portrait of ${currentContact.name}`}
									width={120}
									height={120}
									onError={(e) => { e.currentTarget.src = PLACEHOLDER_PHOTO; }}
								/>
								<div className="contact-card__body">
									<h3 className="contact-card__name">{currentContact.name}</h3>
									<p className="contact-card__phone">Phone: {currentContact.phone}</p>
									<p className="contact-card__email">Email: {currentContact.email || "—"}</p>
								</div>
							</article>
						</li>
					) : (
						<li>No contacts found.</li>
					)}
				</ul>

				<div className="pagination" aria-label="Pagination controls">
					<button onClick={goPrev} disabled={currentPage <= 1} aria-label="Previous contact" className="btn">
						Previous
					</button>
					<span style={{ margin: "0 0.75rem", alignSelf: "center" }}>
						Page {currentPage} of {totalPages}
					</span>
					<button onClick={goNext} disabled={currentPage >= totalPages} aria-label="Next contact" className="btn">
						Next
					</button>
				</div>
			</section>

			<section className="form" aria-labelledby="form-heading">
				<h2 id="form-heading">Add a Contact</h2>
				<form className="form__body" onSubmit={handleSubmit} noValidate>
					<div className="field">
						<label htmlFor="name">Name</label>
						<input
							id="name"
							name="name"
							placeholder="Full name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
							minLength={2}
						/>
					</div>
					<div className="field">
						<label htmlFor="phone">Phone</label>
						<input
							id="phone"
							name="phone"
							inputMode="tel"
							placeholder="(555) 555-5555"
							value={form.phone}
							onChange={(e) => setForm({ ...form, phone: e.target.value })}
							required
						/>
					</div>
					<div className="field">
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="name@example.com"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
						/>
					</div>
					<div className="form__actions">
						<button className="btn" type="submit" data-testid="btn-add">Add Contact</button>
					</div>
				</form>
			</section>

			<footer className="page__footer">
				<small>Starter provided. Complete tasks per README and make this page shine.</small>
			</footer>
		</main>
	);
};

export default App;