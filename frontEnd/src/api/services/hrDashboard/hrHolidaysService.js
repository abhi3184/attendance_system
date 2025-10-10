import httpClient from "../../http/httpClient";


export const hrHolidaysService = { 
    getAllHolidays: async () => {
        const res = await httpClient.get(`/holidays/get_holidays`);
        return res.data || [];
    },

    deleteHoliday: async (holidays_id) => {
        const res = await httpClient.delete(`/holidays/delete_holiday/${holidays_id}`);
        return res.data || {};
    },

    addHoliday: async (payload) => {
        const res = await httpClient.post("/holidays/add_holiday", payload);
        return res.data || {};
    },

    updateHoliday: async (holidays_id, payload) => {
        const res = await httpClient.put(`http://127.0.0.1:8000/holidays/update/${holidays_id}`, payload);
        return res.data || {};
    }
}