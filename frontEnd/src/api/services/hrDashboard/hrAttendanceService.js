import httpClient from "../../http/httpClient";

export const hrAttendanceService = {
    getAllAttendance: async () => {
        const res = await httpClient.get(`/checkIn/getAllAttendance`);
        return res.data || [];
    },
}