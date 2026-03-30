import { useState } from "react";

export default function Reservations() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    guests: 1
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Reservation submitted!");
        setForm({
          name: "",
          email: "",
          date: "",
          time: "",
          guests: 1
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Make a Reservation</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />
        <br />

        <input
          type="number"
          name="guests"
          min="1"
          value={form.guests}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit">Submit Reservation</button>
      </form>
    </div>
  );
}
