// src/pages/Tenants.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

// ✅ Reusable Tenant Card Component
function TenantCard({ tenant, onDelete }) {
  // Calculate totalPaid from payments if available
  const totalPaid = tenant.payments
    ? tenant.payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    : 0;

  return (
    <div className="flex justify-between items-center border rounded p-4 mb-3 bg-white shadow-sm dark:bg-gray-900">
      <div>
        <h4 className="font-semibold">{tenant.name}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">{tenant.contact}</p>
        <p className="text-sm mt-1">
          Paid: <span className="text-green-600">₹{totalPaid.toFixed(2)}</span>
        </p>
      </div>
      <div>
        <button
          className="text-red-600 underline hover:cursor-pointer"
          onClick={() => onDelete(tenant._id)}
        >
          <b>Delete</b>
        </button>
      </div>
    </div>
  );
}

// ✅ Tenant Form Component
function TenantForm({ properties, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    propertyId: properties.length > 0 ? properties[0]._id : "",
    rentDueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.contact || !form.propertyId || !form.rentDueDate) {
      alert("Please fill all fields");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      contact: form.contact.trim(),
      propertyId: form.propertyId,
      rentDueDate: form.rentDueDate,
      payments: [],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow max-w-md mx-auto dark:bg-gray-900 mb-6"
    >
      <h2 className="text-2xl font-semibold mb-4">Add Tenant</h2>

      <label className="block mb-2 font-medium" htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full mb-4"
        required
      />

      <label className="block mb-2 font-medium" htmlFor="contact">Contact</label>
      <input
        id="contact"
        name="contact"
        value={form.contact}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full mb-4"
        required
      />

      <label className="block mb-2 font-medium" htmlFor="propertyId">Property</label>
      <select
        id="propertyId"
        name="propertyId"
        value={form.propertyId}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full mb-4"
        required
      >
        {properties.map((p) => (
          <option key={p._id} value={p._id} className="dark:bg-gray-800">
            {p.name} ({p.type})
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium" htmlFor="rentDueDate">Rent Due Date</label>
      <input
        type="date"
        id="rentDueDate"
        name="rentDueDate"
        value={form.rentDueDate}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full mb-6"
        required
      />

      <div className="flex justify-end gap-3">
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
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={submitting}
        >
          {submitting ? "Adding..." : "Add Tenant"}
        </button>
      </div>
    </form>
  );
}

// ✅ Main Tenants Page
export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Group tenants by property._id
  const grouped = tenants.reduce((acc, tenant) => {
    const pid = tenant.property?._id || "Unknown";
    if (!acc[pid]) acc[pid] = { property: tenant.property, tenants: [] };
    acc[pid].tenants.push(tenant);
    return acc;
  }, {});

  useEffect(() => {
    async function fetchData() {
      try {
        setError(null);
        setLoading(true);
        const [tenantsRes, propertiesRes] = await Promise.all([
          API.get("/api/tenants"),
          API.get("/api/properties"),
        ]);
        setTenants(tenantsRes.data);
        setProperties(propertiesRes.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Add Tenant
  const handleAddTenant = async (data) => {
    try {
      setSubmitting(true);
      await API.post("/api/tenants", data);
      const tenantsRes = await API.get("/api/tenants");
      setTenants(tenantsRes.data);
      setShowForm(false);
    } catch {
      alert("Failed to add tenant");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Tenant
  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;

    try {
      const response = await API.delete(`/api/tenants/${tenantId}`);
      if (response) {
        alert("Tenant deleted successfully!");
        setTenants((prev) => prev.filter((t) => t._id !== tenantId));
      } else {
        alert("Failed to delete tenant");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting tenant");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Tenants</h1>

      {!showForm && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading || properties.length === 0}
          >
            Add Tenant
          </button>
        </div>
      )}

      {showForm && (
        <TenantForm
          properties={properties}
          onSubmit={handleAddTenant}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}

      {loading && <p className="text-center py-10 font-semibold">Loading tenants...</p>}
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {!loading && !error && (
        Object.keys(grouped).length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">No tenants found.</p>
        ) : (
          Object.values(grouped).map((group) => (
            <section key={group.property?._id || "unknown"} className="mb-10">
              <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-cyan-400">
                {group.property?.name || "Unknown Property"}
              </h2>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                {group.property?.address || ""}
              </p>

              <div>
                {group.tenants.map((tenant) => (
                  <TenantCard
                    tenant={tenant}
                    key={tenant._id}
                    onDelete={handleDeleteTenant}
                  />
                ))}
              </div>
            </section>
          ))
        )
      )}
    </div>
  );
}
