'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { DriverService } from '@/demo/service/DriverService';
import { Demo } from '@/types';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tooltip } from 'primereact/tooltip';
import { types } from 'sass';
import Null = types.Null;
import { Card } from 'primereact/card';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
const DriverList = () => {
    const emptyDriver: Demo.Driver = {
        id: undefined,
        tcNo: '',
        firstName: '',
        lastName: '',
        phone: null,
        birthDate: null,
        emergencyContactName: '',
        emergencyContactPhone: null,
        city: '',
        district: '',
        fullAddress: '',
        tpContractNo: '',
        odealContractNo: '',
        paramCardNo: '',
        password: '',
        posNo: null

    };

    const [drivers, setDrivers] = useState<Demo.Driver[]>([]);
    const [driverDialog, setDriverDialog] = useState(false);
    const [deleteDriverDialog, setDeleteDriverDialog] = useState(false);
    const [driver, setDriver] = useState<Demo.Driver>(emptyDriver);
    const [selectedDrivers, setSelectedDrivers] = useState<null>();
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState<DataTableFilterMeta>({});
    const [loading, setLoading] = useState(true);
    const [isTcValid, setIsTcValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);

    // Şehir ve İlçe verileri
    const cities = [
        { name: 'İstanbul', districts: ['Kadıköy', 'Pendik'] },
        { name: 'İzmir', districts: ['Buca', 'Karşıyaka'] },
        { name: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı'] },
    ];

    useEffect(() => {
        loadDrivers();
        initFilters();
        setLoading(false);
    }, []);

    const loadDrivers = async () => {
        try {
            const response = await DriverService.getDrivers();
            // Tarihleri formatlamak için `getCustomers` fonksiyonunu çağırıyoruz
            const formattedDrivers = formatDrivers(response);
            setDrivers(formattedDrivers);
        } catch (error) {
            console.error('Veri yükleme hatası:', error);
        }
    };

    const formatDrivers = (data:any) => {
        return [...(data || [])].map((d) => {
            // Tarihi 'Date' objesine dönüştürüyoruz
            d.birthDate = new Date(d.birthDate);
            return d;
        });
    };

    const validateTc = () => {
        if (driver.tcNo?.length === 11) {
            setIsTcValid(true);
        } else {
            setIsTcValid(false);
            toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'TC Kimlik Numarası 11 haneli olmalıdır.', life: 3000 });
        }
    };

    // Telefon kontrol fonksiyonu (örnek olarak alert)
    const validatePhone = () => {
        toast.current?.show({ severity: 'info', summary: 'Bilgi', detail: 'Telefon numarası doğrulandı.', life: 3000 });
        setIsPhoneValid(true);
    };
    const openNew = () => {
        setDriver(emptyDriver);
        setDriverDialog(true);
    };

    const hideDialog = () => {
        setDriverDialog(false);
    };

    const saveDriver = () => {
        if (isValidDriver(driver)) {
            let _drivers = [...drivers];

            if (driver.id) {
                const index = _drivers.findIndex(d => d.id === driver.id);
                _drivers[index] = driver;
                toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Sürücü Güncellendi', life: 3000 });
            } else {
                driver.id = createId();
                _drivers.push(driver);
                toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Sürücü Oluşturuldu', life: 3000 });
            }

            setDrivers(_drivers);
            setDriverDialog(false);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Hata', detail: 'Tüm alanları doldurmalısınız.', life: 3000 });
        }
    };


    const isValidDriver = (driver: Demo.Driver) => {
        return (
            driver.tcNo && driver.tcNo.length === 11 &&
            driver.firstName?.trim() &&
            driver.lastName?.trim() &&
            driver.phone !==null &&
            driver.emergencyContactName?.trim() &&
            driver.emergencyContactPhone!==null &&
           // driver.city?.trim() &&
          //  driver.district?.trim() &&
            driver.birthDate !== null
        );
    };

    const confirmDeleteDriver = (driver: Demo.Driver) => {
        setDriver(driver);
        setDeleteDriverDialog(true);
    };

    const deleteDriver = async () => {
        await DriverService.deleteDriver(driver.id!);
        let _drivers = drivers.filter(val => val.id !== driver.id);
        setDrivers(_drivers);
        setDeleteDriverDialog(false);
        toast.current?.show({ severity: 'success', summary: 'Başarılı', detail: 'Sürücü Silindi', life: 3000 });
    };

    const createId = () => {
        return Math.random();
    };

    const clearFilter = () => {
        initFilters();
    };
    const formatDate = (value: Date | string) => {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

// Tablo hücresinde tarihi göstermek için bodyTemplate fonksiyonu
    const dateBodyTemplate = (rowData:any) => {
        return formatDate(rowData.birthDate); // Burada doğrudan formatlanmış tarih string'i dönecek
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            'country.name': {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
            },
            balance: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            status: {
                operator: FilterOperator.OR,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
            },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters1 = { ...filters };
        (_filters1['global'] as any).value = value;
        console.log(_filters1);
        console.log(value)
        setFilters(_filters1);
        setGlobalFilterValue(value);
    };
    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h5 className="m-0">Şoför Listesi</h5>

                <div className="flex mt-2 md:mt-0">
                    {' '}
                    <Button
                        type="button"
                        className="p-button-outlined"
                        style={{
                            backgroundColor: 'transparent',
                            borderColor: '#FA9310',
                            color: '#FA9310'
                        }}
                        icon="pi pi-filter-slash"
                        outlined
                        onClick={clearFilter}
                    />
                    <span className="p-input-icon-left ml-2">
                        {' '}
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Ara.." />
                    </span>
                </div>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Driver) => {
        return (
            <>
                <Button
                    icon="pi pi-pencil"
                    severity="warning"
                    className="mr-2"
                    style={{
                        backgroundColor: 'white',
                        borderColor: '#FDC81A',
                        color: '#FDC81A'
                    }}
                    onClick={() => {
                        setDriver(rowData);
                        setDriverDialog(true);
                    }}
                />
                <Button
                    icon="pi pi-search"
                    //onClick={() => confirmDeleteDriver(rowData)}
                    severity="warning"
                    className="mr-2"
                    style={{
                        backgroundColor: 'white',
                        borderColor: '#FDC81A',
                        color: '#FDC81A'
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    onClick={() => confirmDeleteDriver(rowData)}
                    className="p-button-outlined"
                    style={{
                        backgroundColor: 'transparent',
                        borderColor: '#FA9310',
                        color: '#FA9310'
                    }}
                />
            </>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Yeni"
                    icon="pi pi-plus"

                    onClick={() => openNew()}
                    style={{ backgroundColor: '#FDC81A', borderColor: '#FDC81A' ,color: 'white' }}

                />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button
                    label="Dışa Aktar"
                    icon="pi pi-upload"

                    style={{ backgroundColor: '#FA9310', borderColor: '#FA9310' }}

                    onClick={exportCSV}
                />
            </React.Fragment>
        );
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const header1  = renderHeader();

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={drivers} paginator rows={10} globalFilter={globalFilterValue} header={header1} filters={filters} onFilter={(e) => setFilters(e.filters)} loading={loading} responsiveLayout="scroll">
                        <Column field="firstName" header="First Name" sortable filter filterPlaceholder="Search by first name" />
                        <Column field="lastName" header="Last Name" sortable filter filterPlaceholder="Search by last name" />
                        <Column field="phone" header="Phone" sortable filter filterPlaceholder="Search by phone" />
                        <Column field="birthDate" body={dateBodyTemplate} header="Birth Date" sortable filter dataType="date" />
                        <Column field="city" header="City" sortable filter filterPlaceholder="Search by city" />
                        <Column field="district" header="District" sortable filter filterPlaceholder="Search by district" />
                        <Column field="posNo" header="POS No" sortable filter filterPlaceholder="Search by POS no" />
                        <Column body={actionBodyTemplate} header="Actions" />
                    </DataTable>

                    <Dialog
                        visible={driverDialog}
                        style={{ width: '800px' }}
                        header="Sürücü Kayıt Ekranı"
                        footer={
                            <div className="flex justify-content-end">
                                <Button
                                    label="Kaydet"
                                    icon="pi pi-check"
                                    style={{
                                        backgroundColor: '#FDC81A', // Turuncu
                                        borderColor: '#FDC81A',
                                        color: 'white'
                                    }}
                                    onClick={saveDriver}
                                />
                                <Button
                                    label="İptal"
                                    icon="pi pi-times"
                                    className="mr-2"
                                    style={{
                                        backgroundColor: '#FA9310', // Kırmızı
                                        borderColor: '#FA9310',
                                        color: 'white'
                                    }}
                                    onClick={hideDialog}
                                />
                            </div>
                        }
                        onHide={hideDialog}
                    >
                        <div className="grid">
                            <div className="col-12">
                                <Card title="Kişisel Bilgiler">
                                    <div className="grid">
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="tcKimlikNo">T.C. Kimlik No</label>
                                                <div className="p-inputgroup">
                                                    <InputText
                                                        id="tcKimlikNo"
                                                        value={driver.tcNo}
                                                        onChange={(e) =>
                                                            setDriver({
                                                                ...driver,
                                                                tcNo: e.target.value.replace(/[^0-9]/g, ''),
                                                            })
                                                        }
                                                        maxLength={11}
                                                        style={{ width: '100%' }}
                                                        disabled={isTcValid}
                                                    />
                                                    <Button
                                                        icon="pi pi-sync"
                                                        className="p-button-success"
                                                        onClick={validateTc}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6"></div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="firstName">Ad</label>
                                                <InputText id="firstName" value={driver.firstName} onChange={(e) => setDriver({ ...driver, firstName: e.target.value })} required style={{ width: '100%' }}                                         disabled={!isTcValid}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="lastName">Soyad</label>
                                                <InputText id="lastName" value={driver.lastName} onChange={(e) => setDriver({ ...driver, lastName: e.target.value })} required style={{ width: '100%' }}                                         disabled={!isTcValid}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="phone">Telefon</label>
                                                <div className="p-inputgroup">
                                                <InputText
                                                    id="phone"
                                                    value={driver.phone ? driver.phone.toString() : ''}
                                                    onChange={(e) =>
                                                        setDriver({
                                                            ...driver,
                                                            phone: e.target.value ? Number(e.target.value.replace(/[^0-9]/g, '')) : null
                                                        })
                                                    }
                                                    required
                                                    style={{ width: '100%' }}
                                                    disabled={!isTcValid}

                                                />
                                                <Button  icon="pi pi-sync"
                                                         className="p-button-success" onClick={validatePhone} disabled={!isTcValid} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="birthDate">Doğum Tarihi</label>
                                                <Calendar id="birthDate"     showIcon
                                                          showButtonBar                                      disabled={!isTcValid}
                                                          value={driver.birthDate} onChange={(e) => setDriver({ ...driver, birthDate: e.value })} required style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="city">Şehir</label>
                                                <Dropdown
                                                    id="city"
                                                    value={driver.city || null}
                                                    options={cities}
                                                    optionLabel="name"
                                                    onChange={(e) => {
                                                        setDriver({
                                                            ...driver,
                                                            city: e.value ? e.value.name : '',
                                                            district: ''
                                                        });
                                                    }}
                                                    placeholder="Şehir Seçin"
                                                    required
                                                    disabled={!isTcValid}

                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="district">İlçe</label>
                                                <Dropdown
                                                    id="district"
                                                    value={driver.district || null}
                                                    options={
                                                        cities
                                                            .find((c) => c.name === driver.city)
                                                            ?.districts.map((d) => ({
                                                                label: d,
                                                                value: d
                                                            })) || []
                                                    }
                                                    onChange={(e) => setDriver({ ...driver, district: e.value })}
                                                    placeholder="İlçe Seçin"
                                                    required
                                                    disabled={!isTcValid&&!driver.city}
                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="emergencyContactPhone">Yakının Telefonu</label>
                                                <InputText
                                                    id="emergencyContactPhone"
                                                    value={driver.emergencyContactPhone ? driver.emergencyContactPhone.toString() : ''}
                                                    onChange={(e) =>
                                                        setDriver({
                                                            ...driver,
                                                            emergencyContactPhone: e.target.value ? Number(e.target.value.replace(/[^0-9]/g, '')) : null
                                                        })
                                                    }
                                                    required
                                                    disabled={!isTcValid}

                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="emergencyContactName">Yakının Adı</label>
                                                <InputText
                                                    id="emergencyContactName"
                                                    value={driver.emergencyContactName}
                                                    onChange={(e) =>
                                                        setDriver({
                                                            ...driver,
                                                            emergencyContactName: e.target.value
                                                        })
                                                    }
                                                    required
                                                    disabled={!isTcValid}

                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="col-12">
                                <Card title="Sözleşme Bilgileri">
                                    <div className="grid">
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="taksideposSozlesmeNo">Taksidepos Sözleşme No</label>
                                                <InputText
                                                    id="taksideposSozlesmeNo"
                                                    value={driver.tpContractNo}
                                                    onChange={(e) =>
                                                        setDriver({
                                                            ...driver,
                                                            tpContractNo: e.target.value
                                                        })
                                                    }
                                                    required
                                                    disabled={!isTcValid}

                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="odealSozlesmeNo">Ödeal Sözleşme No</label>
                                                <InputText
                                                    id="odealSozlesmeNo"
                                                    value={driver.odealContractNo}
                                                    onChange={(e) =>
                                                        setDriver({
                                                            ...driver,
                                                            odealContractNo: e.target.value
                                                        })
                                                    }
                                                    required
                                                    disabled={!isTcValid}

                                                    style={{ width: '100%' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="paramkartNo">Paramkart No</label>
                                                <InputText id="paramkartNo"                                         disabled={!isTcValid}
                                                            value={driver.paramCardNo} onChange={(e) => setDriver({ ...driver, paramCardNo: e.target.value })} required style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="field">
                                                <label htmlFor="password">Otomatik Şifre</label>
                                                <InputText id="password"                                         disabled={!isTcValid}
                                                            type="password" value={driver.password} onChange={(e) => setDriver({ ...driver, password: e.target.value })} required style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DriverList;
