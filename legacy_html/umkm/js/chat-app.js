function chatApp() {
            return {
                activeUserId: 1,
                msgInput: '',
                contacts: [
                    { id: 1, name: 'Budi Santoso', time: '10:24 AM', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', unread: true, lastMsg: 'Halo Min, stok kopi...', online: true,
                      history: [
                          { sender: 'them', text: 'Halo Min, mau tanya stok kopi robustanya yang kemasan 1Kg masih ready buat dikirim hari ini ga?', time: '10:24 AM' },
                          { sender: 'me', text: 'Halo Kak Budi! 👋 Stok Kopi Robusta 1Kg kami masih sangat aman dan siap kirim.', time: '10:26 AM' }
                      ]
                    },
                    { id: 2, name: 'Siti Aminah', time: 'Kemarin', initial: 'SA', color: 'rose', unread: false, lastMsg: 'Terima kasih, paket aman.', online: false,
                      history: [
                          { sender: 'me', text: 'Pesanan sudah kami serahkan ke kurir ya kak.', time: '11:00 AM' },
                          { sender: 'them', text: 'Terima kasih, paket aman. Cepat juga nyampainya!', time: '08:30 AM (Kemarin)' }
                      ]
                    },
                    { id: 3, name: 'Ahmad W.', time: 'Kemarin', img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80', unread: false, lastMsg: 'Barang cacat kemasannya.', online: true,
                      history: [
                          { sender: 'them', text: 'Min, ini kok plastiknya sedikit robek ya pas nyampe?', time: '04:15 PM (Kemarin)' },
                          { sender: 'me', text: 'Mohon maaf kak atas ketidaknyamanannya. Apakah isinya tumpah? Jika iya, akan kami retur secepatnya.', time: '04:20 PM (Kemarin)' }
                      ]
                    },
                    { id: 4, name: 'Ratna Dwi', time: 'Senin', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', unread: false, lastMsg: 'Bisa dikirim via Gojek?', online: false,
                      history: [
                          { sender: 'them', text: 'Halo, ke daerah pusat kota bisa pakai pengiriman instan?', time: '09:00 AM (Senin)' },
                          { sender: 'me', text: 'Bisa kak, silakan pilih opsi Instan saat checkout.', time: '10:00 AM' }
                      ]
                    },
                    { id: 5, name: 'Hendra', time: 'Minggu', initial: 'HD', color: 'blue', unread: false, lastMsg: 'Siap boss.', online: false,
                      history: [
                          { sender: 'me', text: 'Invoice pesanan partai besar sudah kami kirimkan via email ya Pak.', time: '14:00 PM (Minggu)' },
                          { sender: 'them', text: 'Siap boss. Segera di proses.', time: '14:25 PM' }
                      ]
                    },
                    { id: 6, name: 'Kios Rejeki', time: '22 Mar', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', unread: false, lastMsg: 'Kak, kapan restock aren cair?', online: false,
                      history: [
                          { sender: 'them', text: 'Kak, kapan restock aren cair 500ml? Saya butuh 2 dus.', time: '10:00 AM (22 Mar)' },
                          { sender: 'me', text: 'Perkiraan minggu depan kak. Pabrik sedang penuh antrean.', time: '11:00 AM' }
                      ]
                    },
                    { id: 7, name: 'Liana', time: '19 Mar', initial: 'LA', color: 'purple', unread: false, lastMsg: 'Oke makasih infonya 🙏', online: true,
                      history: [
                          { sender: 'them', text: 'Saya mau jadi reseller syaratnya apa min?', time: '09:00 AM (19 Mar)' },
                          { sender: 'me', text: 'Cukup minimal pembelian 10 item langsung dapat potongan 15% kak.', time: '09:30 AM' },
                          { sender: 'them', text: 'Oke makasih infonya 🙏', time: '10:00 AM' }
                      ]
                    }
                ],
                get activeUser() {
                    return this.contacts.find(c => c.id === this.activeUserId);
                },
                sendMsg() {
                    if(!this.msgInput.trim()) return;
                    this.activeUser.history.push({ sender: 'me', text: this.msgInput, time: 'Baru saja' });
                    this.activeUser.lastMsg = this.msgInput;
                    this.activeUser.time = 'Baru saja';
                    this.msgInput = '';
                    setTimeout(() => {
                       let el = document.getElementById('chatContainer');
                       if(el) el.scrollTop = el.scrollHeight;
                       if(window.lucide) lucide.createIcons();
                    }, 50);
                }
            }
        }