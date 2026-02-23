import React from 'react';
import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ExpenseHistory = ({ transactions, deleteTransaction }) => {
    return (
        <div className="history-container animate-fade">
            <div className="glass-card">
                <div className="section-header mb-6">
                    <h2>Activity History</h2>
                </div>

                <div className="table-responsive">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Notes</th>
                                <th className="text-right">Amount</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id}>
                                    <td>{format(parseISO(t.date), 'MMM d, yyyy')}</td>
                                    <td>
                                        <div className={`type-indicator ${t.type}`}>
                                            {t.type === 'income' ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                                            <span>{t.type}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`category-tag ${t.type === 'income' ? 'income-tag' : t.category.toLowerCase().replace(/\s/g, '-')}`}>
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="notes-cell">{t.notes || '-'}</td>
                                    <td className={`text-right font-bold ${t.type === 'income' ? 'text-success' : ''}`}>
                                        {t.type === 'income' ? '+' : ''}₹{parseFloat(t.amount).toLocaleString('en-IN')}
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn-icon delete"
                                            onClick={() => {
                                                if (confirm('Delete this transaction?')) deleteTransaction(t.id);
                                            }}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-muted">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpenseHistory;
