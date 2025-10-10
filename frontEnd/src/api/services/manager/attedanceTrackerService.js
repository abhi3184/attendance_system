import httpClient from "../../http/httpClient";

export const attendanceTrackerService = {
    getAttendanceByManager: async (managerId) => {
        const res = await httpClient.get(`/attendance/manager_attendance/${managerId}`);
        return res?.data;
    }
}
