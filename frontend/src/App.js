import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./App.css";
import TaglineSection from "./TaglineSection";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Logic to calculate the total inventory value (Price * Quantity)
  const totalInventoryValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (Number(p.price) * Number(p.quantity)), 0);
  }, [products]);

  // Auto-dismiss messages
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products/");
      setProducts(res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch inventory");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    const q = filter.trim().toLowerCase();
    if (q) {
      filtered = products.filter((p) =>
        String(p.id).includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (["id", "price", "quantity"].includes(sortField)) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [products, filter, sortField, sortDirection]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ id: "", name: "", description: "", price: "", quantity: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        ...form,
        id: Number(form.id),
        price: Number(form.price),
        quantity: Number(form.quantity),
      };
      if (editId) {
        await api.put(`/products/${editId}`, payload);
        setMessage("Stock updated successfully");
      } else {
        await api.post("/products/", payload);
        setMessage("New item registered successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Process failed");
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({ ...product });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this item from Nexus Stock?")) return;
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setMessage("Item removed successfully");
      fetchProducts();
    } catch (err) {
      setError("Deletion failed");
    }
    setLoading(false);
  };

  const currency = (n) => Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="app-bg">
      <header className="topbar">
        <div className="brand">
          <span className="brand-badge">💎</span>
          <h1>Nexus Stock</h1>
        </div>
        <div className="top-actions">
          <button className="btn btn-light" onClick={fetchProducts} disabled={loading}>
            Sync Database
          </button>
        </div>
      </header>

      <div className="container">
        {/* Pass the dynamic data to the Tagline section */}
        <TaglineSection totalProducts={products.length} />

        <div className="stats">
          <div className="chip">Active SKUs: {products.length}</div>
          <div className="chip">Asset Value: ${currency(totalInventoryValue)}</div>
          <div className="search">
            <input
              type="text"
              placeholder="Filter inventory..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="content-grid">
          <div className="card form-card">
            <h2>{editId ? "Modify Record" : "Register New Stock"}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <input type="number" name="id" placeholder="ID" value={form.id} onChange={handleChange} required disabled={!!editId} />
              <input type="text" name="name" placeholder="Item Name" value={form.name} onChange={handleChange} required />
              <input type="text" name="description" placeholder="Short Description" value={form.description} onChange={handleChange} required />
              <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required step="0.01" />
              <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
              <div className="form-actions">
                <button className="btn" type="submit" disabled={loading}>
                  {editId ? "Update Stock" : "Confirm Entry"}
                </button>
                {editId && (
                  <button className="btn btn-secondary" type="button" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {message && <div className="success-msg">{message}</div>}
            {error && <div className="error-msg">{error}</div>}
          </div>

          <div className="card list-card">
            <div className="scroll-x">
              <table className="product-table">
                <thead>
                  <tr>
                    <th className={`sortable ${sortField === 'id' ? `sort-${sortDirection}` : ''}`} onClick={() => handleSort('id')}>ID</th>
                    <th className={`sortable ${sortField === 'name' ? `sort-${sortDirection}` : ''}`} onClick={() => handleSort('name')}>Product</th>
                    <th>Description</th>
                    <th className={`sortable ${sortField === 'price' ? `sort-${sortDirection}` : ''}`} onClick={() => handleSort('price')}>Price</th>
                    <th className={`sortable ${sortField === 'quantity' ? `sort-${sortDirection}` : ''}`} onClick={() => handleSort('quantity')}>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td className="name-cell">{p.name}</td>
                      <td className="desc-cell" title={p.description}>{p.description}</td>
                      <td className="price-cell">${currency(p.price)}</td>
                      <td>
                        <span className={`qty-badge ${p.quantity < 5 ? 'low-stock' : ''}`}>{p.quantity}</span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button className="btn btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                          <button className="btn btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;