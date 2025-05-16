import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

const App = () => {
  const [total, setTotal] = useState(0);
  const [byProgramme, setByProgramme] = useState([]);
  const [byYear, setByYear] = useState([]);
  const [topSchools, setTopSchools] = useState([]);

  // Filter states
  const [filterYear, setFilterYear] = useState("all");
  const [filterProgramme, setFilterProgramme] = useState("all");

  // For filter dropdown options
  const [availableYears, setAvailableYears] = useState([]);
  const [availableProgrammes, setAvailableProgrammes] = useState([]);

  // Fetch initial data & filters
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data depending on filters
  useEffect(() => {
    fetchData();
  }, [filterYear, filterProgramme]);

  const fetchData = async () => {
    try {
      // Fetch total registrations
      const totalRes = await axios.get(
        "http://localhost:5000/api/total-registrations"
      );
      setTotal(totalRes.data.total);

      // Fetch registrations by programme
      let progUrl = "http://localhost:5000/api/registrations-by-programme";
      if (filterYear !== "all") {
        progUrl += `?year=${filterYear}`;
      }
      const progRes = await axios.get(progUrl);
      setByProgramme(progRes.data);

      // Fetch registrations by academic year
      let yearUrl = "http://localhost:5000/api/registrations-by-year";
      if (filterProgramme !== "all") {
        yearUrl += `?programme=${filterProgramme}`;
      }
      const yearRes = await axios.get(yearUrl);
      setByYear(yearRes.data);

      // Fetch top schools
      const topSchoolsRes = await axios.get(
        "http://localhost:5000/api/top-schools"
      );
      setTopSchools(topSchoolsRes.data);

      // Extract available filter options from data
      const years = [...new Set(yearRes.data.map((d) => d.academic_year))];
      const programmes = [...new Set(progRes.data.map((d) => d.study_programme))];
      setAvailableYears(years);
      setAvailableProgrammes(programmes);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Styles
  const containerStyle = {
    maxWidth: 900,
    margin: "20px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const sectionStyle = {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 40,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  };

  const filterContainer = {
    display: "flex",
    justifyContent: "center",
    gap: 30,
    marginBottom: 40,
    flexWrap: "wrap",
  };

  const filterBlock = {
    minWidth: 180,
  };

  const labelStyle = {
    fontWeight: "600",
    display: "block",
    marginBottom: 6,
    color: "#444",
  };

  const selectStyle = {
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 6,
    border: "1.5px solid #ccc",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const totalRegistrationsStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    fontSize: 30,
    fontWeight: "700",
    padding: 25,
    borderRadius: 12,
    maxWidth: 320,
    margin: "0 auto 50px auto",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(76,175,80,0.4)",
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ ...headerStyle, fontSize: 28, fontWeight: "700" }}>
        Student Registration Dashboard
      </h1>

      {/* Filters */}
      <div style={filterContainer}>
        <div style={filterBlock}>
          <label htmlFor="year-filter" style={labelStyle}>
            Filter by Academic Year:
          </label>
          <select
            id="year-filter"
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div style={filterBlock}>
          <label htmlFor="programme-filter" style={labelStyle}>
            Filter by Programme:
          </label>
          <select
            id="programme-filter"
            value={filterProgramme}
            onChange={(e) => setFilterProgramme(e.target.value)}
            style={selectStyle}
          >
            <option value="all">All Programmes</option>
            {availableProgrammes.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Total Registrations */}
      <div style={totalRegistrationsStyle}>
        Total Registrations: {total}
      </div>

      {/* Registrations by Programme */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Registrations by Programme</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={byProgramme} margin={{ top: 10, bottom: 40 }}>
            <XAxis
              dataKey="study_programme"
              tick={{ fontSize: 13 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Bar dataKey="count" fill="#3f51b5" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Registrations by Academic Year */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Registrations by Academic Year</h2>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={byYear} margin={{ top: 10, bottom: 20 }}>
            <XAxis dataKey="academic_year" tick={{ fontSize: 14 }} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="count" stroke="#4caf50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Top 10 Secondary Schools */}
      <section style={sectionStyle}>
        <h2 style={headerStyle}>Top 10 Secondary Schools</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
                textAlign: "left",
                fontWeight: "600",
              }}
            >
              <th style={{ padding: "12px 18px" }}>Secondary School</th>
              <th style={{ padding: "12px 18px", width: 150 }}>Registrations</th>
            </tr>
          </thead>
          <tbody>
            {topSchools.map((school, idx) => (
              <tr
                key={idx}
                style={{
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "white",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={{ padding: "12px 18px" }}>{school.secondary_school}</td>
                <td style={{ padding: "12px 18px", fontWeight: "600" }}>
                  {school.count}
                </td>
              </tr>
            ))}
            {topSchools.length === 0 && (
              <tr>
                <td colSpan={2} style={{ textAlign: "center", padding: 20 }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default App;
