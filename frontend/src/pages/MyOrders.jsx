import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, Truck, CheckCircle2, XCircle, ReceiptText } from "lucide-react";
import { getMyOrders } from "../api";

const STATUS_STYLES = {
  pending: { icon: Clock, cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Pending" },
  confirmed: { icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Confirmed" },
  shipped: { icon: Truck, cls: "bg-blue-50 text-blue-700 border-blue-200", label: "Shipped" },
  delivered: { icon: Package, cls: "bg-green-50 text-green-700 border-green-200", label: "Delivered" },
  cancelled: { icon: XCircle, cls: "bg-rose-50 text-rose-700 border-rose-200", label: "Cancelled" },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      return;
    }
    getMyOrders()
      .then((data) => setOrders(data.orders || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-5 bg-emerald-50 rounded-full mb-5">
          <ReceiptText size={44} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
          Log in to see your orders
        </h2>
        <p className="text-gray-500 max-w-sm">
          Your order history is linked to your account. Please log in from the
          navigation bar to view it.
        </p>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Package className="text-emerald-600" size={30} />
          My Orders
        </h1>
        <p className="text-gray-500 mb-8">All orders placed with your account</p>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Your placed orders will appear here.</p>
            <Link to="/ourproducts">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300">
                Start Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {orders.map((order) => {
            const status = STATUS_STYLES[order.status] || STATUS_STYLES.confirmed;
            const StatusIcon = status.icon;
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Order header */}
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 px-4 sm:px-6 py-3.5 bg-gray-50/70 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 self-start xs:self-auto text-xs font-semibold px-3 py-1.5 rounded-full border ${status.cls}`}
                  >
                    <StatusIcon size={13} />
                    {status.label}
                  </span>
                </div>

                {/* Items */}
                <div className="px-4 sm:px-6 py-4 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{item.price}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 px-4 sm:px-6 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    UTR: <span className="font-mono">{order.utrNumber}</span>
                    {order.shippingAddress && (
                      <span className="block xs:inline xs:ml-3 truncate">
                        Ship to: {order.shippingAddress}
                      </span>
                    )}
                  </p>
                  <p className="font-bold text-emerald-600">
                    ₹{Number(order.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
