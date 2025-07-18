import React from 'react';
import { OnuData, OnuDataRegister } from '../../types';
import { statusStyles, getRxPowerColor } from './OnuStatusBadge';

interface Props {
    data: OnuData[];
    search: string;
    statusFilter: string;
    onDetail: (onu_id: number) => void;
    onRegister: (onu: OnuDataRegister) => void;
    onReboot: (onu_id: number) => void;
    onRemove: (onu_id: number) => void;
}

export default function OnuTable({ data, search, statusFilter, onDetail, onRegister, onReboot, onRemove }: Props) {
    const matchSearch = (f?: string) => f?.toLowerCase().includes(search.toLowerCase()) ?? false;

    return (
        <div className="overflow-x-auto max-h-[600px] overflow-y-scroll rounded border border-gray-600">
            <table className="min-w-full text-sm text-left text-white bg-gray-900">
                <thead className="bg-gray-800 text-xs uppercase sticky top-0 z-10 text-white">
                    <tr>
                        <th className="px-4 py-3">ONU ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Serial</th>
                        <th className="px-4 py-3 text-right">RX Power</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 128 }, (_, i) => {
                        const onu_id = i + 1;
                        const onu = data.find((d) => d.onu_id === onu_id);

                        if (onu && (matchSearch(onu.name) || matchSearch(onu.serial_number) || !search)) {
                            if (statusFilter === 'All' || onu.status === statusFilter) {
                                const style = statusStyles[onu.status] || statusStyles['Unknown'];
                                return (
                                    <tr key={onu_id} className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition text-white">
                                        <td className="px-4 py-2">{onu.onu_id}</td>
                                        <td className="px-4 py-2">{onu.name}</td>
                                        <td className="px-4 py-2">{onu.onu_type || '-'}</td>
                                        <td className="px-4 py-2">{onu.serial_number}</td>
                                        <td className={`px-4 py-2 text-right font-medium ${getRxPowerColor(onu.rx_power)}`}>{onu.rx_power}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${style.badgeClass}`}>{onu.status}</span>
                                        </td>
                                        <td className="px-4 py-2 text-center space-x-1">
                                            <button
                                                onClick={() => onDetail(onu.onu_id)}
                                                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs transition cursor-pointer"
                                            >
                                                Detail
                                            </button>
                                            <button
                                                onClick={() => onReboot(onu.onu_id)}
                                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700 text-xs transition cursor-pointer"
                                            >
                                                Reboot
                                            </button>
                                            <button
                                                onClick={() => onRemove(onu.onu_id)}
                                                className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-400 text-xs transition cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }
                        } else if (!search && (statusFilter === 'All' || statusFilter === 'Empty')) {
                            return (
                                <tr key={onu_id} className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition text-white">
                                    <td className="px-4 py-2">{onu_id}</td>
                                    <td className="px-4 py-2 text-gray-500 dark:text-gray-400 italic">-</td>
                                    <td className="px-4 py-2 text-gray-500 dark:text-gray-400 italic">-</td>
                                    <td className="px-4 py-2 text-gray-500 dark:text-gray-400 italic">-</td>
                                    <td className="px-4 py-2 text-right text-gray-500 dark:text-gray-400 italic">-</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">Empty</span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => onRegister({ onu_id })}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs transition cursor-pointer focus:outline-none"
                                        >
                                            Register
                                        </button>
                                    </td>
                                </tr>
                            );
                        }
                        return null;
                    })}
                </tbody>
            </table>
        </div>
    );
}