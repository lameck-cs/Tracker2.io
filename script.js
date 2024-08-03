const data = [
    { age: 19, gender: 'Non-binary', year_in_school: 'Freshman', major: 'Psychology', monthly_income: 958, financial_aid: 270, total_expenses: 7099, preferred_payment_method: 'Credit/Debit Card' },
    { age: 24, gender: 'Female', year_in_school: 'Junior', major: 'Economics', monthly_income: 1006, financial_aid: 875, total_expenses: 7021, preferred_payment_method: 'Credit/Debit Card' },
    { age: 24, gender: 'Non-binary', year_in_school: 'Junior', major: 'Economics', monthly_income: 734, financial_aid: 928, total_expenses: 5589, preferred_payment_method: 'Cash' },
    { age: 23, gender: 'Female', year_in_school: 'Senior', major: 'Computer Science', monthly_income: 617, financial_aid: 265, total_expenses: 6715, preferred_payment_method: 'Mobile Payment App' },
    { age: 20, gender: 'Female', year_in_school: 'Senior', major: 'Computer Science', monthly_income: 810, financial_aid: 522, total_expenses: 6299, preferred_payment_method: 'Credit/Debit Card' },
    // Add more data points as necessary
];

const uniqueValues = (key) => [...new Set(data.map(item => item[key]))];

const populateFilters = () => {
    const ageFilter = document.getElementById('ageFilter');
    const genderFilter = document.getElementById('genderFilter');
    const yearFilter = document.getElementById('yearFilter');
    const majorFilter = document.getElementById('majorFilter');
    const paymentMethodFilter = document.getElementById('paymentMethodFilter');

    uniqueValues('age').forEach(value => ageFilter.append(new Option(value, value)));
    uniqueValues('gender').forEach(value => genderFilter.append(new Option(value, value)));
    uniqueValues('year_in_school').forEach(value => yearFilter.append(new Option(value, value)));
    uniqueValues('major').forEach(value => majorFilter.append(new Option(value, value)));
    uniqueValues('preferred_payment_method').forEach(value => paymentMethodFilter.append(new Option(value, value)));
};

const filterData = () => {
    const age = document.getElementById('ageFilter').value;
    const gender = document.getElementById('genderFilter').value;
    const year = document.getElementById('yearFilter').value;
    const major = document.getElementById('majorFilter').value;
    const paymentMethod = document.getElementById('paymentMethodFilter').value;

    return data.filter(item =>
        (age === '' || item.age == age) &&
        (gender === '' || item.gender === gender) &&
        (year === '' || item.year_in_school === year) &&
        (major === '' || item.major === major) &&
        (paymentMethod === '' || item.preferred_payment_method === paymentMethod)
    );
};

const updateMetrics = (filteredData) => {
    const averageIncome = filteredData.reduce((sum, item) => sum + item.monthly_income, 0) / filteredData.length;
    const totalFinancialAid = filteredData.reduce((sum, item) => sum + item.financial_aid, 0);

    document.getElementById('averageIncome').innerText = `Average Monthly Income: $${averageIncome.toFixed(2)}`;
    document.getElementById('totalFinancialAid').innerText = `Total Financial Aid Received: $${totalFinancialAid}`;
};

const renderCharts = (filteredData) => {
    const ctx1 = document.getElementById('expensesByMajorChart').getContext('2d');
    const ctx2 = document.getElementById('expenseIncomeRatioChart').getContext('2d');
    const ctx3 = document.getElementById('financialAidExpensesChart').getContext('2d');
    const ctx4 = document.getElementById('majorFinancialAidChart').getContext('2d');

    const expensesByMajor = filteredData.reduce((acc, item) => {
        acc[item.major] = (acc[item.major] || 0) + item.total_expenses;
        return acc;
    }, {});

    const expenseToIncomeRatio = filteredData.map(item => item.total_expenses / item.monthly_income);

    const financialAidExpenses = filteredData.reduce((acc, item) => {
        acc[item.financial_aid] = (acc[item.financial_aid] || 0) + item.total_expenses;
        return acc;
    }, {});

    const majorFinancialAid = filteredData.reduce((acc, item) => {
        acc[item.major] = (acc[item.major] || 0) + item.financial_aid;
        return acc;
    }, {});

    new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: Object.keys(expensesByMajor),
            datasets: [{
                label: 'Total Expenses',
                data: Object.values(expensesByMajor),
                backgroundColor: 'skyblue'
            }]
        }
    });

    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: filteredData.map((_, i) => `Person ${i + 1}`),
            datasets: [{
                label: 'Expense-to-Income Ratio',
                data: expenseToIncomeRatio,
                backgroundColor: 'salmon'
            }]
        }
    });

    new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: Object.keys(financialAidExpenses),
            datasets: [{
                label: 'Average Total Expenses',
                data: Object.values(financialAidExpenses),
                backgroundColor: 'lightgreen'
            }]
        }
    });

    new Chart(ctx4, {
        type: 'bar',
        data: {
            labels: Object.keys(majorFinancialAid),
            datasets: [{
                label: 'Average Financial Aid',
                data: Object.values(majorFinancialAid),
                backgroundColor: 'lightcoral'
            }]
        }
    });
};

const updateDashboard = () => {
    const filteredData = filterData();
    updateMetrics(filteredData);
    renderCharts(filteredData);
};

document.addEventListener('DOMContentLoaded', () => {
    populateFilters();
    updateDashboard();

    document.getElementById('ageFilter').addEventListener('change', updateDashboard);
    document.getElementById('genderFilter').addEventListener('change', updateDashboard);
    document.getElementById('yearFilter').addEventListener('change', updateDashboard);
    document.getElementById('majorFilter').addEventListener('change', updateDashboard);
    document.getElementById('paymentMethodFilter').addEventListener('change', updateDashboard);
});

