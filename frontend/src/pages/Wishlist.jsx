import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/ProductContext";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addProduct, products } = useCart();

  const moveToCart = (product) => {
    addProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      quantity: 1,
    });
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to cart`);
  };

  const isInCart = (id) => products.some((p) => p.id === id);

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="p-5 bg-rose-50 rounded-full mb-5">
          <Heart size={44} className="text-rose-400" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 mb-6 max-w-sm">
          Tap the heart on any product to save it here for later.
        </p>
        <Link to="/ourproducts">
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-7 py-3 rounded-full shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-[1.03]">
            Explore Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Heart className="text-rose-500 fill-rose-500" size={30} />
          My Wishlist
        </h1>
        <p className="text-gray-500 mb-8">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              <Link to={`/product/${product.id}`} className="block aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">
                  {product.description}
                </p>
                <p className="text-lg font-bold text-emerald-600 mt-2">{product.price}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => moveToCart(product)}
                    disabled={isInCart(product.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
                  >
                    <ShoppingCart size={15} />
                    {isInCart(product.id) ? "In Cart" : "Move to Cart"}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    className="p-2.5 border border-gray-200 rounded-lg text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
