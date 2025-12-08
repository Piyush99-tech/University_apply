const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

async function apiRequest(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};

  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("uniapply_token")
      : null;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }
  return res.json();
}

export async function registerApi(name, email, password) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }
  return res.json();
}

export function getAllUniversities() {
  return apiRequest("/api/universities");
}

export function createUniversity(data) {
  return apiRequest("/api/universities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAllPrograms() {
  return apiRequest("/api/programs");
}

export function createProgram(data) {
  return apiRequest("/api/programs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMyApplications() {
  return apiRequest("/api/applications");
}

export function getApplicationDetail(id) {
  return apiRequest(`/api/applications/${id}`);
}

export function getAdminApplications() {
  return apiRequest("/api/admin/applications");
}


export function createApplicationApi(programId, universityId) {
  return apiRequest("/api/applications", {
    method: "POST",
    body: JSON.stringify({ programId, universityId, formData: {} }),
  });
}

export function submitApplication(id) {
  console.log("HY");
  return apiRequest(`/api/applications/${id}/submit`, {
    method: "POST",
  });
}

export function getAdminApplicationDetail(id) {
  return apiRequest(`/api/admin/applications/${id}`);
}

export async function uploadApplicationDocument(id, file, docType) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);

  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("uniapply_token")
      : null;

  const res = await fetch(
    `${API_BASE}/api/applications/${id}/documents`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }
  return res.json();
}

export function adminVerifyApplication(id) {
  return apiRequest(`/api/admin/applications/${id}/verify`, {
    method: "POST",
  });
}

export function adminRaiseIssue(id) {
  return apiRequest(`/api/admin/applications/${id}/issue`, {
    method: "POST",
  });
}

export function adminRejectApplication(id) {
  return apiRequest(`/api/admin/applications/${id}/reject`, {
    method: "POST",
  });
}
