"use client";
import { useEffect, useState } from 'react';
import { ShoppingCartIcon, UserIcon, InformationCircleIcon } from '@heroicons/react/outline';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="font-sans bg-white">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-green-500 to-green-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">IWB</h1>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:text-green-200">Home</a></li>
            <li><a href="/about" className="hover:text-green-200">About</a></li>
            <li><a href="/products" className="hover:text-green-200">Products</a></li>
            <li><a href="/contact" className="hover:text-green-200">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white text-center py-20">
        <h2 className="text-5xl font-extrabold">Welcome to IWB</h2>
        <p className="mt-4 text-xl">Explore our exclusive products to improve your business!</p>
        <a href="/products" className="mt-6 inline-block px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-100">Shop Now</a>
      </section>

      {/* Products Section */}
      <section className="p-8">
        <h3 className="text-3xl font-semibold text-center mb-8">Our Products</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <li key={product._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-2xl font-semibold">{product.name}</h4>
                <ShoppingCartIcon className="h-6 w-6 text-green-600 hover:text-green-800" />
              </div>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <p className="font-bold text-xl text-green-700">M{product.price}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-500 to-green-700 text-white text-center py-6">
        <p>&copy; 2025 IWB. All rights reserved.</p>
        <div className="mt-4">
          <a href="/about" className="text-green-200 hover:text-white mx-2">
            <InformationCircleIcon className="h-6 w-6 inline" /> About
          </a>
          <a href="/contact" className="text-green-200 hover:text-white mx-2">
            <UserIcon className="h-6 w-6 inline" /> Contact
          </a>
        </div>
      </footer>
    </div>
  );
}
