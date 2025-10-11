import httpClient from "../../http/httpClient";

export const attendanceTrackerService = {
    getAttendanceForManager: async (managerId, dateFilter) => {
        try {
            const res = await httpClient.get(
                `/checkIn/attendance_for_manager`,
                {
                    params: {
                        manager_id: managerId,
                        date_filter: dateFilter,
                    },
                }
            );
            return res.data;
        } catch (error) {
            throw error;
        }
    },
}
