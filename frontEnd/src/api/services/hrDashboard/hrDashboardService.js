
import httpClient from "../../http/httpClient";

export const getAllEmployees = async () => {
  try {
    const res = await httpClient.get("/registration/getAllEmployees");
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const getAllLeaves = async () => {
  try {
    const res = await httpClient.get("/leave/get_all_leaves");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getAttendanceCount = async () => {
  try {
    const res = await httpClient.get("/dashboard/attendance_count");
    if (res.data.success) return res.data.count;
    return 0;
  } catch (error) {
    throw error;
  }
};

export const getUpcomingHolidays = async () => {
  try {
    const res = await httpClient.get("/holidays/get_upcoming_holidays");
    if (res.data.success) return res.data.data;
    return [];
  } catch (error) {
    throw error;
  }
};

export const updateLeaveStatus = async (leave_id, status) => {
  try {
    const res = await httpClient.put("/leave/update_status", {
      leave_id,
      status,
      approved_by: "HR",
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};
