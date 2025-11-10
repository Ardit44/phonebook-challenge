import "./Contact.css";

const AVATAR = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80";

const Contact = ({ name, phone, email, photo }) => {
  return (
    <article className="contact-card" aria-label={name}>
      <img
        src={photo || AVATAR}
        alt={name}
        width={88}
        height={88}
        onError={(e) => { e.currentTarget.src = AVATAR; }}
      />
      <div className="contact-card__body">
        <h3 className="contact-card__name">{name}</h3>
        <p className="contact-card__phone">Phone: {phone}</p>
        <p className="contact-card__email">Email: {email || "—"}</p>
      </div>
    </article>
  );
};

export default Contact;
