import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function HistoryTabs() {
  const categories = ["Delivery Challan", "Retail Invoice", "Tax Invoice"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, activeCategory), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
        setRecords([]);
      }
      setLoading(false);

      // Clear filters when category changes
      setFilterName("");
      setFilterDate("");
      setFilterMonth("");
      setFilterYear("");
    };

    fetchRecords();
  }, [activeCategory]);

  // Helper to get name field for filtering
  const getName = (record) => {
    if (activeCategory === "Delivery Challan") {
      return record.driverDetails?.name || "";
    }
    return record.customer?.name || "";
  };

  // Filter records based on filters
  const filteredRecords = records.filter((record) => {
    const name = getName(record).toLowerCase();
    const dateObj = record.date?.toDate ? record.date.toDate() : new Date(record.date);

    // Filter by name
    if (filterName && !name.includes(filterName.toLowerCase())) {
      return false;
    }

    // Filter by exact date (yyyy-mm-dd)
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      if (
        dateObj.getFullYear() !== filterDateObj.getFullYear() ||
        dateObj.getMonth() !== filterDateObj.getMonth() ||
        dateObj.getDate() !== filterDateObj.getDate()
      ) {
        return false;
      }
    }

    // Filter by month (0-based month index)
    if (filterMonth) {
      if (dateObj.getMonth() !== parseInt(filterMonth, 10)) {
        return false;
      }
    }

    // Filter by year
    if (filterYear) {
      if (dateObj.getFullYear() !== parseInt(filterYear, 10)) {
        return false;
      }
    }

    return true;
  });

  // Generate year options from records for the filter dropdown
  const uniqueYears = [
    ...new Set(
      records.map((rec) => {
        const d = rec.date?.toDate ? rec.date.toDate() : new Date(rec.date);
        return d.getFullYear();
      })
    ),
  ].sort((a, b) => b - a);

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4 fw-bold">History - {activeCategory}</h2>

      {/* Category Tabs */}
      <ul className="nav nav-tabs justify-content-center mb-4">
        {categories.map((cat) => (
          <li key={cat} className="nav-item">
            <button
              className={`nav-link ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Filters */}
      <div className="row mb-4 g-3 justify-content-center">
        <div className="col-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>

        <div className="col-auto">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
          />
        </div>

        <div className="col-auto">
          <select
            className="form-select"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, idx) => (
              <option key={month} value={idx}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <select
            className="form-select"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
          >
            <option value="">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters Button */}
        {(filterName || filterDate || filterMonth || filterYear) && (
          <div className="col-auto">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setFilterName("");
                setFilterDate("");
                setFilterMonth("");
                setFilterYear("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      {loading ? (
        <p className="text-center">Loading records...</p>
      ) : filteredRecords.length === 0 ? (
        <p className="text-center">No {activeCategory} records found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                {activeCategory === "Delivery Challan" ? (
                  <>
                    <th>Driver Name</th>
                    <th>Licence No</th>
                    <th>Vehicle No</th>
                  </>
                ) : (
                  <>
                    <th>Customer</th>
                    <th>Total (₹)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => {
                const dateObj = record.date?.toDate ? record.date.toDate() : new Date(record.date);
                return (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td>{dateObj.toLocaleDateString()}</td>
                    {activeCategory === "Delivery Challan" ? (
                      <>
                        <td>{record.driverDetails?.name || "-"}</td>
                        <td>{record.driverDetails?.licence || "-"}</td>
                        <td>{record.driverDetails?.vehicle || "-"}</td>
                      </>
                    ) : (
                      <>
                        <td>{record.customer?.name || "-"}</td>
                        <td>{record.totals?.total ? record.totals.total.toFixed(2) : "-"}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
