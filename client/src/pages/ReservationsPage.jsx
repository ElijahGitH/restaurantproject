import { useEffect, useState } from "react";
import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function ReservationsPage() {
  const userId = localStorage.getItem("userId") || "";

  const [pageMessage, setPageMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [partySize, setPartySize] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [myReservations, setMyReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [editReservationId, setEditReservationId] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  useEffect(() => {
    loadAllReservations();

    if (userId !== "") {
      loadMyReservations();
    }
  }, []);

  function loadAllReservations() {
    fetch("http://localhost:5000/api/reservations")
      .then((response) => response.json())
      .then((data) => {
        setAllReservations(data);
      })
      .catch(() => {
        setPageMessage("Could not load seating layout");
      });
  }

  function loadMyReservations() {
    fetch(`http://localhost:5000/api/my/reservations/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setMyReservations(data);
      })
      .catch(() => {
        setPageMessage("Could not load your reservations");
      });
  }

  function formatReservationTime(value) {
    if (!value) {
      return "";
    }

    const dateObject = new Date(value);

    if (Number.isNaN(dateObject.getTime())) {
      return value;
    }

    return dateObject.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatForDateTimeLocal(value) {
    if (!value) {
      return "";
    }

    const dateObject = new Date(value);

    if (Number.isNaN(dateObject.getTime())) {
      return value.slice(0, 16);
    }

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hour = String(dateObject.getHours()).padStart(2, "0");
    const minute = String(dateObject.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  function isBlockingReservation(oneReservation) {
    return oneReservation && oneReservation.approvalStatus !== "Denied";
  }

  function clearReservationForm() {
    setCustomerName("");
    setTableNumber("");
    setPartySize("");
    setReservationTime("");
    setEditReservationId("");
    setSelectedTable("");
  }

  function saveReservation(event) {
    event.preventDefault();

    if (userId === "") {
      setPageMessage("Please login first");
      return;
    }

    if (customerName.trim() === "") {
      setPageMessage("Please enter the customer name");
      return;
    }

    if (tableNumber.trim() === "") {
      setPageMessage("Please choose a table or bar seat");
      return;
    }

    if (partySize === "") {
      setPageMessage("Please enter a party size");
      return;
    }

    if (reservationTime === "") {
      setPageMessage("Please choose a reservation time");
      return;
    }

    const reservationData = {
      userId: userId,
      customerName: customerName.trim(),
      tableNumber: tableNumber,
      reservationTime: reservationTime,
      partySize: partySize
    };

    if (editReservationId !== "") {
      fetch(`http://localhost:5000/api/my/reservations/${editReservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      })
        .then((response) => response.json())
        .then(() => {
          clearReservationForm();
          loadMyReservations();
          loadAllReservations();
          setPageMessage("Your reservation was updated");
        })
        .catch(() => {
          setPageMessage("Could not update your reservation");
        });
    } else {
      fetch("http://localhost:5000/api/my/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      })
        .then((response) => response.json())
        .then(() => {
          clearReservationForm();
          loadMyReservations();
          loadAllReservations();
          setPageMessage("Your reservation was submitted");
        })
        .catch(() => {
          setPageMessage("Could not add your reservation");
        });
    }
  }

  function startEditReservation(oneReservation) {
    setCustomerName(oneReservation.customerName);
    setTableNumber(String(oneReservation.tableNumber));
    setPartySize(oneReservation.partySize ? String(oneReservation.partySize) : "");
    setReservationTime(formatForDateTimeLocal(oneReservation.reservationTime));
    setEditReservationId(oneReservation._id);
    setSelectedTable(String(oneReservation.tableNumber));
    setPageMessage("Editing your reservation");
  }

  function deleteReservation(reservationId) {
    fetch(`http://localhost:5000/api/my/reservations/${reservationId}/${userId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        loadMyReservations();
        loadAllReservations();
        setPageMessage("Your reservation was deleted");
      })
      .catch(() => {
        setPageMessage("Could not delete your reservation");
      });
  }

  return (
    <div className="site-simple-page">
      <SiteNavbar />

      <div className="container mt-5 mb-5">
        <h1 className="text-center display-3">Reservations</h1>

        {pageMessage && <p className="site-message">{pageMessage}</p>}

        <div className="site-panel">
          <h2>Reserve Your Table</h2>

          <form onSubmit={saveReservation} className="dashboard-form">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
            />

            <input
              type="text"
              placeholder="Table Number or Bar Seat"
              value={tableNumber}
              onChange={(event) => setTableNumber(event.target.value)}
            />

            <input
              type="number"
              min="1"
              placeholder="Party Size"
              value={partySize}
              onChange={(event) => setPartySize(event.target.value)}
            />

            <input
              type="datetime-local"
              value={reservationTime}
              onChange={(event) => setReservationTime(event.target.value)}
            />

            <button type="submit">
              {editReservationId !== "" ? "Update Reservation" : "Add Reservation"}
            </button>

            {editReservationId !== "" && (
              <button
                type="button"
                className="cancel-button"
                onClick={clearReservationForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="site-panel">
          <h2>Seating Layout</h2>

          <div className="seating-legend">
            <span className="legend-item available-legend">Available</span>
            <span className="legend-item occupied-legend">Reserved</span>
            <span className="legend-item selected-legend">Selected</span>
          </div>

          <div className="bar-area">
            <span className="bar-label">Bar</span>

            <div className="bar-seats">
              {[...Array(17)].map((_, index) => {
                const seatNum = index + 21;
                const seatValue = `bar-${seatNum}`;

                const foundReservation = allReservations.find(
                  (oneReservation) => String(oneReservation.tableNumber) === seatValue
                );

                const reserved = isBlockingReservation(foundReservation);
                const isSelected = selectedTable === seatValue;

                return (
                  <div
                    key={seatNum}
                    className={`bar-seat ${
                      isSelected
                        ? "bar-seat-selected"
                        : reserved
                        ? "bar-seat-reserved"
                        : "bar-seat-available"
                    }`}
                    onClick={() => {
                      if (!reserved || isSelected) {
                        setTableNumber(seatValue);
                        setSelectedTable(seatValue);
                      }
                    }}
                    title={reserved ? "Reserved" : "Available"}
                  >
                    {seatNum}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="seating-layout">
            {[...Array(20)].map((_, index) => {
              const tableNum = index + 1;
              const tableValue = String(tableNum);

              const foundReservation = allReservations.find(
                (oneReservation) =>
                  String(oneReservation.tableNumber) === tableValue
              );

              const reservationFound = isBlockingReservation(foundReservation)
                ? foundReservation
                : null;

              const isBooth = tableNum % 5 === 0;
              const isSelected = selectedTable === tableValue;

              return (
                <div
                  key={tableNum}
                  className={`table-wrapper ${
                    isBooth ? "large" : ""
                  } ${
                    isSelected
                      ? "selected"
                      : reservationFound
                      ? "occupied"
                      : "available"
                  }`}
                  onClick={() => {
                    if (!reservationFound || isSelected) {
                      setTableNumber(tableValue);
                      setSelectedTable(tableValue);
                    }
                  }}
                  title={reservationFound ? "Reserved" : "Available"}
                >
                  <div className="table-shape">
                    <span>{tableNum}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="site-panel">
          <h2>My Reservations</h2>

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Table Number</th>
                <th>Party Size</th>
                <th>Reservation Time</th>
                <th>Approval</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {myReservations.map((oneReservation) => (
                <tr key={oneReservation._id}>
                  <td>{oneReservation.customerName}</td>
                  <td>{oneReservation.tableNumber}</td>
                  <td>{oneReservation.partySize}</td>
                  <td>{formatReservationTime(oneReservation.reservationTime)}</td>
                  <td>{oneReservation.approvalStatus}</td>
                  <td>
                    <button onClick={() => startEditReservation(oneReservation)}>
                      Edit
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteReservation(oneReservation._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReservationsPage;