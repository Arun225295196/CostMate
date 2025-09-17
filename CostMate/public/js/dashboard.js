// Initialize Materialize components
document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit();
    loadDashboardData();
    initializeCharts();
    loadAITip();
});

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard/overview');
        const data = await response.json();
        
        document.getElementById('monthlyTotal').textContent = data.monthlyTotal.toFixed(2);
        document.getElementById('budgetPercentage').textContent = data.budgetPercentage;
        
        // Load recent transactions
        loadRecentTransactions(data.recentTransactions);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load recent transactions
function loadRecentTransactions(transactions) {
    const tbody = document.getElementById('recentTransactions');
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
        `;
    });
}

// Initialize charts
function initializeCharts() {
    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    fetch('/api/dashboard/category-data')
        .then(response => response.json())
        .then(data => {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        data: data.values,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        });

    // Trend Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    fetch('/api/dashboard/trend-data')
        .then(response => response.json())
        .then(data => {
            new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Monthly Expenses',
                        data: data.values,
                        borderColor: '#36A2EB',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
}

// Load AI-driven tip
async function loadAITip() {
    try {
        const response = await fetch('/api/ai/tip');
        const data = await response.json();
        document.getElementById('aiTip').textContent = data.tip;
    } catch (error) {
        document.getElementById('aiTip').textContent = 'Track your daily expenses to better understand your spending patterns.';
    }
}