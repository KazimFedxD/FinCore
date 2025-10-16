import React, { useState, useEffect } from 'react';
import { getIncomes, createIncome, deleteIncome, getCategories } from '../utils/financeApi';
import LoadingSpinner from '../components/elements/LoadingSpinner';
import Button from '../components/elements/Button';
import Input from '../components/elements/Input';

export default function IncomesPage() {
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchIncomes = async () => {
    const response = await getIncomes();
    if (response.ok) {
      setIncomes(response.data || []);
    } else {
      setError(response.error?.message || 'Failed to fetch incomes');
    }
  };

  const fetchCategories = async () => {
    const response = await getCategories();
    if (response.ok) {
      // Filter only income-related categories (non-root under Income parent)
      const allCategories = response.data || [];
      const incomeCategories = allCategories.filter(cat => 
        !cat.root && (cat.parent__name === 'Income' || cat.parent === null)
      );
      setCategories(incomeCategories);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchIncomes(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const response = await createIncome(formData);
    
    if (response.ok) {
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: ''
      });
      setShowAddForm(false);
      fetchIncomes();
      // Trigger dashboard update (could use a global state or event)
    } else {
      setError(response.error?.message || 'Failed to create income');
    }
    setSubmitting(false);
  };

  const handleDelete = async (incomeId, amount) => {
    if (!window.confirm(`Are you sure you want to delete income of $${amount}?`)) {
      return;
    }

    const response = await deleteIncome(incomeId);
    
    if (response.ok) {
      fetchIncomes();
    } else {
      setError(response.error?.message || 'Failed to delete income');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Incomes</h1>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Income'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add Income Form */}
        {showAddForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Add New Income</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
              
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Description (Optional)"
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description"
              />

              <div className="md:col-span-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Adding...' : 'Add Income'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Incomes Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {incomes.map((income) => (
                  <tr key={income.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {income.category__name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-400">
                      ${income.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {income.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(income.id, income.amount)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {incomes.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-xl">No income records found. Add your first income!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
