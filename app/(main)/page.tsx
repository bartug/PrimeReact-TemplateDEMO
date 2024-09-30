/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DriverService } from '../../demo/service/DriverService';
import { LayoutContext } from '../../layout/context/layoutcontext';
import { Demo } from '@/types';
import { ChartData, ChartOptions } from 'chart.js';

const Dashboard = () => {
    const [drivers, setDrivers] = useState<Demo.DriverSmall[]>([]);
    const menu1 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        DriverService.getDriversSmall().then((data) => setDrivers(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const statusBodyTemplate = (rowData: Demo.DriverSmall) => {
        return (
            <Badge
                value={rowData.status === 'Active' ? 'Aktif' : 'Pasif'}
                severity={rowData.status === 'Active' ? 'success' : 'danger'}
            />
        );
    };

    const iconTemplate = () => (
        <Button icon="pi pi-search" className="p-button-text" style={{ color: '#F79C3B' }} />
    );

    return (
        <div className="grid">
            {/* Dashboard üstündeki kartlar */}
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Toplam Satış</span>
                            <div className="text-900 font-medium text-xl">₺25,000</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Toplam POS Sayısı</span>
                            <div className="text-900 font-medium text-xl">420</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-credit-card text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">İldeki Taksici Sayısı</span>
                            <div className="text-900 font-medium text-xl">1200</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-cyan-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">İlçedeki Taksici Sayısı</span>
                            <div className="text-900 font-medium text-xl">300</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-purple-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Diğer içerik */}
            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Kadıköy İlçesinde Şofor Gelirleri</h5>
                    <DataTable value={drivers} rows={5} paginator responsiveLayout="scroll">
                        <Column field="name" header="İsim" sortable style={{ width: '35%' }} />
                        <Column field="earnings" header="Kazanç" sortable style={{ width: '35%' }} body={(data) => formatCurrency(data.earnings)} />
                        <Column header="Detay" style={{ width: '15%' }} body={iconTemplate} />
                    </DataTable>
                </div>

                {/* Aynı Duraktaki Kişilerin Gelirlerini Karşılaştırma */}
                <div className="card">
                    <h5>Kadıköy İlçesindeki Şoförlerin Gelir Karşılaştırması</h5>
                    <Chart type="line" data={lineDataSameStation} options={lineOptions} />
                </div>
            </div>

            <div className="col-12 xl:col-6">
                {/* Aynı İldeki Kişilerin Gelir Karşılaştırması */}
                <div className="card">
                    <h5>İstanbul Şoförlerinin Gelir Karşılaştırması</h5>
                    <Chart type="line" data={lineDataSameCity} options={lineOptions} />
                </div>

                <div className="card">
                    <h5>Kadıköy Pos Durumları</h5>
                    <DataTable value={drivers} rows={5} paginator responsiveLayout="scroll">
                        <Column field="name" header="İsim" sortable style={{ width: '35%' }} />
                        <Column field="status" header="Durum" body={statusBodyTemplate} style={{ width: '35%' }} />
                        <Column header="Detay" style={{ width: '15%' }} body={iconTemplate} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

// Aynı duraktaki şoförlerin gelir verisi
const lineDataSameStation: ChartData = {
    labels: ['Şoför 1', 'Şoför 2', 'Şoför 3', 'Şoför 4'],
    datasets: [
        {
            label: 'Gelir',
            data: [3000, 5000, 7000, 6000],
            backgroundColor: '#FFC107',
            borderColor: '#FF9800',
            fill: false,
            tension: 0.4
        }
    ]
};

// Aynı ildeki şoförlerin gelir verisi
const lineDataSameCity: ChartData = {
    labels: ['Kadıköy', 'Maltepe', 'Üsküdar', 'Beşiktaş'],
    datasets: [
        {
            label: 'Gelir',
            data: [35000, 25000, 40000, 20000],
            backgroundColor: '#03A9F4',
            borderColor: '#0288D1',
            fill: false,
            tension: 0.4
        }
    ]
};

export default Dashboard;
