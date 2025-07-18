import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OnuDataRegister } from '../../types';

interface Props {
    board: number;
    pon: number;
    data: OnuDataRegister;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function OnuRegisterModal({ board, pon, data, onClose, onSuccess }: Props) {
    const [serialNumber, setSerialNumber] = useState(data.serial_number || '');
    const [region, setRegion] = useState(data.region || '');
    const [code, setCode] = useState(data.code || '');
    const [vlanId, setVlanId] = useState(data.vlan_id || '');
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ New state
    const [baseURL, setBaseURL] = useState('http://113.192.12.120:8081');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedURL = localStorage.getItem('baseURL') || 'http://113.192.12.120:8081';
            setBaseURL(savedURL);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true); // ✅ Disable tombol

        const payload = {
            olt_index: `gpon-olt_1/${board}/${pon}`,
            serial_number: serialNumber,
            region: region,
            code: code,
            onu: data.onu_id,
            vlan_id: Number(vlanId),
        };

        try {
            await axios.post(`${baseURL}/api/v1/onu/register`, payload);
            alert('Registrasi berhasil!');
            onClose();
            onSuccess?.();
        } catch (err) {
            console.error(err);
            alert('Gagal registrasi.');
        } finally {
            setIsSubmitting(false); // ✅ Aktifkan kembali tombol
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-xl p-6 max-w-2xl w-full relative animate-fadeIn">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Registrasi ONU</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">OLT Index</label>
                        <input
                            type="text"
                            value={`gpon-olt_${board}/1/${pon}`}
                            readOnly
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">Vlan ID</label>
                        <input
                            type="number"
                            value={vlanId}
                            onChange={(e) => setVlanId(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">Serial Number</label>
                        <input
                            type="text"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">ID Pelanggan</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">Deskripsi/Wilayah</label>
                        <input
                            type="text"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 text-black dark:text-white bg-white dark:bg-gray-800 rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 rounded transition text-white ${isSubmitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Memproses...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}