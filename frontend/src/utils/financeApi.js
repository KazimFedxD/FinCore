// Finance-specific API calls
import { apiGetAuth, apiPostAuth, apiDeleteAuth } from './api';
import { API_BASE_URL } from '../config/app';

// Categories API
export const getCategories = async () => {
  return await apiGetAuth(`${API_BASE_URL}/api/categories/`);
};

export const createCategory = async (categoryData) => {
  return await apiPostAuth(`${API_BASE_URL}/api/categories/`, categoryData);
};

export const deleteCategory = async (categoryId) => {
  return await apiDeleteAuth(`${API_BASE_URL}/api/categories/`, { 
    body: { id: categoryId } 
  });
};

// Incomes API
export const getIncomes = async () => {
  return await apiGetAuth(`${API_BASE_URL}/api/incomes/`);
};

export const createIncome = async (incomeData) => {
  return await apiPostAuth(`${API_BASE_URL}/api/incomes/`, incomeData);
};

export const deleteIncome = async (incomeId) => {
  return await apiDeleteAuth(`${API_BASE_URL}/api/incomes/`, { 
    body: { id: incomeId } 
  });
};

// Expenses API
export const getExpenses = async () => {
  return await apiGetAuth(`${API_BASE_URL}/api/expenses/`);
};

export const createExpense = async (expenseData) => {
  return await apiPostAuth(`${API_BASE_URL}/api/expenses/`, expenseData);
};

export const deleteExpense = async (expenseId) => {
  return await apiDeleteAuth(`${API_BASE_URL}/api/expenses/`, { 
    body: { id: expenseId } 
  });
};

// Report API
export const getReport = async () => {
  return await apiGetAuth(`${API_BASE_URL}/api/report/`);
};
