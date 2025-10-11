import httpClient from "../../http/httpClient";


export const employeeHomeService = {

    getEmployeeDetails: async (emp_id) => {
        const res = await httpClient.get(`/registration/get_employee_by_id/${emp_id}`);
        return res.data || [];
    },

    fetchStatusToday: async (emp_id) => {
        const res = await httpClient.get(`checkIn/status/${emp_id}`);
        return res.data || [];
    },

    handleCheckIn: async (employee) => {
        const res = await httpClient.post(`/checkIn/checkin?emp_id=${employee.emp_id}&manager_id=${employee.manager_id}`);
        return res.data;
    },

    handleCheckOut: async (emp_id) => {
        const res = await httpClient.post(`checkIn/checkout?emp_id=${emp_id}`);
        return res.data || [];
    },

    getLeaveSummary: async (emp_id) => {
        const res = await httpClient.get(`/leave/leave_summary/${emp_id}`);
        return res.data || [];
    },

    getUpcominngHolidays: async () => {
        const res = await httpClient.get(`/holidays/get_upcoming_holidays`);
        return res.data || [];
    },

    getAttendanceRecords: async (emp_id) => {
        const res = await httpClient.get(`/checkIn/getAttendanceByEmp/${emp_id}?view_type=weekly`);
        return res.data || [];
    }
}