import toast from "react-hot-toast";

export function serialize(obj) {
  let str = [];
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (Array.isArray(obj[p])) {
        obj[p].forEach((item) => {
          str.push(encodeURIComponent(p) + "[]=" + encodeURIComponent(item));
        });
      } else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    }
  }
  return str.join("&");
}

const allowedTypes = ["success", "error", "info", "loading"];

export const showToast = (message = "", type = "info", options = {}) => {
  if (!message) return;

  const toastType = allowedTypes.includes(type) ? type : "info";

  toast(message, {
    type: toastType,
    id: options.id || message, // fallback to message if no custom id
    duration: options.duration || 4000,
    position: options.position || "top-center",
    ...options, // spread other custom react-hot-toast options
  });
};

export const getFutureYears = (range = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: range }, (_, i) => currentYear + i);
};

export const getMonths = () =>
  Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );

export const getDaysInMonth = (month, year = new Date().getFullYear()) => {
  const daysCount = new Date(year, month, 0).getDate();
  return Array.from({ length: daysCount }, (_, i) => i + 1);
};

export const objectToFormData = (
  obj,
  form = new FormData(),
  namespace = ""
) => {
  for (let property in obj) {
    if (
      !obj.hasOwnProperty(property) ||
      obj[property] === undefined ||
      obj[property] === null
    )
      continue;

    const formKey = namespace ? `${namespace}[${property}]` : property;
    const value = obj[property];

    if (value instanceof Date) {
      form.append(formKey, value.toISOString());
    } else if (value instanceof File || value instanceof Blob) {
      form.append(formKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((element, index) => {
        const key = `${formKey}[${index}]`;
        if (typeof element === "object" && !(element instanceof File)) {
          objectToFormData(element, form, key);
        } else {
          form.append(key, element);
        }
      });
    } else if (typeof value === "object") {
      objectToFormData(value, form, formKey);
    } else {
      form.append(formKey, value);
    }
  }

  return form;
};

export const formatDateToYMD = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
