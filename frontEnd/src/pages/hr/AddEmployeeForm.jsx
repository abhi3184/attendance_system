import React, { useState, useEffect } from "react";
import Modal from "../../modals/modal";
import FancyDropdown from "../../modals/dropdowns";
import axios from "axios";
import toast from "react-hot-toast";

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

    
  // Fetch managers and roles once
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/registration/getAllManagers")
      .then((res) => Array.isArray(res.data?.data) && setManagers(res.data.data))
      .catch((err) => console.error("Error fetching managers:", err));

    axios
      .get("http://127.0.0.1:8000/registration/getAllRoles")
      .then((res) => Array.isArray(res.data?.data) && setRoles(res.data.data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  // Reset form whenever modal opens
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
    const fieldsStep1 = ["firstName", "lastName", "email", "mobile", "department", "role", "shift", "managerId"];
    const fieldsStep2 = ["schoolName", "university", "degree", "fieldOfStudy", "year", "location"];
    const fieldsStep3 = ["address", "city", "state", "zip", "phoneAlt"];

    let fields = [];
    if (step === 1) fields = fieldsStep1;
    if (step === 2) fields = fieldsStep2;
    if (step === 3) fields = fieldsStep3;

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

  // Check employee existence
  const checkEmployeeExist = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/registration/checkEmployeeExist", {
        params: { emailId: formData.email, mobile: formData.mobile },
      });
      if (response.data?.success === false) {
        toast.error(response.data.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error checking employee:", err);
      toast.error("Failed to check employee. Please try again.");
      return false;
    }
  };

  return (
    <Modal className="max-w-xl font-sans" isOpen={isOpen} onClose={onClose} title={title}>
      <form className="flex flex-col gap-3 text-gray-700 text-sm">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <>
            <div className="flex flex-wrap gap-3">
              {["firstName", "lastName"].map((field) => (
                <div key={field} className="flex-1 relative">
                  <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">
                    {field === "firstName" ? "First Name" : "Last Name"}
                  </label>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`${inputBaseClass} ${errors[field] ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              {["email", "mobile"].map((field) => (
                <div key={field} className="flex-1 relative">
                  <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">
                    {field === "email" ? "Email" : "Mobile"}
                  </label>
                  <input
                    name={field}
                    type={field === "email" ? "email" : "tel"}
                    value={formData[field]}
                    onChange={handleChange}
                    className={`${inputBaseClass} ${errors[field] ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Manager */}
            <div className="flex-1 mt-2">
              <label className="text-gray-400 text-xs font-medium mb-1 block">Manager</label>
              <FancyDropdown
                options={managers.map((m) => ({ label: `${m.firstName} ${m.lastName}`, value: m.emp_id }))}
                value={formData.managerId}
                placeholder="Select Manager"
                onChange={(val) => handleDropdownChange("managerId", val)}
                className={`${errors.managerId ? "border-red-400" : "border-gray-300"} rounded-md`}
              />
              {errors.managerId && <p className="text-red-500 text-xs mt-1">{errors.managerId}</p>}
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              {/* Department */}
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

              {/* Role */}
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

              {/* Shift */}
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
          </>
        )}

        {/* Step 2: Education & Experience */}
        {step === 2 && (
          <>
            {["schoolName", "university", "degree", "fieldOfStudy", "year", "location"].map((field) => (
              <div key={field} className="relative mb-2">
                <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${errors[field] ? "border-red-400" : "border-gray-300"}`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
          </>
        )}

        {/* Step 3: Address & Contact */}
        {step === 3 && (
          <>
            {["address", "city", "state", "zip", "phoneAlt"].map((field) => (
              <div key={field} className="relative mb-2">
                <label className="absolute left-3 top-1 text-gray-400 text-xs font-medium">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`${inputBaseClass} ${errors[field] ? "border-red-400" : "border-gray-300"}`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={async () => {
              const stepErrors = validateStep();
              if (Object.keys(stepErrors).length > 0) return setErrors(stepErrors);

              if (step === 1) {
                const canProceed = await checkEmployeeExist();
                if (!canProceed) return;
                setStep((prev) => prev + 1);
              } else if (step === 2) {
                setStep((prev) => prev + 1);
              } else if (step === 3) {
                setLoading(true);
                try {
                  const payload = {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    emailId: formData.email,
                    mobile: formData.mobile,
                    department: formData.department,
                    shift: formData.shift,
                    password: "Default@123",
                    roles: formData.role,
                    manager_id: formData.managerId,
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
                  const response = await axios.post(
                    "http://127.0.0.1:8000/registration/postEmployee",
                    payload
                  );
                  if (response.status === 200 || response.status === 201) {
                    toast.success("Employee added successfully ✅");
                    onSubmit(formData);
                    onClose();
                  }
                } catch (err) {
                  console.error("Error adding employee:", err);
                  toast.error("Failed to add employee ❌");
                } finally {
                  setLoading(false);
                }
              }
            }}
            className={`px-4 py-1 rounded text-white ${
              loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={loading}
          >
            {step < 3 ? "Next" : loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
