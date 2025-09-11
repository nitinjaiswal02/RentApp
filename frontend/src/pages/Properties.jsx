// src/pages/Properties.jsx
import React, { useEffect, useState } from "react";
import API from "../api";

const propertyTypes = ["Apartment", "Duplex", "Condo", "House", "Studio"];

function PropertyForm({ onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    rentAmount: initialData?.rentAmount || "",
    type: initialData?.type || propertyTypes[0],
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.rentAmount || !form.type) {
      setError("Please fill all fields");
      return;
    }
    if (isNaN(form.rentAmount) || form.rentAmount <= 0) {
      setError("Rent amount must be a positive number");
      return;
    }
    onSubmit({
      name: form.name.trim(),
      address: form.address.trim(),
      rentAmount: form.rentAmount,
      type: form.type,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-lg p-6 w-full max-w-md dark:bg-gray-800"
      >
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Property" : "Add New Property"}
        </h2>

        {/* Name */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        {/* Rent */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="rentAmount">Rent Amount</label>
          <input
            id="rentAmount"
            type="number"
            name="rentAmount"
            min="1"
            value={form.rentAmount}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        {/* Type */}
        <div className="mb-3">
          <label className="block font-medium mb-1" htmlFor="type">Property Type</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          >
            {propertyTypes.map((t) => (
              <option className="dark:bg-gray-800" key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {initialData ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/properties");
      setProperties(res.data);
      setError(null);
    } catch {
      setError("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = filterType
    ? properties.filter((p) => p.type === filterType)
    : properties;

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      if (formData) {
        await API.patch(`/api/properties/${formData._id}`, data);
      } else {
        await API.post("/api/properties", data);
      }
      setShowForm(false);
      setFormData(null);
      await fetchProperties();
    } catch {
      setError("Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      setDeletingId(id);
      await API.delete(`/api/properties/${id}`);
      await fetchProperties();
    } catch {
      alert("Failed to delete property");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Properties</h1>

      {/* Filter + Add */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option className="dark:bg-gray-800" value="">All Types</option>
            {propertyTypes.map((t) => (
              <option className="dark:bg-gray-800" key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setFormData(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Property
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-center py-10 font-semibold">Loading properties...</p>
      ) : (
        <>
          {/* ✅ Table for medium+ screens */}
          <div className="hidden sm:block overflow-x-auto border rounded-lg">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-100 dark:bg-gray-600">
                <tr>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Address</th>
                  <th className="p-3 border-b">Rent</th>
                  <th className="p-3 border-b">Type</th>
                  <th className="p-3 border-b text-center">Tenants</th>
                  <th className="p-3 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-600">
                      No properties found.
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3 border-b">{p.name}</td>
                      <td className="p-3 border-b">{p.address}</td>
                      <td className="p-3 border-b">₹{p.rentAmount.toFixed(2)}</td>
                      <td className="p-3 border-b">{p.type}</td>
                      <td className="p-3 border-b text-center">{p.tenants?.length || 0}</td>
                      <td className="p-3 border-b text-center space-x-2">
                        <button
                          onClick={() => { setFormData(p); setShowForm(true); }}
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          disabled={deletingId === p._id}
                          className="text-red-600 hover:underline font-semibold"
                        >
                          {deletingId === p._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ✅ Card view for mobile */}
          <div className="sm:hidden space-y-4">
            {filteredProperties.length === 0 ? (
              <p className="text-gray-600 text-center">No properties found.</p>
            ) : (
              filteredProperties.map((p) => (
                <div key={p._id} className="p-4 border rounded-lg shadow-sm dark:bg-gray-800">
                  <h3 className="font-semibold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{p.address}</p>
                  <p className="mt-1">Rent: ₹{p.rentAmount.toFixed(2)}</p>
                  <p>Type: {p.type}</p>
                  <p>Tenants: {p.tenants?.length || 0}</p>
                  <div className="flex justify-end gap-4 mt-3">
                    <button
                      onClick={() => { setFormData(p); setShowForm(true); }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deletingId === p._id}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      {deletingId === p._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showForm && (
        <PropertyForm
          initialData={formData}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setFormData(null); }}
        />
      )}
    </div>
  );
}
