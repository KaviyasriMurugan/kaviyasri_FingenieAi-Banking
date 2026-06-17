import axios from 'axios';
 
const API_BASE_URL = 'http://localhost:8080/api';
 
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
 
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
 
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};
 
export const bankingAPI = {
    createAccount: (email) => api.post(`/banking/account/create?email=${email}`),
    getAccount: (email) => api.get(`/banking/account?email=${email}`),
    deposit: (data) => api.post('/banking/deposit', data),
    withdraw: (data) => api.post('/banking/withdraw', data),
    getTransactions: (email) => api.get(`/banking/transactions?email=${email}`),
    transfer: (data) => api.post('/banking/transfer', data),
};
 
export const loanAPI = {
    applyLoan: (data) => api.post('/loans/apply', data),
    getMyLoans: (email) => api.get(`/loans/my-loans?email=${email}`),
    calculateEMI: (amount, tenure, rate) =>
        api.get(`/loans/emi-calculator?amount=${amount}&tenure=${tenure}&rate=${rate}`),
};
 
export const investmentAPI = {
    addInvestment: (data) => api.post('/investments/add', data),
    getMyInvestments: (email) => api.get(`/investments/my-investments?email=${email}`),
    getPortfolioValue: (email) => api.get(`/investments/portfolio-value?email=${email}`),
    getMutualFundSuggestions: (riskLevel) => api.get(`/investments/mutual-fund-suggestions?riskLevel=${riskLevel}`),
    getSavingsRecommendation: (email) => api.get(`/investments/savings-recommendation?email=${email}`),
};
 
export const fraudAPI = {
    getFraudAlerts: () => api.get('/fraud/alerts'),
    getRiskScore: (data) => api.post('/fraud/risk-score', data),
};
 
export const adminAPI = {
    getAllUsers: () => api.get('/admin/users'),
    getStats: () => api.get('/admin/stats'),
    getCustomerTransactions: (email) =>
        api.get(`/admin/customer/${email}/transactions`),
};
 
export default api;
 