// Enhanced for JAMAL AL-SHUWAIKH - Kuwait Market - WORKING VERSION
class JamalTailorManager {
    constructor() {
        this.shopConfig = this.loadShopConfig();
        this.currency = 'KWD';
        this.init();
    }

    loadShopConfig() {
        const saved = localStorage.getItem('shopConfig');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            name: "JAMAL AL-SHUWAIKH",
            subtitle: "MEN TAILOR & TEXTILE", 
            arabicName: "جمال الشويخ للرجال وفنستها",
            phone: "97686004",
            address: "Kuwait – Comm. Area No. 9 – Mariam Comp – Basement – Shop No. 8",
            currency: "KWD"
        };
    }

    init() {
        this.applyBranding();
        this.initNavigation();
        this.initEventListeners();
        this.setupKuwaitFeatures();
        this.loadInitialData();
    }

    applyBranding() {
        // Update page titles and headers
        document.title = `${this.shopConfig.name} - Tailor Management`;
        
        // Update currency displays
        this.updateCurrencyDisplays();
    }

    updateCurrencyDisplays() {
        const currencyElements = document.querySelectorAll('[data-currency]');
        currencyElements.forEach(el => {
            el.textContent = this.currency;
        });
    }

    setupKuwaitFeatures() {
        // Kuwait-specific measurements
        this.measurementTypes = {
            thobe: ['Chest', 'Shoulder', 'Length', 'Sleeve', 'Neck'],
            suit: ['Chest', 'Waist', 'Hips', 'Length', 'Sleeve'],
            shirt: ['Chest', 'Neck', 'Sleeve', 'Length'],
            pants: ['Waist', 'Hips', 'Length', 'Inseam']
        };

        // Common Kuwaiti garment types
        this.garmentTypes = [
            'Dishdasha/Thobe',
            'Suit',
            'Shirt',
            'Pants',
            'Jacket',
            'Traditional Wear',
            'Altering/Repair'
        ];
    }

    formatCurrency(amount) {
        return `${this.currency} ${parseFloat(amount).toFixed(3)}`;
    }

    // Kuwaiti date format
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-KW', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    generateKuwaitiInvoice(invoiceData) {
        const client = getClientById(invoiceData.clientId);
        const total = this.formatCurrency(invoiceData.grandTotal);
        
        return {
            ...invoiceData,
            formattedTotal: total,
            shopInfo: this.shopConfig,
            date: this.formatDate(invoiceData.dateTime)
        };
    }

    loadInitialData() {
        // Load any initial data needed
        console.log('Jamal Tailor Manager initialized');
    }

    initNavigation() {
        // Navigation is handled in HTML
    }

    initEventListeners() {
        // Event listeners are handled in individual pages
    }
}

// Enhanced client management for Kuwait market
function saveKuwaitiClient(clientData) {
    // Add Kuwait-specific fields
    const client = {
        ...clientData,
        country: 'Kuwait',
        preferredLanguage: clientData.preferredLanguage || 'Arabic',
        createdAt: new Date().toISOString(),
        measurements: clientData.measurements || {}
    };

    saveClientToDB(client);
    
    // Auto-sync if enabled
    if (window.githubStorage && githubStorage.githubEnabled) {
        syncManager.queueSync('client', client);
    }
    
    showNotification('Client saved successfully!', 'success');
    return client.id;
}

// Enhanced for Kuwaiti garments
function generateKuwaitiInvoice(invoiceData) {
    const invoice = {
        ...invoiceData,
        currency: 'KWD',
        shopInfo: window.jamalManager.shopConfig,
        items: invoiceData.items.map(item => ({
            ...item,
            price: window.jamalManager.formatCurrency(item.rate),
            total: window.jamalManager.formatCurrency(item.total)
        }))
    };

    saveInvoiceToDB(invoice);
    
    if (window.githubStorage && githubStorage.githubEnabled) {
        syncManager.queueSync('invoice', invoice);
    }

    return invoice;
}

// WhatsApp message in Arabic/English
function shareInvoiceWithArabic(invoiceId) {
    const invoice = getInvoiceById(invoiceId);
    const client = getClientById(invoice.clientId);
    
    let message = `*${window.jamalManager.shopConfig.name}*\n`;
    message += `*${window.jamalManager.shopConfig.arabicName}*\n\n`;
    message += `Invoice/Fatura: ${invoice.id}\n`;
    message += `Client/العميل: ${client.name}\n`;
    message += `Phone/هاتف: ${client.phone}\n\n`;
    message += `*Items/المنتجات:*\n`;
    
    invoice.items.forEach((item, index) => {
        message += `${index + 1}. ${item.itemName} - ${item.qty} × ${window.jamalManager.formatCurrency(item.rate)} = ${window.jamalManager.formatCurrency(item.total)}\n`;
    });
    
    message += `\nSubtotal/المجموع: ${window.jamalManager.formatCurrency(invoice.subtotal)}\n`;
    message += `Tax/الضريبة: ${window.jamalManager.formatCurrency(invoice.tax)}\n`;
    message += `Discount/الخصم: ${window.jamalManager.formatCurrency(invoice.discount)}\n`;
    message += `*Total/المجموع الكلي: ${window.jamalManager.formatCurrency(invoice.grandTotal)}*\n\n`;
    message += `Thank you! شكراً لك!\n`;
    message += `📞 ${window.jamalManager.shopConfig.phone}\n`;
    message += `📍 ${window.jamalManager.shopConfig.address}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${client.phone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.jamalManager = new JamalTailorManager();
});

// Enhanced notification system
function showNotification(message, type = 'success') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #2c3e50;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#f39c12'};
        max-width: 400px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS animations for notifications
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Dashboard data loading function
function loadDashboardData() {
    const clients = getClientsFromDB();
    const invoices = getInvoicesFromDB();
    const expenses = getExpensesFromDB();
    
    // Update client count
    const clientsElement = document.getElementById('totalClients');
    if (clientsElement) clientsElement.textContent = clients.length;
    
    // Update invoice count
    const invoicesElement = document.getElementById('totalOrders');
    if (invoicesElement) invoicesElement.textContent = invoices.length;
    
    // Calculate and update revenue
    const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
    const revenueElement = document.getElementById('totalRevenue');
    if (revenueElement) revenueElement.textContent = `KWD ${totalRevenue.toFixed(3)}`;
    
    // Calculate and update expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const expensesElement = document.getElementById('totalExpenses');
    if (expensesElement) expensesElement.textContent = `KWD ${totalExpenses.toFixed(3)}`;
    
    // Calculate profit
    const profit = totalRevenue - totalExpenses;
    const profitElement = document.getElementById('profit');
    if (profitElement) profitElement.textContent = `KWD ${profit.toFixed(3)}`;
    
    // Load recent invoices
    loadRecentInvoices(invoices.slice(0, 5));
}

function loadRecentInvoices(recentInvoices) {
    const container = document.getElementById('recentInvoices');
    if (!container) return;
    
    if (recentInvoices.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No invoices yet. Create your first invoice to see activity here.</p></div>';
        return;
    }
    
    container.innerHTML = recentInvoices.map(invoice => {
        const client = getClientById(invoice.clientId);
        return `
            <div class="activity-item">
                <div class="activity-icon">🧾</div>
                <div class="activity-info">
                    <div class="activity-title">Invoice ${invoice.id}</div>
                    <div class="activity-details">
                        ${client ? client.name : 'Unknown Client'} - KWD ${invoice.grandTotal.toFixed(3)}
                    </div>
                    <div class="activity-time">${new Date(invoice.dateTime).toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }).join('');
}
