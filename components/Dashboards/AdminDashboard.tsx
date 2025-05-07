"use client";
import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, Lock, Database, Shield, BarChart2, Mail, 
  Settings, LogOut, AlertCircle, CheckCircle, Search, ChevronDown, 
  ChevronUp, MessageSquare, Check, X, RefreshCw 
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [activeTab, setActiveTab] = useState("users");
  const [systemStats, setSystemStats] = useState({
    products: 0,
    sales: 0,
    queries: 0,
    backups: 0
  });
  const [products, setProducts] = useState<any[]>([]);
//   const [recentActivities, setRecentActivities] = useState<any[]>([]);
//   const [allQueries, setAllQueries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [allQueries, setAllQueries] = useState<QueryType[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityType[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, statsRes, activitiesRes, queriesRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/stats"),
          fetch("/api/admin/activities"),
          fetch("/api/admin/queries") // Fetch all queries now
        ]);

        setUsers(await usersRes.json());
        setSystemStats(await statsRes.json());
        setRecentActivities(await activitiesRes.json());
        setAllQueries(await queriesRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        form.reset();
        setShowUserModal(false);
        const newUser = await res.json();
        setUsers([...users, newUser]);
      } else {
        alert("Error adding user.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEnforceMFA = async () => {
    if (confirm("Are you sure you want to enforce MFA for all users?")) {
      try {
        const res = await fetch("/api/admin/enforce-mfa", { method: "POST" });
        if (res.ok) {
          alert("MFA enforcement initiated successfully");
        } else {
          alert("Error enforcing MFA");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleBackup = async (backupType: string) => {
    try {
      const res = await fetch(`/api/admin/backup?type=${backupType}`, {
        method: "POST"
      });
      if (res.ok) {
        alert(`${backupType} backup completed successfully`);
        const stats = await fetch("/api/admin/stats").then(res => res.json());
        setSystemStats(stats);
      } else {
        alert(`Error creating ${backupType} backup`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowBackupModal(false);
    }
  };

  const handleResolveQuery = async (queryId: string) => {
    try {
      const res = await fetch(`/api/admin/queries`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryId, status: "pending" }) // You may include reply if needed
      });
  
      if (res.ok) {
        const { query: updated } = await res.json();
        setAllQueries(prev =>
          prev.map(q => (q._id === updated._id ? updated : q))
        );
        setExpandedQuery(null);
        setReplyMessage("");
      }
    } catch (error) {
      console.error("Error resolving query:", error);
    }
  };
  

//   const filteredQueries = Array.isArray(allQueries)
//   ? allQueries.filter(query => 
//       query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       query.clientName.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   : [];

// useEffect(() => {
//   const fetchQueries = async () => {
//     try {
//       const res = await fetch("/api/admin/queries");
//       const data = await res.json();

//       // ✅ Correctly extract the array
//       setAllQueries(data.queries || []);
//     } catch (error) {
//       console.error("Failed to fetch queries:", error);
//       setAllQueries([]); // fallback to empty
//     }
//   };

//   fetchQueries();
// }, []);

useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/products");
  
        if (!res.ok) {
          console.error("Failed to fetch products:", res.status);
          return; // Prevent .json() on invalid response
        }
  
        const data = await res.json();
        setProducts(data.products || []); // adjust this to match your API response structure
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/admin/activities");
        const data = await res.json();
  
        // Ensure data is an array or extract from a key
        const activities = Array.isArray(data) ? data : data.activities;
  
        setRecentActivities(activities || []);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setRecentActivities([]); // fallback
      }
    };
  
    fetchActivities();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-green-800 text-white p-4">
        <div className="flex items-center space-x-2 mb-8 p-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-xl font-bold">IWB Admin</h1>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "dashboard" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "users" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </button>
          
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "products" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <Database className="h-5 w-5" />
            <span>Products & Services</span>
          </button>
          
          <button
            onClick={() => setActiveTab("finance")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "finance" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Financial Reports</span>
          </button>
          
          <button
            onClick={() => setActiveTab("queries")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "queries" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <Mail className="h-5 w-5" />
            <span>Customer Queries</span>
            {Array.isArray(allQueries) && allQueries.filter(q => q.status === "pending").length > 0 && (
  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
    {allQueries.filter(q => q.status === "pending").length}
  </span>
)}

          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === "settings" ? "bg-green-700" : "hover:bg-green-700"}`}
          >
            <Settings className="h-5 w-5" />
            <span>System Settings</span>
          </button>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <button className="flex items-center space-x-2 w-full p-3 rounded-lg hover:bg-green-700">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">System Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Total Users</h3>
                  <Users className="text-green-600" />
                </div>
                <p className="text-3xl font-bold mt-2">{users.length}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Products/Services</h3>
                  <Database className="text-green-600" />
                </div>
                <p className="text-3xl font-bold mt-2">{systemStats.products}</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Pending Queries</h3>
                  <AlertCircle className="text-red-600" />
                </div>
                <p className="text-3xl font-bold mt-2">
  {Array.isArray(allQueries) ? allQueries.filter(q => q.status === "pending").length : 0}
</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500">Backups</h3>
                  <CheckCircle className="text-green-600" />
                </div>
                <p className="text-3xl font-bold mt-2">{systemStats.backups}</p>
              </div>
            </div>
            
            {/* Recent Activities */}
<div className="bg-white p-6 rounded-lg shadow mb-6">
  <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
  <div className="space-y-4">


  {Array.isArray(recentActivities) && recentActivities.map((activity) => (
  <div key={activity._id} className="border-b pb-3 last:border-0">
    <p className="font-medium">{activity.action}</p>
    <p className="text-sm text-gray-500">{activity.timestamp} by {activity.user}</p>
  </div>
))}


  </div>
</div>

            
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setShowBackupModal(true)}
                className="bg-white p-6 rounded-lg shadow flex items-center justify-center flex-col hover:bg-gray-50"
              >
                <Database className="h-8 w-8 text-green-600 mb-2" />
                <span>Create Backup</span>
              </button>
              
              <button 
                onClick={handleEnforceMFA}
                className="bg-white p-6 rounded-lg shadow flex items-center justify-center flex-col hover:bg-gray-50"
              >
                <Lock className="h-8 w-8 text-green-600 mb-2" />
                <span>Enforce MFA</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("settings")}
                className="bg-white p-6 rounded-lg shadow flex items-center justify-center flex-col hover:bg-gray-50"
              >
                <Settings className="h-8 w-8 text-green-600 mb-2" />
                <span>System Settings</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <button
                onClick={() => setShowUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <UserPlus size={18} /> Add User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'sales' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'finance' ? 'bg-green-100 text-green-800' :
                          user.role === 'developer' ? 'bg-yellow-100 text-yellow-800' :
                          user.role === 'investor' ? 'bg-indigo-100 text-indigo-800' :
                          user.role === 'partner' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Products & Services Management</h2>
            {/* Products content would go here */}
            {products.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Product Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Stock
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr key={product._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {product.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-gray-500 mt-4">No products available.</p>
)}

          </div>
        )}

        {activeTab === "finance" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Reports</h2>
            {/* Finance content would go here */}
            <p>Financial reporting interface coming soon</p>
          </div>
        )}

        {activeTab === "queries" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customer Queries</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search queries..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="space-y-4">
              {filteredQueries.length > 0 ? (
                filteredQueries.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
                      onClick={() => setExpandedQuery(expandedQuery === query.id ? null : query.id)}
                    >
                      <div>
                        <p className="font-medium">{query.clientName}</p>
                        <p className="text-sm text-gray-500">{query.message.substring(0, 50)}...</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          query.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {query.status}
                        </span>
                        {expandedQuery === query.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {expandedQuery === query.id && (
                      <div className="p-4 border-t border-gray-200">
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Submitted on: {new Date(query.createdAt).toLocaleString()}</p>
                          <p className="text-gray-700">{query.message}</p>
                        </div>

                        {query.response ? (
                          <div className="bg-green-50 p-3 rounded-lg mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-green-800">Response</p>
                              <span className="text-xs text-green-600">
                                {new Date(query.updatedAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-green-700">{query.response}</p>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <label htmlFor={`reply-${query.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Reply to Query
                            </label>
                            <textarea
                              id={`reply-${query.id}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              rows={3}
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Type your response here..."
                            />
                          </div>
                        )}

                        {query.status === 'pending' && !query.response && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleResolveQuery(query.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark as Resolved
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No queries found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">System Settings</h2>
            {/* Settings content would go here */}
            <p>System configuration interface coming soon</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                name="name"
                placeholder="Full Name"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
                required
              />
              <select
                name="role"
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="client">Client</option>
                <option value="sales">Sales (max 3)</option>
                <option value="finance">Finance (max 3)</option>
                <option value="developer">Developer (max 3)</option>
                <option value="investor">Investor</option>
                <option value="partner">Partner (IWC)</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Create System Backup</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleBackup("sales")}
                className="w-full px-4 py-3 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 flex items-center justify-between"
              >
                <span>Backup Sales Data</span>
                <Database className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => handleBackup("products")}
                className="w-full px-4 py-3 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center justify-between"
              >
                <span>Backup Products</span>
                <Database className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => handleBackup("queries")}
                className="w-full px-4 py-3 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 flex items-center justify-between"
              >
                <span>Backup Customer Queries</span>
                <Database className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => handleBackup("full")}
                className="w-full px-4 py-3 bg-purple-100 text-purple-800 rounded hover:bg-purple-200 flex items-center justify-between"
              >
                <span>Full System Backup</span>
                <Database className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowBackupModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;