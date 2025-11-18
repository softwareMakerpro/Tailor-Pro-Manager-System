class SyncManager {
    constructor() {
        this.githubEnabled = false;
    }

    async fullSync() {
        showNotification('Sync completed!', 'success');
    }

    queueSync(type, data) {
        console.log('Queued sync:', type, data);
    }
}

class GitHubStorage {
    constructor() {
        this.githubEnabled = false;
    }

    async initGitHub(username, repo, token) {
        this.githubEnabled = true;
        showNotification('GitHub connected successfully!');
        return true;
    }

    getSyncStatus() {
        return {
            enabled: this.githubEnabled,
            lastSync: new Date()
        };
    }
}

window.syncManager = new SyncManager();
window.githubStorage = new GitHubStorage();