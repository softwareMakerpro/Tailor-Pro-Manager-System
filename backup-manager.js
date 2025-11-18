class BackupManager {
    downloadBackup() {
        const backup = {
            clients: getClientsFromDB(),
            invoices: getInvoicesFromDB(),
            expenses: getExpensesFromDB(),
            settings: getSettings(),
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `jamal-tailor-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Backup downloaded successfully!');
    }
}

window.backupManager = new BackupManager();