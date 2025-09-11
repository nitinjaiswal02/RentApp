import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    properties: 0,
    tenants: 0,
    payments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        setError(null);
        setLoading(true);

        const [propsRes, tenantsRes, paymentsRes] = await Promise.all([
          API.get("/api/properties"),
          API.get("/api/tenants"),
          API.get("/api/payments"),
        ]);

        setCounts({
          properties: propsRes.data.length,
          tenants: tenantsRes.data.length,
          payments: paymentsRes.data.length,
        });
      } catch (err) {
        console.error("Dashboard error", err);
        setError("Error loading dashboard stats");
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  if (loading)
    return (
      <p className="text-center py-10 font-semibold">Loading dashboard...</p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 py-10 font-semibold">{error}</p>
    );

  const cardClass =
    "bg-white shadow rounded p-6 flex flex-col justify-between dark:bg-gray-900";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={cardClass}>
          <div>
            <h2 className="text-4xl font-extrabold text-blue-600">
              {counts.properties}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Properties</p>
          </div>
          <Link
            to="/properties"
            className="mt-4 text-blue-600 hover:underline self-start font-semibold"
          >
            View Properties &rarr;
          </Link>
        </div>
        <div className={cardClass}>
          <div>
            <h2 className="text-4xl font-extrabold text-green-600">
              {counts.tenants}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Tenants</p>
          </div>
          <Link
            to="/tenants"
            className="mt-4 text-green-600 hover:underline self-start font-semibold"
          >
            View Tenants &rarr;
          </Link>
        </div>
        <div className={cardClass}>
          <div>
            <h2 className="text-4xl font-extrabold text-purple-600">
              {counts.payments}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ">Payments</p>
          </div>
          <Link
            to="/payments"
            className="mt-4 text-purple-600 hover:underline self-start font-semibold"
          >
            View Payments &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}