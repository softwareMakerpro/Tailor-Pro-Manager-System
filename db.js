// Enhanced Database for Kuwait Market
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

// Enhanced client structure for Kuwait market
function saveClientToDB(client) {
    const clients = getClientsFromDB();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    
    // Add Kuwait-specific fields
    const enhancedClient = {
        ...client,
        country: client.country || 'Kuwait',
        preferredLanguage: client.preferredLanguage || 'Arabic',
        lastUpdated: new Date().toISOString()
    };
    
    if (existingIndex !== -1) {
        clients[existingIndex] = enhancedClient;
    } else {
        clients.push(enhancedClient);
    }
    
    localStorage.setItem('clients', JSON.stringify(clients));
    return enhancedClient.id;
}

// Enhanced invoice for Kuwaiti Dinar
function saveInvoiceToDB(invoice) {
    const invoices = getInvoicesFromDB();
    
    const enhancedInvoice = {
        ...invoice,
        currency: 'KWD',
        shopInfo: getShopConfig(),
        createdAt: new Date().toISOString()
    };
    
    invoices.push(enhancedInvoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    return enhancedInvoice.id;
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