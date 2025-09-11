import React, { useEffect, useState } from "react";
import API from "../api";

function PaymentForm({ properties, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    tenantId: "",
    propertyId: "",
    amountPaid: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (form.propertyId) {
      async function fetchTenants() {
        setLoadingTenants(true);
        setError(null);

        try {
          const res = await API.get("/api/tenants");
          const filtered = res.data.filter(
            (t) => t.property?._id === form.propertyId
          );
          setTenants(filtered);
          if (filtered.length > 0)
            setForm((f) => ({ ...f, tenantId: filtered[0]._id }));
          else setForm((f) => ({ ...f, tenantId: "" }));
        } catch {
          setError("Failed to load tenants for selected property");
          setTenants([]);
        } finally {
          setLoadingTenants(false);
        }
      }
      fetchTenants();
    } else {
      setTenants([]);
      setForm((f) => ({ ...f, tenantId: "" }));
    }
  }, [form.propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.propertyId || !form.tenantId || !form.amountPaid || !form.date) {
      setError("Please fill all fields");
      return;
    }
    if (isNaN(form.amountPaid) || form.amountPaid <= 0) {
      setError("Amount must be a positive number");
      return;
    }
    onSubmit({
      tenantId: form.tenantId,
      amountPaid: parseFloat(form.amountPaid),
      date: form.date,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow max-w-md mx-auto dark:bg-gray-900 w-full"
    >
      <h2 className="text-2xl font-semibold mb-4">Add Payment</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium" htmlFor="propertyId">
            Property
          </label>
          <select
            id="propertyId"
            name="propertyId"
            onChange={handleChange}
            value={form.propertyId}
            className="border rounded px-3 py-2 w-full mb-4"
            required
          >
            <option value="">-- Select Property --</option>
            {properties.map((p) => (
              <option className="dark:bg-gray-800" key={p._id} value={p._id}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="tenantId">
            Tenant
          </label>
          {loadingTenants ? (
            <p className="mb-4">Loading tenants...</p>
          ) : (
            <select
              id="tenantId"
              name="tenantId"
              onChange={handleChange}
              value={form.tenantId}
              className="border rounded px-3 py-2 w-full mb-4"
              required
              disabled={tenants.length === 0}
            >
              <option value="">-- Select Tenant --</option>
              {tenants.map((t) => (
                <option className="dark:bg-gray-800" key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 font-medium" htmlFor="amountPaid">
            Amount
          </label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            step="0.01"
            min="0.01"
            value={form.amountPaid}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full mb-4"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium" htmlFor="date">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full mb-6"
            required
          />
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Add Payment"}
        </button>
      </div>
    </form>
  );
}

export default function Payments() {
  const [properties, setProperties] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const res = await API.get("/api/properties");
        setProperties(res.data);
      } catch {
        alert("Failed to load properties");
      }
    }
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!selectedTenantId) {
      setPayments([]);
      return;
    }
    async function fetchTenantPayments() {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get(`/api/payments/${selectedTenantId}`);
        setPayments(res.data.payments);
      } catch {
        setError("Failed to load payments");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTenantPayments();
  }, [selectedTenantId]);

  const [allTenants, setAllTenants] = useState([]);
  useEffect(() => {
    async function fetchTenants() {
      try {
        const res = await API.get("/api/tenants");
        setAllTenants(res.data);
      } catch {}
    }
    fetchTenants();
  }, []);

  const handleAddPayment = async (data) => {
    try {
      setSubmitting(true);
      await API.post("/api/payments", data);
      setShowForm(false);
      setSelectedTenantId(data.tenantId); // Refresh payments list
    } catch {
      alert("Failed to add payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>

      {!showForm && (
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 w-full md:w-auto"
            >
              Add Payment
            </button>
          </div>

          <div className="w-full md:w-auto">
            <label htmlFor="tenantSelect" className="mr-2 font-medium">
              Select Tenant:
            </label>
            <select
              id="tenantSelect"
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="border rounded px-3 py-2 w-full md:w-auto"
            >
              <option className="dark:bg-gray-900" value="">
                -- Select Tenant --
              </option>
              {allTenants.map((t) => (
                <option
                  className="dark:bg-gray-900"
                  key={t._id}
                  value={t._id}
                >
                  {t.name} (Property: {t.property?.name || "Unknown"})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {showForm && (
        <PaymentForm
          properties={properties}
          onSubmit={handleAddPayment}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}

      {loading && (
        <p className="text-center py-10 font-semibold">Loading payments...</p>
      )}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {!loading && payments.length > 0 && (
        <div className="mt-6 bg-white p-4 sm:p-6 rounded shadow max-w-3xl mx-auto dark:bg-gray-900">
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded text-sm sm:text-base">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left border-b">Amount</th>
                  <th className="p-3 text-left border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-3 border-b">₹{p.amountPaid.toFixed(2)}</td>
                    <td className="p-3 border-b">
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && selectedTenantId && payments.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No payments found for selected tenant
        </p>
      )}
    </div>
  );
}
