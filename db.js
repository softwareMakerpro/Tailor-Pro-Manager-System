// Enhanced Database for Kuwait Market - COMPLETE VERSION
function getShopConfig() {
    const config = localStorage.getItem('shopConfig');
    if (config) {
        return JSON.parse(config);
    }
    
    // Default configuration for Jamal Al-Shuwaikh
    const defaultConfig = {
        name: "JAMAL AL-SHUWAIKH",
        subtitle: "MEN TAILOR & TEXTILE",
        arabicName: "جمال الشويخ للرجال وفنستها", 
        phone: "97686004",
        address: "Kuwait – Comm. Area No. 9 – Mariam Comp – Basement – Shop No. 8",
        currency: "KWD",
        taxRate: 0, // Kuwait has no VAT currently
        language: "both" // Arabic and English
    };
    
    localStorage.setItem('shopConfig', JSON.stringify(defaultConfig));
    return defaultConfig;
}

// CLIENT FUNCTIONS
function getClientsFromDB() {
    try {
        return JSON.parse(localStorage.getItem('clients')) || [];
    } catch (error) {
        console.error('Error reading clients:', error);
        return [];
    }
}

function saveClientToDB(client) {
    try {
        const clients = getClientsFromDB();
        const existingIndex = clients.findIndex(c => c.id === client.id);
        
        if (existingIndex !== -1) {
            clients[existingIndex] = client;
        } else {
            clients.push(client);
        }
        
        localStorage.setItem('clients', JSON.stringify(clients));
        return client.id;
    } catch (error) {
        console.error('Error saving client:', error);
        return null;
    }
}

function getClientById(clientId) {
    const clients = getClientsFromDB();
    return clients.find(client => client.id === clientId);
}

function deleteClientFromDB(clientId) {
    try {
        const clients = getClientsFromDB();
        const filteredClients = clients.filter(client => client.id !== clientId);
        localStorage.setItem('clients', JSON.stringify(filteredClients));
        return true;
    } catch (error) {
        console.error('Error deleting client:', error);
        return false;
    }
}

// INVOICE FUNCTIONS
function getInvoicesFromDB() {
    try {
        return JSON.parse(localStorage.getItem('invoices')) || [];
    } catch (error) {
        console.error('Error reading invoices:', error);
        return [];
    }
}

function saveInvoiceToDB(invoice) {
    try {
        const invoices = getInvoicesFromDB();
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        return invoice.id;
    } catch (error) {
        console.error('Error saving invoice:', error);
        return null;
    }
}

function getInvoiceById(invoiceId) {
    const invoices = getInvoicesFromDB();
    return invoices.find(invoice => invoice.id === invoiceId);
}

// EXPENSE FUNCTIONS
function getExpensesFromDB() {
    try {
        return JSON.parse(localStorage.getItem('expenses')) || [];
    } catch (error) {
        console.error('Error reading expenses:', error);
        return [];
    }
}

function saveExpenseToDB(expense) {
    try {
        const expenses = getExpensesFromDB();
        const existingIndex = expenses.findIndex(e => e.id === expense.id);
        
        if (existingIndex !== -1) {
            expenses[existingIndex] = expense;
        } else {
            expenses.push(expense);
        }
        
        localStorage.setItem('expenses', JSON.stringify(expenses));
        return expense.id;
    } catch (error) {
        console.error('Error saving expense:', error);
        return null;
    }
}

function getExpenseById(expenseId) {
    const expenses = getExpensesFromDB();
    return expenses.find(expense => expense.id === expenseId);
}

function deleteExpenseFromDB(expenseId) {
    try {
        const expenses = getExpensesFromDB();
        const filteredExpenses = expenses.filter(expense => expense.id !== expenseId);
        localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
        return true;
    } catch (error) {
        console.error('Error deleting expense:', error);
        return false;
    }
}

// UTILITY FUNCTIONS
function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function getSettings() {
    try {
        return JSON.parse(localStorage.getItem('settings')) || {};
    } catch (error) {
        return {};
    }
}

// Kuwaiti measurement standards
const kuwaitiMeasurements = {
    thobe: {
        chest: 'الصدر',
        shoulder: 'الكتف', 
        length: 'الطول',
        sleeve: 'كم',
        neck: 'الرقبة'
    },
    suit: {
        chest: 'الصدر',
        waist: 'الخصر',
        hips: 'الأرداف',
        length: 'الطول',
        sleeve: 'كم'
    }
};

function saveMeasurementTemplate(clientId, garmentType, measurements) {
    const clients = getClientsFromDB();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex !== -1) {
        if (!clients[clientIndex].measurementTemplates) {
            clients[clientIndex].measurementTemplates = {};
        }
        
        clients[clientIndex].measurementTemplates[garmentType] = {
            ...measurements,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('clients', JSON.stringify(clients));
    }
}

// Initialize default data if empty
function initializeDefaultData() {
    const clients = getClientsFromDB();
    const invoices = getInvoicesFromDB();
    const expenses = getExpensesFromDB();
    
    if (clients.length === 0 && invoices.length === 0 && expenses.length === 0) {
        // Add a sample client for testing
        const sampleClient = {
            id: generateId(),
            name: "Sample Client",
            phone: "12345678",
            bookNo: "001",
            measurements: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        saveClientToDB(sampleClient);
    }
}

// Initialize when loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDefaultData();
});
