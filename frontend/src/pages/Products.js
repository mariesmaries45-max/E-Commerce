import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        console.log(data); // DEBUG
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Filter + Sort logic (SAFE)
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(
        (product) => product.brand && product.brand === selectedBrand
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, sortBy, selectedBrand, products]);

  // Unique brands
  const brands = [
    'all',
    ...new Set(products.map((p) => p.brand).filter(Boolean)),
  ];

  // Loading
  if (loading) return <Spinner />;

  // Error UI
  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <h1 className="page-title">All Products</h1>
        <p className="products-count">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Filters */}
      <div className="filters-container">
        {/* Search */}
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Dropdowns */}
        <div className="filter-group">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="filter-select"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand === 'all' ? 'All Brands' : brand}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="default">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBrand('all');
              setSortBy('default');
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;