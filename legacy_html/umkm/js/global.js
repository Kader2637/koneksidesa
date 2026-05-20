window.notif = function(title, text, type='success', url=null) { window.dispatchEvent(new CustomEvent('show-toast', { detail: { title, text, type, url }})); };
        window.addEventListener('DOMContentLoaded', () => {
             // System realtime (optional for demo)
             setTimeout(() => {
                 window.dispatchEvent(new CustomEvent('show-toast', { detail: { title: 'Budi Santoso (WhatsApp)', text: 'Halo Min, pesanan saya kapan dikirim?', type: 'chat' }}));
             }, 3500);
        });