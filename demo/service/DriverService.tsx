import { Demo } from '@/types';

export const DriverService = {

    getDrivers() {
        return fetch('/demo/data/driver-list.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Driver[]);
    },

    addDriver(driver: any) {
        return fetch('/demo/data/driver-list.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(driver)
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    },


    updateDriver(driver:any) {
        return fetch(`/demo/data/driver-list/${driver.id}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(driver)
        }).then((res) => res.json());
    },
    deleteDriver(id: number) {
        return fetch(`/demo/data/driver-list/${id}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }).then((res) => res.json());
    },

    getDriversSmall: () => {
        return fetch('/demo/data/driver-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((d) => {
                console.log('Fetched Data:', d); // Burada veriyi konsola yazdır
                return d.data; // 'data' dizisini döndür
            })
            .catch((error) => {
                console.error('Fetch error:', error);
                return []; // Hata durumunda boş bir dizi döndür
            });
    }};
