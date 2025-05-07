"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  FileText,
  MessageSquare,
  RefreshCw,
  HardDrive,
  Cpu,
  Memory,
  ShoppingCart,
  Check
} from "lucide-react";

const ClientDashboard = () => {
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  // const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [queryMessage, setQueryMessage] = useState("");
  const [queries, setQueries] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, transactionsRes, queriesRes, productsRes] = await Promise.all([
          fetch("/api/client/profile"),
          fetch("/api/client/transactions"),
          fetch("/api/client/queries"),
          fetch("/api/products") // Fetch all available products
        ]);

        setClientInfo(await profileRes.json());
        setTransactions(await transactionsRes.json());
        // setQueries(await queriesRes.json());
        
        const productsData = await productsRes.json();
        setProducts(productsData.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          description: product.description,
          icon: getProductIcon(product.name)
        })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductIcon = (productName: string) => {
    const lowerName = productName.toLowerCase();
    if (lowerName.includes("ram")) return <Memory size={24} />;
    if (lowerName.includes("hdd") || lowerName.includes("hard drive")) return <HardDrive size={24} />;
    if (lowerName.includes("motherboard") || lowerName.includes("component")) return <Cpu size={24} />;
    return <ShoppingBag size={24} />;
  };

  const addToCart = (product: any) => {
    if (product.stock <= 0) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId 
          ? { ...item, quantity: Math.min(newQuantity, products.find(p => p.id === productId)?.stock || 1) } 
          : item
      )
    );
  };

  const handlePurchase = async () => {
    try {
      const res = await fetch("/api/client/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (res.ok) {
        const newTransaction = await res.json();
        setTransactions([newTransaction, ...transactions]);
        setCart([]);
        setPurchaseSuccess(true);
        
        // Refresh product stock
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        setProducts(productsData.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          description: product.description,
          icon: getProductIcon(product.name)
        })));

        setTimeout(() => setPurchaseSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error making purchase:", error);
    }
  };

  const handleSubmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryMessage.trim()) return;

    try {
      const res = await fetch("/api/client/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryMessage })
      });

      if (res.ok) {
        const newQuery = await res.json();
        setQueries([newQuery, ...queries]);
        setQueryMessage("");
        alert("Your query has been submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-green-800 text-white p-4">
        <div className="flex items-center space-x-2 mb-8 p-2">
          <RefreshCw className="h-8 w-8" />
          <h1 className="text-xl font-bold">IWB Client Portal</h1>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "products" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Products & Services</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "transactions" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <FileText className="h-5 w-5" />
            <span>Transaction History</span>
          </button>

          <button
            onClick={() => setActiveTab("queries")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "queries" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Support Queries</span>
            {queries.filter(q => q.status === "pending").length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {queries.filter(q => q.status === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "profile" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <User className="h-5 w-5" />
            <span>My Profile</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Cart Floating Button */}
        <button 
          onClick={() => setShowCart(!showCart)}
          className="fixed right-6 top-6 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 z-10 flex items-center"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        {purchaseSuccess && (
          <div className="fixed right-6 top-20 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-20 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Purchase completed successfully!
          </div>
        )}

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed right-6 top-24 bg-white p-6 rounded-xl shadow-lg border border-gray-200 w-80 z-10">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Your Cart
            </h3>
            
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="border-b py-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">M{item.price} x {item.quantity}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 bg-gray-200 rounded-l"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 bg-gray-100">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 bg-gray-200 rounded-r"
                          disabled={item.quantity >= (products.find(p => p.id === item.id)?.stock || 0)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold mb-4">
                    <span>Total:</span>
                    <span>M{totalPrice.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={handlePurchase}
                    className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "products" && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Products</h2>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-green-100 p-4 flex justify-center">
                          <div className="bg-white p-3 rounded-full">
                            {product.icon}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-1 capitalize">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-1 capitalize">{product.category}</p>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <p className="font-bold text-green-600">M{product.price.toLocaleString()}</p>
                            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </p>
                          </div>
                          <button 
                            onClick={() => addToCart(product)}
                            className={`w-full py-2 text-white rounded transition ${
                              product.stock > 0 
                                ? 'bg-green-600 hover:bg-green-700' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            disabled={product.stock <= 0}
                          >
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">No products available at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Rest of the tabs (transactions, queries, profile) remain the same */}
            {/* ... */}
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;