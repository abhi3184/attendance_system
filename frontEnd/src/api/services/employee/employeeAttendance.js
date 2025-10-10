import httpClient from "../../http/httpClient";

export const employeeAttendanceService = {

    getAttendanceRecords: async (emp_id,viewType) => {
        const res = await httpClient.get(`/checkIn/getAttendanceByEmp/${emp_id}?view_type=${viewType}`);
        return res.data || [];
    },

    getStatus:async (emp_id) => {
        const res = await httpClient.get(`/checkIn/status/${emp_id}`);
        return res.data || [];
    }
}