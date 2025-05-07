"use client";
import React, { useState, useEffect } from "react";
import { ShoppingBag, PlusCircle, ListOrdered, MessageSquare, Search, Edit, Trash2, RefreshCw } from "lucide-react";

const SalesDashboard = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    products: true,
    orders: true,
    queries: true
  });
  const [activeTab, setActiveTab] = useState("products");
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "RAM",
    price: 0,
    stock: 0,
    description: ""
  });

  // Fetch all sales-related data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, queriesRes] = await Promise.all([
          fetch("/api/sales/products"),
          fetch("/api/sales/orders"),
          fetch("/api/sales/queries")
        ]);

        setProducts(await productsRes.json());
        setOrders(await ordersRes.json());
        setQueries(await queriesRes.json());
        setLoading({ products: false, orders: false, queries: false });
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setLoading({ products: false, orders: false, queries: false });
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/sales/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });

      if (res.ok) {
        const addedProduct = await res.json();
        setProducts([...products, addedProduct]);
        setShowProductModal(false);
        setNewProduct({
          name: "",
          category: "RAM",
          price: 0,
          stock: 0,
          description: ""
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/sales/products/${productId}`, {
          method: "DELETE"
        });

        if (res.ok) {
          setProducts(products.filter(p => p._id !== productId));
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-green-800 text-white p-4">
        <div className="flex items-center space-x-2 mb-8 p-2">
          <ShoppingBag className="h-8 w-8" />
          <h1 className="text-xl font-bold">IWB Sales Portal</h1>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "products" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Products</span>
          </button>
          
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "orders" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <ListOrdered className="h-5 w-5" />
            <span>Orders</span>
          </button>
          
          <button
            onClick={() => setActiveTab("queries")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "queries" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Customer Queries</span>
            {queries.filter(q => q.status === "pending").length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {queries.filter(q => q.status === "pending").length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {activeTab === "products" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
              <button
                onClick={() => setShowProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <PlusCircle size={18} /> Add Product
              </button>
            </div>

            {loading.products ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (M)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
  {products.map((product) => (
    <tr key={product._id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
        {product.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {(product.price ?? 0).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.stock}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 mr-3">
          <Edit className="h-4 w-4 inline mr-1" /> Edit
        </button>
        <button 
          onClick={() => handleDeleteProduct(product._id)}
          className="text-red-600 hover:text-red-900"
        >
          <Trash2 className="h-4 w-4 inline mr-1" /> Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">No products found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Orders</h2>
            
            {loading.orders ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (M)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.items.map((item: any) => (
                            <div key={item.productId} className="mb-1 last:mb-0">
                              {item.quantity}x {item.productName}
                            </div>
                          ))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <ListOrdered className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">No orders found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "queries" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Queries</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search queries..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {loading.queries ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : queries.length > 0 ? (
              <div className="space-y-4">
                {queries.map((query) => (
                  <div key={query._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{query.customerName}</p>
                        <p className="text-sm text-gray-500">{query.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        query.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {query.status}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-gray-700">{query.message}</p>
                    </div>
                    <div className="mt-3 flex justify-end space-x-2">
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                        Mark as Resolved
                      </button>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                        Respond
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">No queries found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required
                >
                  <option value="RAM">RAM</option>
                  <option value="Hard Drive">Hard Drive</option>
                  <option value="Motherboard Component">Motherboard Component</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (M)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;