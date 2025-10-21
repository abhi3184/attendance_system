import React, { useState, useEffect } from "react";
import Modal from "../../modals/modal";
import FancyDropdown from "../../components/dropdowns";
import toast from "react-hot-toast";
import { EmployeeService } from "../../api/services/hrDashboard/employeeManageService";

export const EmployeeModal = ({ isOpen, onClose, onSubmit, title = "Add Employee" }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    department: "",
    role: "",
    shift: "",
    managerId: "",
    schoolName: "",
    university: "",
    degree: "",
    fieldOfStudy: "",
    year: "",
    location: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phoneAlt: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [roles, setRoles] = useState([]);

  const inputBaseClass =
    "w-full border rounded-md px-3 pt-4 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500";

  useEffect(() => {
    if (isOpen) {
      EmployeeService.getAllManagers().then(setManagers).catch();
      setFormData((prev) => ({ ...prev, managerId: "" }));
    }
  }, [isOpen]);

  useEffect(() => {
    EmployeeService.getAllRoles().then(setRoles).catch();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        department: "",
        role: "",
        shift: "",
        managerId: "",
        schoolName: "",
        university: "",
        degree: "",
        fieldOfStudy: "",
        year: "",
        location: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phoneAlt: "",
      });
      setStep(1);
      setErrors({});
      setLoading(false);
    }
  }, [isOpen]);

  // Field-level validation
  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
      case "schoolName":
      case "university":
      case "degree":
      case "fieldOfStudy":
      case "location":
      case "address":
      case "city":
      case "state":
        if (!value.trim()) return "This field is required";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return "Enter a valid email address";
        break;
      case "mobile":
      case "phoneAlt":
        if (!value.trim()) return "Phone number is required";
        if (!/^\d{10}$/.test(value)) return "Enter a valid 10-digit number";
        break;
      case "zip":
        if (!value.trim()) return "ZIP code is required";
        if (!/^\d{5,6}$/.test(value)) return "Enter a valid 5-6 digit ZIP code";
        break;
      case "year":
        if (!value.trim()) return "Year is required";
        if (!/^\d{4}$/.test(value)) return "Enter a valid 4-digit year";
        const currentYear = new Date().getFullYear();
        if (parseInt(value) > currentYear) return `Year cannot be greater than ${currentYear}`;
        break;
      case "department":
      case "role":
      case "shift":
      case "managerId":
        if (!value) return "Selection required";
        break;
      default:
        return "";
    }
    return "";
  };

  // Validate all fields in current step
  const validateStep = () => {
    const stepErrors = {};
    const fieldsStep1 = ["firstName", "lastName", "email", "mobile", "department", "role", "shift"];
    const fieldsStep2 = ["schoolName", "university", "degree", "fieldOfStudy", "year", "location"];
    const fieldsStep3 = ["address", "city", "state", "zip", "phoneAlt"];

    let fields = [];

    if (step === 1) {
      fields = [...fieldsStep1];
      if (formData.role === 3) fields.push("managerId"); // Only Employee
    } else if (step === 2) {
      fields = fieldsStep2;
    } else if (step === 3) {
      fields = fieldsStep3;
    }

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) stepErrors[field] = error;
    });

    return stepErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage || undefined }));
  };

  const handleDropdownChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const errorMessage = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errorMessage || undefined }));
  };

  const checkEmployeeExist = async () => {
    try {
      const res = await EmployeeService.checkEmployeeExist({
        email: formData.email,
        mobile: formData.mobile,
      });

      if (res.success === false) {
        toast.error(res.message);
        return false;
      }
      return true;
    } catch {
      toast.error("Failed to check employee. Please try again.");
      return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailId: formData.email,
      mobile: formData.mobile,
      department: formData.department,
      shift: formData.shift,
      password: "",
      roles: formData.role,
      manager_id: formData.role === 3 ? formData.managerId : 1,
      schoolName: formData.schoolName,
      university: formData.university,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy || formData.degree,
      passingyear: formData.year,
      location: formData.location,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      phoneAlt: formData.phoneAlt,
    };

    try {
      const res = await EmployeeService.addEmployee(payload); // API call
      if (res.success) {
        toast.success("Employee added successfully ✅");
        onSubmit();
        onClose();
      } else {
        toast.error("Failed to add employee ❌");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal className="max-w-xl font-sans" isOpen={isOpen} onClose={onClose} title={title}>
      <form className="flex flex-col gap-3 text-gray-700 text-sm">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${errors.firstName ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div className="flex-1 relative">
                <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${errors.lastName ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${errors.email ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="flex-1 relative">
                <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Mobile</label>
                <input
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${errors.mobile ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <div className="flex-1">
                <label className="text-gray-400 text-xs font-medium mb-1 block">Department</label>
                <FancyDropdown
                  options={["IT", "Trade", "Purchase", "Sales"]}
                  value={formData.department}
                  placeholder="Department"
                  onChange={(val) => handleDropdownChange("department", val)}
                  className={`${errors.department ? "border-red-400" : "border-gray-300"} rounded-md`}
                />
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              <div className="flex-1">
                <label className="text-gray-400 text-xs font-medium mb-1 block">Role</label>
                {roles.length > 0 ? (
                  <FancyDropdown
                    options={roles.map((r) => ({ label: r.role, value: r.role_id }))}
                    value={formData.role}
                    placeholder="Role"
                    onChange={(val) => handleDropdownChange("role", val)}
                    className={`${errors.role ? "border-red-400" : "border-gray-300"} rounded-md`}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md text-sm text-gray-400">Loading roles...</div>
                )}
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              <div className="flex-1">
                <label className="text-gray-400 text-xs font-medium mb-1 block">Shift</label>
                <FancyDropdown
                  options={["Morning", "Evening"]}
                  value={formData.shift}
                  placeholder="Shift"
                  onChange={(val) => handleDropdownChange("shift", val)}
                  className={`${errors.shift ? "border-red-400" : "border-gray-300"} rounded-md`}
                />
                {errors.shift && <p className="text-red-500 text-xs mt-1">{errors.shift}</p>}
              </div>
            </div>

            {/* Manager only for Employee */}
            {formData.role === 3 && (
              <div className="flex-1 mt-2">
                <label className="text-gray-400 text-xs font-medium mb-1 block">Manager</label>
                <FancyDropdown
                  options={managers.map((m) => ({
                    label: `${m.firstName} ${m.lastName}`,
                    value: m.emp_id,
                  }))}
                  value={formData.managerId}
                  placeholder="Select Manager"
                  onChange={(val) => handleDropdownChange("managerId", val)}
                  className={`${errors.managerId ? "border-red-400" : "border-gray-300"} rounded-md`}
                />
                {errors.managerId && <p className="text-red-500 text-xs mt-1">{errors.managerId}</p>}
              </div>
            )}
          </>
        )}

        {/* Step 2: Education & Experience */}
        {step === 2 && (
          <>
            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">School Name</label>
              <input
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.schoolName ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">University</label>
              <input
                name="university"
                value={formData.university}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.university ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.university && <p className="text-red-500 text-xs mt-1">{errors.university}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Degree</label>
              <input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.degree ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Field Of Study</label>
              <input
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.fieldOfStudy ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.fieldOfStudy && <p className="text-red-500 text-xs mt-1">{errors.fieldOfStudy}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Year</label>
              <input
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.year ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.location ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          </>
        )}

        {/* Step 3: Address & Contact */}
        {step === 3 && (
          <>
            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Address</label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.address ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">City</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.city ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">State</label>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.state ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">ZIP</label>
              <input
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.zip ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
            </div>

            <div className="relative mb-2">
              <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">Alternate Phone</label>
              <input
                name="phoneAlt"
                value={formData.phoneAlt}
                onChange={handleChange}
                className={`${inputBaseClass} ${errors.phoneAlt ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.phoneAlt && <p className="text-red-500 text-xs mt-1">{errors.phoneAlt}</p>}
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-white"
            >
              Back
            </button>
          )}
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={async () => {
                const stepErrors = validateStep();
                if (Object.keys(stepErrors).length > 0) {
                  setErrors(stepErrors);
                  return;
                }

                if (step === 1) {
                  const canProceed = await checkEmployeeExist();
                  if (!canProceed) return;
                  setStep((prev) => prev + 1);
                } else if (step === 2) {
                  setStep((prev) => prev + 1);
                } else if (step === 3) {
                  await handleSubmit();
                }
              }}
              className={`px-4 py-2 rounded text-white ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
              disabled={loading}
            >
              {step < 3 ? "Next" : loading ? "Saving..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
