import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';

// Initialize Firebase
const appId = typeof __app_id !== 'undefined' ? __app_id : 'inventory-app-default';
const firebaseConfig = {
  apiKey: "AIzaSyASjLHWBd0Qn2451tX85c-uYmXXyKz-6hw",
  authDomain: "smart-inventory-sabil.firebaseapp.com",
  projectId: "smart-inventory-sabil",
  storageBucket: "smart-inventory-sabil.firebasestorage.app",
  messagingSenderId: "872402801301",
  appId: "1:872402801301:web:da493acb9b45ce880d419c"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const IconBox = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconArrowDownRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>;
const IconArrowUpRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>;
const IconClipboard = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>;
const IconDatabase = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const IconBarcode = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 5v14"></path><path d="M8 5v14"></path><path d="M12 5v14"></path><path d="M17 5v14"></path><path d="M21 5v14"></path></svg>;
const IconLogout = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const IconGoogle = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>;
const IconSmartphone = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>;
const IconMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function InventoryApp() {
    const [user, setUser] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('data_barang');
    
    // Data states
    const [items, setItems] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI States
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                try {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } catch (err) {
                    console.error("Custom token login error:", err);
                }
            }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsDemoMode(false);
            } else {
                setUser(prevUser => (prevUser && prevUser.uid === 'demo-local-user') ? prevUser : null);
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        
        if (user.uid === 'demo-local-user') {
            // Mode Demo Lokal
            setLoading(false);
            return () => {};
        }

        const userId = user.uid;
        
        // Fetch Items
        const itemsRef = collection(db, 'artifacts', appId, 'users', userId, 'items');
        const unsubItems = onSnapshot(itemsRef, (snapshot) => {
            const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemsData);
        }, (err) => console.error("Error fetching items:", err));

        // Fetch Transactions
        const transRef = collection(db, 'artifacts', appId, 'users', userId, 'transactions');
        const unsubTrans = onSnapshot(transRef, (snapshot) => {
            const transData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTransactions(transData);
            setLoading(false);
        }, (err) => console.error("Error fetching transactions:", err));

        return () => {
            unsubItems();
            unsubTrans();
        };
    }, [user]);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Login Error:", error);
            if (error.code === 'auth/unauthorized-domain') {
                // Bypass Firebase Error secara otomatis untuk simulasi Demo Lokal
                setIsDemoMode(true);
                setUser({ 
                    uid: 'demo-local-user', 
                    displayName: 'Pengguna Demo (Lokal)', 
                    email: 'demo@lokal.app',
                    photoURL: ''
                });
            } else {
                alert("Gagal melakukan login: " + error.message);
            }
        }
    };

    const handleLogout = async () => {
        try {
            if (isDemoMode) {
                setIsDemoMode(false);
                setUser(null);
                setItems([]);
                setTransactions([]);
            } else {
                await signOut(auth);
            }
            setActiveTab('data_barang'); // Reset tab
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    const sortedTransactions = useMemo(() => {
        return [...transactions].sort((a, b) => b.timestamp - a.timestamp);
    }, [transactions]);

    const getTransactionsByType = (type) => {
        return sortedTransactions.filter(t => t.type === type);
    };

    const handleCloseModal = () => {
        setModalConfig({ isOpen: false, type: null, data: null });
        setErrorMsg('');
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSaveItem = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const barcode = formData.get('barcode').trim();
        const name = formData.get('name').trim();
        const category = formData.get('category').trim();
        const price = parseInt(formData.get('price'), 10) || 0;
        const supplier = formData.get('supplier')?.trim() || '';

        if (!name) return setErrorMsg("Nama barang wajib diisi");

        // Check for duplicate barcode
        if (barcode && items.some(i => i.barcode === barcode)) {
            return setErrorMsg("Barcode/SKU ini sudah terdaftar pada barang lain.");
        }

        try {
            if (isDemoMode) {
                const newItem = {
                    id: 'item-' + Date.now(),
                    barcode,
                    name,
                    category,
                    price,
                    supplier,
                    stock: 0,
                    createdAt: Date.now()
                };
                setItems(prev => [...prev, newItem]);
            } else {
                const itemsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'items');
                await addDoc(itemsRef, {
                    barcode,
                    name,
                    category,
                    price,
                    supplier,
                    stock: 0,
                    createdAt: Date.now()
                });
            }
            handleCloseModal();
            showSuccess("Data Barang baru berhasil ditambahkan!");
        } catch (err) {
            setErrorMsg("Gagal menyimpan data barang.");
        }
    };

    const processTransaction = async (type, item, inputQty, notes, date) => {
        const currentStock = item.stock;
        let newStock = currentStock;
        let transQty = 0;

        if (type === 'masuk') {
            if (inputQty <= 0) throw new Error("Jumlah harus lebih dari 0");
            newStock = currentStock + inputQty;
            transQty = inputQty;
        } else if (type === 'keluar') {
            if (inputQty <= 0) throw new Error("Jumlah harus lebih dari 0");
            if (currentStock < inputQty) throw new Error(`Stok tidak mencukupi. Sisa stok: ${currentStock}`);
            newStock = currentStock - inputQty;
            transQty = inputQty;
        } else if (type === 'opname') {
            if (inputQty < 0) throw new Error("Stok fisik tidak bisa negatif");
            newStock = inputQty;
            transQty = inputQty - currentStock;
            if (transQty === 0) throw new Error("Tidak ada selisih stok.");
        }

        const transDate = date || new Date().toISOString().split('T')[0];

        // Update item stock and dates
        const itemUpdate = { stock: newStock };
        if (type === 'masuk') {
            itemUpdate.lastInDate = transDate;
        } else if (type === 'keluar') {
            itemUpdate.lastOutDate = transDate;
        }

        if (isDemoMode) {
            // Mode Lokal
            setItems(prev => prev.map(i => i.id === item.id ? { ...i, ...itemUpdate } : i));
            
            const newTrans = {
                id: 'trans-' + Date.now(),
                type,
                itemId: item.id,
                itemName: item.name,
                barcode: item.barcode || '',
                date: transDate,
                qty: transQty,
                previousStock: currentStock,
                newStock: newStock,
                notes,
                timestamp: Date.now()
            };
            setTransactions(prev => [...prev, newTrans]);
            return;
        }

        const itemRef = doc(db, 'artifacts', appId, 'users', user.uid, 'items', item.id);
        await updateDoc(itemRef, itemUpdate);

        // Add transaction log
        const transRef = collection(db, 'artifacts', appId, 'users', user.uid, 'transactions');
        await addDoc(transRef, {
            type,
            itemId: item.id,
            itemName: item.name,
            barcode: item.barcode || '',
            date: transDate,
            qty: transQty,
            previousStock: currentStock,
            newStock: newStock,
            notes,
            timestamp: Date.now()
        });
    };

    const handleSaveTransactionManual = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const type = modalConfig.type; 
        const itemId = formData.get('itemId');
        const date = formData.get('date');
        const notes = formData.get('notes') || '';
        const inputQty = parseInt(formData.get('qty'), 10);

        if (!itemId || !date || isNaN(inputQty)) {
            return setErrorMsg("Harap isi semua field yang wajib");
        }

        const selectedItem = items.find(i => i.id === itemId);
        if (!selectedItem) return setErrorMsg("Barang tidak ditemukan");

        try {
            await processTransaction(type, selectedItem, inputQty, notes, date);
            handleCloseModal();
            showSuccess(`Transaksi barang ${type} manual berhasil dicatat.`);
        } catch (err) {
            setErrorMsg(err.message || "Gagal memproses transaksi.");
        }
    };

    const handleBarcodeScan = async (e, type) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (isScanning) return; // Prevent double scan
            
            const scannedBarcode = e.target.value.trim();
            if (!scannedBarcode) return;

            setIsScanning(true);
            const item = items.find(i => i.barcode === scannedBarcode);
            
            if (!item) {
                setErrorMsg(`⚠️ Barcode "${scannedBarcode}" tidak ditemukan di Data Barang.`);
                e.target.value = '';
                setIsScanning(false);
                return;
            }

            try {
                // Auto process 1 quantity per scan
                await processTransaction(type, item, 1, `Auto Scan Barcode`, new Date().toISOString().split('T')[0]);
                showSuccess(`✅ Berhasil scan 1x ${item.name} (${type.toUpperCase()})`);
                setErrorMsg('');
            } catch(err) {
                setErrorMsg(`⚠️ ${err.message}`);
            } finally {
                e.target.value = '';
                setIsScanning(false);
            }
        }
    };

    const exportToCSV = () => {
        const headers = ['Barcode/SKU', 'Nama Barang', 'Kategori', 'Penyedia', 'Harga Satuan', 'Sisa Stok', 'Total Harga', 'Tgl Masuk Terakhir', 'Tgl Keluar Terakhir'];
        const csvRows = [];
        
        // Add BOM for UTF-8 Excel compatibility
        csvRows.push('\uFEFF' + headers.join(','));
        
        items.forEach(item => {
            const row = [
                `"${item.barcode || '-'}"`,
                `"${item.name}"`,
                `"${item.category || '-'}"`,
                `"${item.supplier || '-'}"`,
                item.price,
                item.stock,
                item.price * item.stock,
                `"${item.lastInDate ? formatDate(item.lastInDate) : '-'}"`,
                `"${item.lastOutDate ? formatDate(item.lastOutDate) : '-'}"`
            ];
            csvRows.push(row.join(','));
        });
        
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_Persediaan_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const renderModal = () => {
        if (!modalConfig.isOpen) return null;

        const isItemForm = modalConfig.type === 'newItem';
        const isTransactionForm = ['masuk', 'keluar', 'opname'].includes(modalConfig.type);
        const title = {
            'newItem': 'Tambah Data Barang (Master)',
            'masuk': 'Input Manual Barang Masuk',
            'keluar': 'Input Manual Barang Keluar',
            'opname': 'Stok Opname (Penyesuaian)'
        }[modalConfig.type];

        const todayDate = new Date().toISOString().split('T')[0];

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                    <div className="bg-green-700 px-6 py-4 flex justify-between items-center text-white">
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <button onClick={handleCloseModal} className="text-white hover:text-gray-200 focus:outline-none text-2xl leading-none">&times;</button>
                    </div>
                    
                    <form onSubmit={isItemForm ? handleSaveItem : handleSaveTransactionManual} className="p-6">
                        {errorMsg && (
                            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
                                {errorMsg}
                            </div>
                        )}

                        {isItemForm && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Barcode / SKU</label>
                                    <input name="barcode" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="Scan barcode atau ketik manual..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang *</label>
                                    <input name="name" type="text" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="Cth: Kertas A4" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                    <input name="category" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="Cth: ATK" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Penyedia (Supplier)</label>
                                    <input name="supplier" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="Cth: PT Makmur Jaya" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan (Rp)</label>
                                    <input name="price" type="number" min="0" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="0" />
                                </div>
                            </div>
                        )}

                        {isTransactionForm && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                                    <input name="date" type="date" required defaultValue={todayDate} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Barang *</label>
                                    <select name="itemId" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white">
                                        <option value="">-- Pilih Barang --</option>
                                        {items.map(item => (
                                            <option key={item.id} value={item.id}>{item.barcode ? `[${item.barcode}] ` : ''}{item.name} (Sisa: {item.stock})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {modalConfig.type === 'opname' ? 'Stok Fisik Aktual *' : 'Jumlah *'}
                                    </label>
                                    <input name="qty" type="number" min="0" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                                    <input name="notes" type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" placeholder={modalConfig.type === 'opname' ? "Alasan selisih..." : "Manual Input / Referensi..."} />
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors">Batal</button>
                            <button type="submit" className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700 font-medium shadow-sm transition-colors">Simpan</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderTable = (headers, rows) => (
        <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm bg-white">
            <table className="min-w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-300 sticky top-0">
                    <tr>
                        <th className="w-10 px-4 py-3 text-center text-gray-500 font-medium border-r border-gray-200">#</th>
                        {headers.map((h, i) => (
                            <th key={i} className={`px-4 py-3 text-gray-700 font-semibold border-r border-gray-200 last:border-r-0 ${h.align === 'right' ? 'text-right' : ''}`}>
                                {h.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length + 1} className="px-4 py-8 text-center text-gray-400 italic bg-white">
                                Belum ada data
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 hover:bg-green-50 transition-colors">
                                <td className="px-4 py-3 text-center text-gray-400 border-r border-gray-100">{i + 1}</td>
                                {headers.map((h, j) => (
                                    <td key={j} className={`px-4 py-3 border-r border-gray-100 last:border-r-0 ${h.align === 'right' ? 'text-right' : ''}`}>
                                        {row[h.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    const renderScannerInput = (type) => (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-4 transition-shadow hover:shadow-md">
            <div className={`p-3 rounded-full text-white ${type === 'masuk' ? 'bg-blue-500' : 'bg-orange-500'}`}>
                <IconBarcode className="w-8 h-8" />
            </div>
            <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Mode Scanner Barcode ({type.toUpperCase()})
                </label>
                <input
                    type="text"
                    autoFocus
                    autoComplete="off"
                    disabled={isScanning}
                    className="w-full text-lg border-b-2 border-gray-300 focus:border-green-500 focus:outline-none py-2 transition-colors bg-transparent disabled:opacity-50"
                    placeholder="Arahkan scanner dan tembak barcode di sini... (Otomatis memproses 1 Qty)"
                    onKeyDown={(e) => handleBarcodeScan(e, type)}
                />
                <p className="text-xs text-gray-400 mt-1">Pastikan kursor berada di kotak ini saat menggunakan scanner fisik.</p>
            </div>
        </div>
    );

    const renderTabContent = () => {
        if (loading) return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );

        switch (activeTab) {
            case 'data_barang':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <IconDatabase /> Data Barang (Master)
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Kelola daftar barang dan registrasi barcode baru beserta penyedia.</p>
                            </div>
                            <button onClick={() => setModalConfig({ isOpen: true, type: 'newItem' })} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-transform transform hover:scale-105">
                                + Tambah Barang
                            </button>
                        </div>
                        {renderTable([
                            { label: 'Barcode/SKU', key: 'barcode' },
                            { label: 'Nama Barang', key: 'name' },
                            { label: 'Kategori', key: 'category' },
                            { label: 'Penyedia', key: 'supplier' },
                            { label: 'Harga Satuan', key: 'price', align: 'right' },
                            { label: 'Total Harga', key: 'total', align: 'right' },
                        ], items.map(item => ({
                            barcode: item.barcode ? <span className="font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{item.barcode}</span> : '-',
                            name: <span className="font-medium text-gray-800">{item.name}</span>,
                            category: <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{item.category || '-'}</span>,
                            supplier: item.supplier || '-',
                            price: formatRupiah(item.price),
                            total: <span className="font-semibold text-green-700">{formatRupiah(item.price * item.stock)}</span>,
                        })))}
                    </div>
                );
            case 'persediaan':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                                    <IconBox /> Laporan Persediaan
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">Pantau sisa stok barang terkini dan riwayat tanggal pergerakan.</p>
                            </div>
                            <button onClick={exportToCSV} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium transition">
                                <IconDownload /> Export Excel/CSV
                            </button>
                        </div>
                        {renderTable([
                            { label: 'Barcode', key: 'barcode' },
                            { label: 'Nama Barang', key: 'name' },
                            { label: 'Penyedia', key: 'supplier' },
                            { label: 'Harga Satuan', key: 'price', align: 'right' },
                            { label: 'Sisa Stok', key: 'stock', align: 'right' },
                            { label: 'Total Harga', key: 'total', align: 'right' },
                            { label: 'Tgl Masuk Terakhir', key: 'lastIn' },
                            { label: 'Tgl Keluar Terakhir', key: 'lastOut' },
                        ], items.map(item => ({
                            barcode: item.barcode || '-',
                            name: <span className="font-medium text-gray-800">{item.name}</span>,
                            supplier: item.supplier || '-',
                            price: formatRupiah(item.price),
                            stock: <span className={`font-bold px-2 py-1 rounded text-sm ${item.stock <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{item.stock}</span>,
                            total: formatRupiah(item.price * item.stock),
                            lastIn: item.lastInDate ? <span className="text-blue-600">{formatDate(item.lastInDate)}</span> : '-',
                            lastOut: item.lastOutDate ? <span className="text-orange-600">{formatDate(item.lastOutDate)}</span> : '-'
                        })))}
                    </div>
                );
            case 'masuk':
                const transMasuk = getTransactionsByType('masuk');
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><IconArrowDownRight/> Proses Barang Masuk</h2>
                            <button onClick={() => setModalConfig({ isOpen: true, type: 'masuk' })} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium transition">
                                + Input Manual
                            </button>
                        </div>
                        
                        {renderScannerInput('masuk')}
                        {errorMsg && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-sm text-sm">{errorMsg}</div>}

                        <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-8 border-b pb-2">Riwayat Barang Masuk</h3>
                        {renderTable([
                            { label: 'Tanggal', key: 'date' },
                            { label: 'Barcode', key: 'barcode' },
                            { label: 'Barang', key: 'item' },
                            { label: 'Jumlah Masuk', key: 'qty', align: 'right' },
                            { label: 'Catatan', key: 'notes' },
                        ], transMasuk.map(t => ({
                            date: formatDate(t.date),
                            barcode: t.barcode || '-',
                            item: <span className="font-medium">{t.itemName}</span>,
                            qty: <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">+{t.qty}</span>,
                            notes: t.notes || '-'
                        })))}
                    </div>
                );
            case 'keluar':
                const transKeluar = getTransactionsByType('keluar');
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><IconArrowUpRight/> Proses Barang Keluar</h2>
                            <button onClick={() => setModalConfig({ isOpen: true, type: 'keluar' })} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium transition">
                                - Input Manual
                            </button>
                        </div>
                        
                        {renderScannerInput('keluar')}
                        {errorMsg && <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-sm text-sm">{errorMsg}</div>}

                        <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-8 border-b pb-2">Riwayat Barang Keluar</h3>
                        {renderTable([
                            { label: 'Tanggal', key: 'date' },
                            { label: 'Barcode', key: 'barcode' },
                            { label: 'Barang', key: 'item' },
                            { label: 'Jumlah Keluar', key: 'qty', align: 'right' },
                            { label: 'Catatan', key: 'notes' },
                        ], transKeluar.map(t => ({
                            date: formatDate(t.date),
                            barcode: t.barcode || '-',
                            item: <span className="font-medium">{t.itemName}</span>,
                            qty: <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">-{t.qty}</span>,
                            notes: t.notes || '-'
                        })))}
                    </div>
                );
            case 'opname':
                const transOpname = getTransactionsByType('opname');
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><IconRefresh/> Riwayat Stok Opname</h2>
                            <button onClick={() => setModalConfig({ isOpen: true, type: 'opname' })} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg shadow-sm text-sm font-medium transition">
                                Lakukan Penyesuaian
                            </button>
                        </div>
                        {renderTable([
                            { label: 'Tanggal', key: 'date' },
                            { label: 'Barang', key: 'item' },
                            { label: 'Stok Sistem', key: 'prev', align: 'right' },
                            { label: 'Stok Fisik', key: 'new', align: 'right' },
                            { label: 'Selisih', key: 'diff', align: 'right' },
                            { label: 'Keterangan', key: 'notes' },
                        ], transOpname.map(t => ({
                            date: formatDate(t.date),
                            item: <span className="font-medium">{t.itemName}</span>,
                            prev: t.previousStock,
                            new: t.newStock,
                            diff: <span className={`font-bold px-2 py-1 rounded text-sm ${t.qty < 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{t.qty > 0 ? `+${t.qty}` : t.qty}</span>,
                            notes: t.notes || '-'
                        })))}
                    </div>
                );
            case 'kartu':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><IconClipboard/> Kartu Stok (Semua Transaksi)</h2>
                            <p className="text-sm text-gray-500 mt-1">Menampilkan riwayat lengkap pergerakan stok semua barang.</p>
                        </div>
                        {renderTable([
                            { label: 'Tanggal', key: 'date' },
                            { label: 'Jenis', key: 'type' },
                            { label: 'Barang', key: 'item' },
                            { label: 'Perubahan', key: 'change', align: 'right' },
                            { label: 'Sisa Stok Akhir', key: 'final', align: 'right' },
                        ], sortedTransactions.map(t => {
                            let typeLabel = '';
                            let changeLabel = '';
                            if (t.type === 'masuk') { typeLabel = <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">Masuk</span>; changeLabel = <span className="text-green-600">+{t.qty}</span>; }
                            else if (t.type === 'keluar') { typeLabel = <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold">Keluar</span>; changeLabel = <span className="text-red-600">-{t.qty}</span>; }
                            else if (t.type === 'opname') { typeLabel = <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-semibold">Opname</span>; changeLabel = <span className={t.qty < 0 ? 'text-red-600' : 'text-green-600'}>{t.qty > 0 ? `+${t.qty}` : t.qty}</span>; }
                            
                            return {
                                date: formatDate(t.date),
                                type: typeLabel,
                                item: <span className="font-medium">{t.itemName}</span>,
                                change: <span className="font-bold">{changeLabel}</span>,
                                final: <span className="font-semibold text-gray-800">{t.newStock}</span>
                            };
                        }))}
                    </div>
                );
            case 'jadikan_apk':
                return (
                    <div className="animate-fade-in max-w-3xl">
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2"><IconSmartphone/> Jadikan Aplikasi (APK) & Online</h2>
                            <p className="text-sm text-gray-500 mt-1">Panduan menggunakan sistem ini seperti aplikasi native di HP Anda dan cara meng-online-kan nya.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                    Install Langsung di HP (PWA / Tanpa APK)
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    Aplikasi ini telah dimodifikasi menjadi responsif dan mendukung PWA (Progressive Web App). Anda tidak perlu mendownload file APK yang rawan virus. Cukup tambahkan web ini ke layar utama HP Anda:
                                </p>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
                                    <li><strong>Android (Chrome):</strong> Buka link web preview ini di Google Chrome HP Anda &gt; Klik ikon titik tiga (⋮) di pojok kanan atas &gt; Pilih menu <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</li>
                                    <li><strong>iPhone (Safari):</strong> Buka link web preview ini di Safari iOS &gt; Klik ikon Share (kotak dengan panah atas) di bagian bawah &gt; Pilih menu <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.</li>
                                </ul>
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 text-sm">
                                    💡 <strong>Keuntungan:</strong> Aplikasi akan muncul di laci menu HP Anda dengan ikon sendiri persis seperti APK biasa, layar akan full-screen (tanpa address bar browser), dan langsung terhubung online!
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="bg-green-100 text-green-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                    Hosting Publik (Buat Link Domain Sendiri)
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                    Jika Anda ingin mempublikasikannya agar karyawan Anda bisa mengakses dari link khusus (misal: <em>inventori.vercel.app</em>):
                                </p>
                                <ul className="list-decimal list-inside text-sm text-gray-600 space-y-2 ml-2">
                                    <li>Copy seluruh kode dari editor di samping.</li>
                                    <li>Buat akun di layanan hosting gratis seperti <strong>Vercel.com</strong>, <strong>Netlify.com</strong>, atau Github Pages.</li>
                                    <li>Deploy kode React ini, dan aplikasi Anda akan online 24 jam dengan URL khusus milik Anda.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const navItems = [
        { id: 'data_barang', label: 'Data Barang', icon: <IconDatabase /> },
        { id: 'persediaan', label: 'Laporan Persediaan', icon: <IconBox /> },
        { id: 'masuk', label: 'Barang Masuk', icon: <IconArrowDownRight /> },
        { id: 'keluar', label: 'Barang Keluar', icon: <IconArrowUpRight /> },
        { id: 'opname', label: 'Stok Opname', icon: <IconRefresh /> },
        { id: 'kartu', label: 'Kartu Stok', icon: <IconClipboard /> },
        { id: 'jadikan_apk', label: 'Panduan APK & Web', icon: <IconSmartphone /> },
    ];

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Memuat sistem...</p>
                </div>
            </div>
        );
    }

    // Login Screen for unauthenticated users
    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-green-100 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <IconBox />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">Sistem Inventori</h1>
                    <p className="text-gray-500 mb-8">Silakan masuk untuk mengakses panel manajemen barang Anda.</p>
                    
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl shadow-sm text-base font-semibold transition-all duration-200"
                    >
                        <IconGoogle />
                        Masuk dengan Google
                    </button>
                    
                    <p className="text-xs text-gray-400 mt-8">Akses aman dilindungi oleh Firebase Auth</p>
                </div>
            </div>
        );
    }

    // Main Dashboard for authenticated users
    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden relative">
            
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-50 shadow-2xl md:shadow-[2px_0_8px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out`}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-600 text-white p-2 rounded-lg">
                            <IconBox />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                            InventoriKu
                        </h1>
                    </div>
                    <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu Utama</div>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { 
                                setActiveTab(item.id); 
                                setErrorMsg(''); 
                                setIsMobileMenuOpen(false); 
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === item.id 
                                ? 'bg-green-50 text-green-700 shadow-sm' 
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className={activeTab === item.id ? 'text-green-600' : 'text-gray-400'}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
                
                {/* User Profile & Logout section in sidebar */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <img 
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} 
                            alt="Profile" 
                            className="w-10 h-10 rounded-full border border-gray-300"
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{user.displayName || 'Pengguna'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email || 'Tanpa Email'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-600 px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors"
                    >
                        <IconLogout /> Keluar
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
                {/* Header (Top Bar) */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between md:justify-start px-4 md:px-8 shadow-sm z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                        <button 
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none" 
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <IconMenu />
                        </button>
                        <span className={`text-xs md:text-sm font-medium px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center gap-2 ${isDemoMode ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                            <span className="hidden md:inline">{isDemoMode ? 'Mode Demo Lokal (Bypass Firebase)' : 'Sistem Terhubung (Online)'}</span>
                            <span className="md:inline hidden"></span>
                            <span className="md:hidden inline">{isDemoMode ? 'Demo Lokal' : 'Online'}</span>
                        </span>
                    </div>
                    {/* Toast Notification Top Right */}
                    {successMsg && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-100 border border-green-400 text-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-sm text-xs md:text-sm animate-pulse flex items-center gap-2 z-50">
                            <svg className="w-4 h-4 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            <span className="font-medium whitespace-nowrap">{successMsg}</span>
                        </div>
                    )}
                </header>

                {/* Tab Content Canvas */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa] p-4 md:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {renderTabContent()}
                    </div>
                </main>
            </div>

            {/* Modals Component */}
            {renderModal()}
            
            {/* Global Styles for Animations */}
            <style dangerouslySetInnerHTML={{__html: `
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            `}} />
        </div>
    );
}
