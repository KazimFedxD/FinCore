import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../utils/financeApi';
import LoadingSpinner from '../components/elements/LoadingSpinner';
import Button from '../components/elements/Button';
import Input from '../components/elements/Input';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    parent: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    const response = await getCategories();
    
    if (response.ok) {
      setCategories(response.data || []);
    } else {
      setError(response.error?.message || 'Failed to fetch categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await createCategory(formData);
    
    if (response.ok) {
      setFormData({ name: '', parent: '', description: '' });
      setShowAddForm(false);
      fetchCategories();
    } else {
      setError(response.error?.message || 'Failed to create category');
    }
    setSubmitting(false);
  };

  const handleDelete = async (categoryId, categoryName, isRoot) => {
    if (isRoot) {
      alert('Cannot delete root categories');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    const response = await deleteCategory(categoryId);
    
    if (response.ok) {
      fetchCategories();
    } else {
      setError(response.error?.message || 'Failed to delete category');
    }
  };

  // Group categories by parent
  const groupedCategories = categories.reduce((acc, cat) => {
    const parentName = cat.parent__name || 'Root';
    if (!acc[parentName]) {
      acc[parentName] = [];
    }
    acc[parentName].push(cat);
    return acc;
  }, {});

  const rootCategories = categories.filter(cat => cat.root === true);
  const parentOptions = rootCategories.map(cat => cat.name);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Categories</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Category'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Category Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Category Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Salary, Food, Transport"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select parent category</option>
                  {parentOptions.map((parent) => (
                    <option key={parent} value={parent}>{parent}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Description (Optional)"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this category"
              />

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Creating...' : 'Create Category'}
              </Button>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-6">
          {Object.entries(groupedCategories).map(([parentName, cats]) => (
            <div key={parentName} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">{parentName}</h2>
              <div className="space-y-2">
                {cats.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                      )}
                    </div>
                    {!category.root && (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(category.id, category.name, category.root)}
                        className="ml-4"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">No categories found. Add your first category to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
