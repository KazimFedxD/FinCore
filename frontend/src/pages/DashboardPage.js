import React, { useState, useEffect } from 'react';
import { getReport } from '../utils/financeApi';
import LoadingSpinner from '../components/elements/LoadingSpinner';
import Button from '../components/elements/Button';

export default function DashboardPage() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    const response = await getReport();
    
    if (response.ok) {
      setReportData(response.data);
    } else {
      setError(response.error?.message || 'Failed to fetch report');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const getCategoryBreakdown = (details, type) => {
    const categoryMap = {};
    details.forEach(item => {
      const category = item.category__name || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += item.amount;
    });
    return Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl mb-4">{error}</p>
          <Button onClick={fetchReport}>Retry</Button>
        </div>
      </div>
    );
  }

  const incomeBreakdown = reportData ? getCategoryBreakdown(reportData.income_details, 'income') : [];
  const expenseBreakdown = reportData ? getCategoryBreakdown(reportData.expense_details, 'expense') : [];

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <Button onClick={fetchReport} variant="secondary">
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-300">Total Income</h3>
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-green-400 text-xl">↑</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400">
              ${reportData?.total_income?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Total Expense */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-300">Total Expenses</h3>
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-xl">↓</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-400">
              ${reportData?.total_expense?.toFixed(2) || '0.00'}
            </p>
          </div>

          {/* Balance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-300">Current Balance</h3>
              <div className={`w-10 h-10 ${reportData?.total_balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'} rounded-full flex items-center justify-center`}>
                <span className={`${reportData?.total_balance >= 0 ? 'text-blue-400' : 'text-orange-400'} text-xl`}>
                  {reportData?.total_balance >= 0 ? '=' : '!'}
                </span>
              </div>
            </div>
            <p className={`text-3xl font-bold ${reportData?.total_balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
              ${reportData?.total_balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Category Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income by Category */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Income by Category</h2>
            {incomeBreakdown.length > 0 ? (
              <div className="space-y-3">
                {incomeBreakdown.map(([category, amount], index) => {
                  const percentage = reportData.total_income > 0 
                    ? (amount / reportData.total_income * 100).toFixed(1) 
                    : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-medium">{category}</span>
                        <span className="text-green-400 font-semibold">${amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 text-right">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No income data available</p>
            )}
          </div>

          {/* Expenses by Category */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Expenses by Category</h2>
            {expenseBreakdown.length > 0 ? (
              <div className="space-y-3">
                {expenseBreakdown.map(([category, amount], index) => {
                  const percentage = reportData.total_expense > 0 
                    ? (amount / reportData.total_expense * 100).toFixed(1) 
                    : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300 font-medium">{category}</span>
                        <span className="text-red-400 font-semibold">${amount.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-rose-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 text-right">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No expense data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
