import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Users, IndianRupee,
  Plus, Pencil, Trash2, X, Loader2, ShieldAlert, RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getAdminStats, getAllOrders, updateOrderStatus,
  getProducts, createProduct, updateProduct, deleteProduct,
} from "../api";
import { useCatalog } from "../context/CatalogContext";

const CATEGORIES = ["Normal Skin", "Dry Skin", "Oily Skin", "Combination Skin", "Sensitive Skin"];
const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-rose-100 text-rose-700",
};

const emptyForm = {
  name: "", description: "", priceNum: "", image: "",
  category: "Normal Skin", rating: 4.0, noOfRating: 0,
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const AdminPanel = () => {
  const { refreshCatalog } = useCatalog();
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [modal, setModal] = useState(null); // null | {mode:'add'} | {mode:'edit', product}
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData") || "null");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminStats();
      setStats(data);
      setDenied(false);
    } catch (err) {
      if (/admin|denied|token/i.test(err.message)) setDenied(true);
      else toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProductList(data.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const data = await getAllOrders();
      setOrders(data.orders || []);
    } catch (err) {
      toast.error(err.message);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => {
    if (tab === "products") loadProducts();
    if (tab === "orders") loadOrders();
  }, [tab, loadProducts, loadOrders]);

  // ---------- product form ----------
  const openAdd = () => { setForm(emptyForm); setModal({ mode: "add" }); };
  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description,
      priceNum: String(p.price).replace(/[^0-9.]/g, ""),
      image: p.image, category: p.category,
      rating: p.rating, noOfRating: p.noOfRating,
    });
    setModal({ mode: "edit", product: p });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: `₹${Number(form.priceNum)}`,
      image: form.image.trim(),
      category: form.category,
      rating: Number(form.rating),
      noOfRating: Number(form.noOfRating),
    };
    try {
      if (modal.mode === "add") {
        await createProduct(payload);
        toast.success("Product added");
      } else {
        await updateProduct(modal.product.id, payload);
        toast.success("Product updated");
      }
      setModal(null);
      await Promise.all([loadProducts(), refreshCatalog(), loadDashboard()]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (p) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(p.id);
      toast.success("Product deleted");
      await Promise.all([loadProducts(), refreshCatalog(), loadDashboard()]);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const changeStatus = async (order, status) => {
    try {
      await updateOrderStatus(order._id, status);
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status } : o)));
      toast.success(`Order marked ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ---------- gates ----------
  if (!userData || denied) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-5 bg-rose-50 rounded-full mb-5">
          <ShieldAlert size={44} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Admin access required</h2>
        <p className="text-gray-500 max-w-sm">
          Please log in with an administrator account to open this panel.
        </p>
      </div>
    );
  }

  const TABS = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "products", label: "Products", icon: Package },
    { key: "orders", label: "Orders", icon: ShoppingBag },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage products, orders and store performance</p>
          </div>
          <button
            onClick={() => { loadDashboard(); if (tab === "products") loadProducts(); if (tab === "orders") loadOrders(); }}
            className="self-start sm:self-auto inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 border border-gray-200 hover:border-emerald-300 bg-white rounded-lg px-3 py-2 transition-colors"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                tab === key
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {loading && tab === "dashboard" ? (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* ---------- DASHBOARD ---------- */}
            {tab === "dashboard" && stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: "Total Revenue", value: `₹${Number(stats.totalRevenue).toFixed(2)}`, icon: IndianRupee, color: "from-emerald-500 to-teal-500" },
                    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag, color: "from-blue-500 to-indigo-500" },
                    { label: "Products", value: stats.totalProducts, icon: Package, color: "from-pink-500 to-rose-500" },
                    { label: "Users", value: stats.totalUsers, icon: Users, color: "from-amber-500 to-orange-500" },
                  ].map((c) => (
                    <div key={c.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 shadow`}>
                        <c.icon size={18} className="text-white" />
                      </div>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 break-all">{c.value}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{c.label}</p>
                    </div>
                  ))}
                </div>

                {/* Orders by status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-800 mb-3">Orders by status</h3>
                  <div className="flex flex-wrap gap-2">
                    {STATUSES.map((s) => (
                      <span key={s} className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_COLORS[s]}`}>
                        {s}: {stats.ordersByStatus?.[s] || 0}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <h3 className="font-semibold text-gray-800 px-5 pt-5 pb-3">Recent orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-y border-gray-100 bg-gray-50/60">
                          <th className="px-5 py-2.5 font-medium">Order</th>
                          <th className="px-5 py-2.5 font-medium">Customer</th>
                          <th className="px-5 py-2.5 font-medium">Date</th>
                          <th className="px-5 py-2.5 font-medium">Total</th>
                          <th className="px-5 py-2.5 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((o) => (
                          <tr key={o._id} className="border-b border-gray-50 last:border-0">
                            <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">{o.orderNumber}</td>
                            <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{o.user?.name || "—"}</td>
                            <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{formatDate(o.createdAt)}</td>
                            <td className="px-5 py-3 font-semibold text-emerald-600 whitespace-nowrap">₹{Number(o.totalAmount).toFixed(2)}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                            </td>
                          </tr>
                        ))}
                        {stats.recentOrders.length === 0 && (
                          <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No orders yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ---------- PRODUCTS ---------- */}
            {tab === "products" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <h3 className="font-semibold text-gray-800">{productList.length} products</h3>
                  <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow shadow-emerald-500/25 transition-all"
                  >
                    <Plus size={15} /> Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-y border-gray-100 bg-gray-50/60">
                        <th className="px-5 py-2.5 font-medium">Product</th>
                        <th className="px-5 py-2.5 font-medium">Category</th>
                        <th className="px-5 py-2.5 font-medium">Price</th>
                        <th className="px-5 py-2.5 font-medium">Rating</th>
                        <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((p) => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <span className="font-medium text-gray-800">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{p.category}</td>
                          <td className="px-5 py-3 font-semibold text-emerald-600 whitespace-nowrap">{p.price}</td>
                          <td className="px-5 py-3 text-gray-600 whitespace-nowrap">★ {p.rating} ({p.noOfRating})</td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-1.5">
                              <button onClick={() => openEdit(p)} aria-label="Edit"
                                className="p-2 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                                <Pencil size={15} />
                              </button>
                              <button onClick={() => removeProduct(p)} aria-label="Delete"
                                className="p-2 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {productList.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">No products — add your first one</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ---------- ORDERS ---------- */}
            {tab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="font-semibold text-gray-800 px-5 pt-5 pb-3">{orders.length} orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-y border-gray-100 bg-gray-50/60">
                        <th className="px-5 py-2.5 font-medium">Order</th>
                        <th className="px-5 py-2.5 font-medium">Customer</th>
                        <th className="px-5 py-2.5 font-medium">Items</th>
                        <th className="px-5 py-2.5 font-medium">UTR</th>
                        <th className="px-5 py-2.5 font-medium">Total</th>
                        <th className="px-5 py-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 align-top">
                          <td className="px-5 py-3 whitespace-nowrap">
                            <p className="font-medium text-gray-800">{o.orderNumber}</p>
                            <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                          </td>
                          <td className="px-5 py-3 whitespace-nowrap">
                            <p className="text-gray-700">{o.user?.name || "—"}</p>
                            <p className="text-xs text-gray-400">{o.user?.email}</p>
                          </td>
                          <td className="px-5 py-3 text-gray-600 min-w-[160px]">
                            {o.items.map((it, i) => (
                              <p key={i} className="text-xs">{it.name} × {it.quantity}</p>
                            ))}
                          </td>
                          <td className="px-5 py-3 text-xs font-mono text-gray-500 whitespace-nowrap">{o.utrNumber}</td>
                          <td className="px-5 py-3 font-semibold text-emerald-600 whitespace-nowrap">₹{Number(o.totalAmount).toFixed(2)}</td>
                          <td className="px-5 py-3">
                            <select
                              value={o.status}
                              onChange={(e) => changeStatus(o, e.target.value)}
                              className={`text-xs font-semibold rounded-lg px-2 py-1.5 border-0 capitalize cursor-pointer focus:ring-2 focus:ring-emerald-400 ${STATUS_COLORS[o.status]}`}
                            >
                              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- ADD / EDIT PRODUCT MODAL ---------- */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-gray-900">
                {modal.mode === "add" ? "Add Product" : `Edit: ${modal.product.name}`}
              </h3>
              <button onClick={() => setModal(null)} aria-label="Close"
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white"
                  placeholder="e.g. Hydrating Cleanser" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required rows={2} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white resize-none"
                  placeholder="Short product description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input required type="number" min="1" step="1" value={form.priceNum}
                    onChange={(e) => setForm({ ...form, priceNum: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white"
                    placeholder="399" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input required type="url" value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white"
                  placeholder="https://…" />
                {form.image && (
                  <img src={form.image} alt="preview"
                    className="mt-2 w-16 h-16 rounded-lg object-cover border border-gray-200"
                    onError={(e) => (e.target.style.display = "none")} />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0–5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. of Ratings</label>
                  <input type="number" min="0" value={form.noOfRating}
                    onChange={(e) => setForm({ ...form, noOfRating: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-gray-50 focus:bg-white" />
                </div>
              </div>

              <button type="submit" disabled={saving}
                className="w-full flex justify-center items-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 text-sm">
                {saving ? (<><Loader2 className="animate-spin h-4 w-4 mr-2" /> Saving…</>) :
                  (modal.mode === "add" ? "Add Product" : "Save Changes")}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
