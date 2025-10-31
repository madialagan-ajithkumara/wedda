import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Budget() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [newItem, setNewItem] = useState({ title: '', amount: '', category: 'Venue' });
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = [
    'Venue',
    'Catering',
    'Decoration',
    'Photography',
    'Music',
    'Attire',
    'Transportation',
    'Other'
  ];

  useEffect(() => {
    fetchBudgetItems();
  }, []);

  const fetchBudgetItems = async () => {
    try {
      const response = await api.get('/budget');
      setBudgetItems(response.data);
      calculateTotal(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching budget items:', error);
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((acc, item) => acc + item.amount, 0);
    setTotalBudget(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/budget', {
        ...newItem,
        amount: parseFloat(newItem.amount)
      });
      setBudgetItems([...budgetItems, response.data]);
      calculateTotal([...budgetItems, response.data]);
      setNewItem({ title: '', amount: '', category: 'Venue' });
    } catch (error) {
      console.error('Error adding budget item:', error);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await api.delete(`/budget/${itemId}`);
      const updatedItems = budgetItems.filter(item => item._id !== itemId);
      setBudgetItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error('Error deleting budget item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Budget Planner
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <span className="text-2xl font-bold text-indigo-600">
            Total: ${totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Item description"
            required
          />
          <input
            type="number"
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Amount"
            min="0"
            step="0.01"
            required
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Item
        </button>
      </form>

      <div className="mt-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {budgetItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}