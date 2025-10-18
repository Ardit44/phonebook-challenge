import { useState } from "react";
import "./App.css";

const FALLBACK_CONTACTS = [
    {
        id: 1,
        name: "James Bond",
        phone: "007-000-0001",
        email: "james.bond1@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 2,
        name: "James Bond",
        phone: "007-000-0002",
        email: "james.bond2@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 3,
        name: "James Bond",
        phone: "007-000-0003",
        email: "james.bond3@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 4,
        name: "James Bond",
        phone: "007-000-0004",
        email: "james.bond4@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 5,
        name: "James Bond",
        phone: "007-000-0005",
        email: "james.bond5@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 6,
        name: "James Bond",
        phone: "007-000-0006",
        email: "james.bond6@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 7,
        name: "James Bond",
        phone: "007-000-0007",
        email: "james.bond7@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 8,
        name: "James Bond",
        phone: "007-000-0008",
        email: "james.bond8@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 9,
        name: "James Bond",
        phone: "007-000-0009",
        email: "james.bond9@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
    {
        id: 10,
        name: "James Bond",
        phone: "007-000-0010",
        email: "james.bond10@mi6.co.uk",
        photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
    },
];

const App = () => {
    const [contacts, setContacts] = useState(FALLBACK_CONTACTS);
    const [form, setForm] = useState({ name: "", phone: "", email: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.phone) return;

        const newContact = {
            id: Date.now(),
            name: form.name,
            phone: form.phone,
            email: form.email || "N/A",
            photo: "https://i.pinimg.com/736x/bf/00/75/bf0075ba6468135d6397dbd4676c288b.jpg",
        };

        setContacts([newContact, ...contacts]);
        setForm({ name: "", phone: "", email: "" });
    };

    return (
        <main>
            <header>
                <h1>Phonebook Challenge</h1>
                <p>A simple contact directory</p>
            </header>

            <section>
                <h2>Contacts</h2>
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.id}>
                            <article>
                                <img
                                    src={contact.photo}
                                    alt={`Portrait of ${contact.name}`}
                                    width="64"
                                    height="64"
                                    style={{ borderRadius: "50%" }}
                                />
                                <h3>{contact.name}</h3>
                                <p>Phone: {contact.phone}</p>
                                <p>Email: {contact.email}</p>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Add a Contact</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Enter full name"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="Enter phone number"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="Enter email (optional)"
                        />
                    </div>
                    <button type="submit">Add Contact</button>
                </form>
            </section>

            <footer>
                <p>&copy; 2025 Phonebook Challenge</p>
            </footer>
        </main>
    );
};

export default App;