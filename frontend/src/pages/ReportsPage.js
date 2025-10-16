import React, { useState, useEffect } from 'react';
import { getReport } from '../utils/financeApi';
import LoadingSpinner from '../components/elements/LoadingSpinner';
import Button from '../components/elements/Button';

export default function ReportsPage() {
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

  const categoryBreakdown = (details) => {
    const categoryMap = {};
    details.forEach(item => {
      const category = item.category__name || 'Uncategorized';
      if (!categoryMap[category]) {
        categoryMap[category] = { total: 0, count: 0 };
      }
      categoryMap[category].total += item.amount;
      categoryMap[category].count += 1;
    });
    return Object.entries(categoryMap).sort((a, b) => b[1].total - a[1].total);
  };

  const incomeBreakdown = reportData ? categoryBreakdown(reportData.income_details) : [];
  const expenseBreakdown = reportData ? categoryBreakdown(reportData.expense_details) : [];

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Financial Reports</h1>
          <Button onClick={fetchReport} variant="secondary">
            🔄 Refresh Report
          </Button>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30 shadow-xl">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Income</h3>
            <p className="text-4xl font-bold text-green-400">
              ${reportData?.total_income?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-rose-500/10 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30 shadow-xl">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Expenses</h3>
            <p className="text-4xl font-bold text-red-400">
              ${reportData?.total_expense?.toFixed(2) || '0.00'}
            </p>
          </div>

          <div className={`bg-gradient-to-br ${reportData?.total_balance >= 0 ? 'from-blue-500/20 to-cyan-500/10 border-blue-500/30' : 'from-orange-500/20 to-red-500/10 border-orange-500/30'} backdrop-blur-lg rounded-2xl p-6 border shadow-xl`}>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Net Balance</h3>
            <p className={`text-4xl font-bold ${reportData?.total_balance >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
              ${reportData?.total_balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Detailed Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Income Breakdown */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Income Breakdown</h2>
            {incomeBreakdown.length > 0 ? (
              <div className="space-y-4">
                {incomeBreakdown.map(([category, data], index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-white">{category}</h3>
                      <span className="text-green-400 font-bold">${data.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{data.count} transaction{data.count !== 1 ? 's' : ''}</span>
                      <span>Avg: ${(data.total / data.count).toFixed(2)}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full"
                        style={{ width: `${(data.total / reportData.total_income * 100).toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No income data available</p>
            )}
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Expense Breakdown</h2>
            {expenseBreakdown.length > 0 ? (
              <div className="space-y-4">
                {expenseBreakdown.map(([category, data], index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-white">{category}</h3>
                      <span className="text-red-400 font-bold">${data.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{data.count} transaction{data.count !== 1 ? 's' : ''}</span>
                      <span>Avg: ${(data.total / data.count).toFixed(2)}</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-700/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-rose-400 h-full rounded-full"
                        style={{ width: `${(data.total / reportData.total_expense * 100).toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No expense data available</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incomes */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Income</h2>
            <div className="space-y-2">
              {reportData?.income_details.slice(0, 5).map((income, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/10">
                  <div>
                    <p className="text-white font-medium">{income.category__name || 'Uncategorized'}</p>
                    <p className="text-xs text-gray-400">{new Date(income.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-green-400 font-bold">+${income.amount.toFixed(2)}</span>
                </div>
              ))}
              {reportData?.income_details.length === 0 && (
                <p className="text-gray-400 text-center py-4">No recent income</p>
              )}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Expenses</h2>
            <div className="space-y-2">
              {reportData?.expense_details.slice(0, 5).map((expense, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/10">
                  <div>
                    <p className="text-white font-medium">{expense.category__name || 'Uncategorized'}</p>
                    <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-red-400 font-bold">-${expense.amount.toFixed(2)}</span>
                </div>
              ))}
              {reportData?.expense_details.length === 0 && (
                <p className="text-gray-400 text-center py-4">No recent expenses</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
