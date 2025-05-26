window.addEventListener('online', offlinePageStatus);

function offlinePageStatus() {
    if(navigator.onLine){
        location.reload();
    }
}