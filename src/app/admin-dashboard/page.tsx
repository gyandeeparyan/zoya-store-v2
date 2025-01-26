import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to the Admin Dashboard. Here you can manage your store, view statistics, and handle user accounts.
        </p>
      </div>

      {/* Summary Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Total Sales", value: "$12,345" },
            { title: "New Orders", value: "123" },
            { title: "Total Users", value: "456" },
          ].map((stat, index) => (
            <div key={index} className="p-6 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Recent Orders</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "12345", customer: "John Doe", amount: "$123.45", status: "Pending" },
                { id: "12346", customer: "Jane Smith", amount: "$67.89", status: "Completed" },
                { id: "12347", customer: "Mike Johnson", amount: "$45.67", status: "Shipped" },
              ].map((order, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{order.id}</td>
                  <td className="border px-4 py-2">{order.customer}</td>
                  <td className="border px-4 py-2">{order.amount}</td>
                  <td className="border px-4 py-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Section */}
      <div>
        <h2 className="text-3xl font-semibold mb-6">User Management</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
                { id: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
                { id: "3", name: "Mike Johnson", email: "mike@example.com", role: "User" },
              ].map((user, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
