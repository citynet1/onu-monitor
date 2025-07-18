'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OnuData, OnuDataRegister, OnuDetail } from '../types';
import OnuFilterForm from '../components/onu/OnuFilterForm';
import OnuTable from '../components/onu/OnuTable';
import OnuDetailModal from '../components/onu/OnuDetailModal';
import OnuRegisterModal from '@/components/onu/OnuRegisterModal';
import { useRouter } from 'next/navigation';
import OnuUnregisterModal from '@/components/onu/OnuUnregisterModal';
import BaseUrlModal from '@/components/BaseUrlModal';

export default function OnuPage() {
  const [data, setData] = useState<OnuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState(1);
  const [pon, setPon] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [detail, setDetail] = useState<OnuDetail | null>(null);
  const [registerData, setRegisterData] = useState<OnuDataRegister | null>(null);
  const [isRebooting, setIsRebooting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);
  const [showBaseUrlModal, setShowBaseUrlModal] = useState(false);
  const [baseURL, setBaseURL] = useState('http://113.192.12.120:8081');

  const router = useRouter();

  const fetchData = async (selectedBoard: number, selectedPon: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/v1/board/${selectedBoard}/pon/${selectedPon}`);
      setData(res.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('loggedIn');
    if (isLoggedIn !== 'true') {
      router.push('/login');
    }
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('baseURL') || 'http://113.192.12.120:8081';
      setBaseURL(savedUrl);
    }
    fetchData(board, pon);
  }, [board, pon, router]);

  const handleDetail = async (onu_id: number) => {
    try {
      const res = await axios.get(`${baseURL}/api/v1/board/${board}/pon/${pon}/onu/${onu_id}`);
      setDetail(res.data.data);
    } catch (error) {
      console.error('Gagal mengambil detail ONU:', error);
    }
  };

  const handleRegister = (onu: OnuDataRegister) => {
    setRegisterData(onu);
  };

  const handleRefresh = () => {
    fetchData(board, pon);
  };

  const handleReboot = (onu_id: number) => {
    if (isRebooting) return; // mencegah double click
    if (!window.confirm(`Yakin reboot ONU ID ${onu_id}?`)) return;

    setIsRebooting(true);

    fetch(`${baseURL}/api/v1/onu/reboot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        olt_index: `gpon-olt_1/${board}/${pon}`,
        onu: onu_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          alert('✅ Reboot berhasil');
        } else {
          alert(`⚠️ Gagal reboot: ${data.status}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('❌ Terjadi kesalahan saat reboot.');
      })
      .finally(() => {
        setIsRebooting(false);
      });
  };

  const handleRemove = (onu_id: number) => {
    if (isRemoving) return; // mencegah double click
    if (!window.confirm(`Yakin remove ONU ID ${onu_id}?`)) return;

    setIsRemoving(true);

    fetch(`${baseURL}/api/v1/onu/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        olt_index: `gpon-olt_1/${board}/${pon}`,
        onu: onu_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          alert('✅ Remove berhasil');
        } else {
          alert(`⚠️ Gagal remove: ${data.status}`);
        }
      })
      .catch((err) => {
        console.error(err);
        alert('❌ Terjadi kesalahan saat remove.');
      })
      .finally(() => {
        setIsRemoving(false);
      });
  };


  return (
    <div className="p-6 bg-gray-800 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto bg-gray-800 text-white rounded-md shadow-md p-6">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
	    <img 
              src="/assets/images/logo.png" // atau nama asli jika tidak diganti
	      alt="Logo"
              className="w-10 h-10 rounded-full object-cover shadow"
            />
	    Monitoring Status ONU - Board {board} / PON {pon}
          </h1> 

          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="bg-green-600 text-white text-sm cursor-pointer px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </button>

            <button
              onClick={() => setShowUnregisterModal(true)}
              className="bg-yellow-500 text-white text-sm cursor-pointer px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Cek Unregister
            </button>

            <button
              onClick={() => setShowBaseUrlModal(true)}
              className="bg-blue-600 text-white text-sm cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Setting
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('loggedIn');
                router.push('/login');
              }}
              className="text-sm bg-red-400 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <OnuFilterForm
          board={board}
          pon={pon}
          statusFilter={statusFilter}
          search={search}
          onBoardChange={setBoard}
          onPonChange={setPon}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearch}
        />

        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Memuat data...</div>
        ) : (
          <OnuTable data={data} search={search} statusFilter={statusFilter} onDetail={handleDetail} onRegister={handleRegister} onReboot={handleReboot} onRemove={handleRemove} />
        )}
      </div>

      {detail && <OnuDetailModal detail={detail} onClose={() => setDetail(null)} />}
      {registerData && (
        <OnuRegisterModal
          board={board}
          pon={pon}
          data={registerData}
          onClose={() => setRegisterData(null)}
          onSuccess={() => fetchData(board, pon)}
        />
      )}

      {showUnregisterModal && (
        <OnuUnregisterModal onClose={() => setShowUnregisterModal(false)} />
      )}

      {showBaseUrlModal && (
        <BaseUrlModal onClose={() => setShowBaseUrlModal(false)} onSave={() => fetchData(board, pon)} />
      )}

    </div>
  );
}