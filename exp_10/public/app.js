/* ============================================
   STUDENT MANAGEMENT SYSTEM — APP LOGIC
   ============================================ */

const API_BASE = "/api/students";
let currentPage = 1;
let currentSearch = "";
let currentCourseFilter = "";
let currentStatusFilter = "";
let deleteTargetId = null;
let searchTimeout = null;

// ── DOM Elements ──
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const navItems = document.querySelectorAll(".nav-item");
const views = document.querySelectorAll(".view");
const studentForm = document.getElementById("studentForm");
const addStudentBtn = document.getElementById("addStudentBtn");
const cancelBtn = document.getElementById("cancelBtn");
const filterCourse = document.getElementById("filterCourse");
const filterStatus = document.getElementById("filterStatus");
const deleteModal = document.getElementById("deleteModal");
const viewModal = document.getElementById("viewModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");
const closeViewModal = document.getElementById("closeViewModal");

// ── Initialize ──
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  loadStudents();
  bindEvents();
  checkServerHealth();
});

// ── Event Bindings ──
function bindEvents() {
  // Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      showView(item.dataset.view);
    });
  });

  // Mobile menu
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Close sidebar on outside click (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // Search with debounce
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearch = e.target.value.trim();
      currentPage = 1;
      loadStudents();
    }, 400);
  });

  // Refresh
  refreshBtn.addEventListener("click", () => {
    loadDashboard();
    loadStudents();
    showToast("success", "Refreshed", "Data has been refreshed successfully");
  });

  // Filters
  filterCourse.addEventListener("change", (e) => {
    currentCourseFilter = e.target.value;
    currentPage = 1;
    loadStudents();
  });

  filterStatus.addEventListener("change", (e) => {
    currentStatusFilter = e.target.value;
    currentPage = 1;
    loadStudents();
  });

  // Add student button
  addStudentBtn.addEventListener("click", () => {
    resetForm();
    showView("add");
  });

  // Cancel form
  cancelBtn.addEventListener("click", () => {
    showView("students");
  });

  // Submit form
  studentForm.addEventListener("submit", handleFormSubmit);

  // Delete modal
  cancelDelete.addEventListener("click", () => closeModal(deleteModal));
  confirmDelete.addEventListener("click", handleDelete);

  // View modal
  closeViewModal.addEventListener("click", () => closeModal(viewModal));

  // Close modals on overlay click
  [deleteModal, viewModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Close modals on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal(deleteModal);
      closeModal(viewModal);
    }
  });
}

// ── View Navigation ──
function showView(viewName) {
  views.forEach((v) => v.classList.remove("active"));
  navItems.forEach((n) => n.classList.remove("active"));

  const targetView = document.getElementById(`${viewName}View`);
  const targetNav = document.querySelector(`[data-view="${viewName}"]`);

  if (targetView) targetView.classList.add("active");
  if (targetNav) targetNav.classList.add("active");

  // Close mobile sidebar
  sidebar.classList.remove("open");

  // Refresh data when switching views
  if (viewName === "dashboard") loadDashboard();
  if (viewName === "students") loadStudents();
}

// ── API Calls ──
async function apiCall(url, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }
  return data;
}

// ── Load Dashboard ──
async function loadDashboard() {
  try {
    const stats = await apiCall(`${API_BASE}/stats/overview`);
    const d = stats.data;

    animateNumber("statTotal", d.totalStudents);
    animateNumber("statActive", d.activeStudents);
    animateNumber("statInactive", d.inactiveStudents);
    animateNumber("statCourses", d.courseDistribution.length);

    renderCourseChart(d.courseDistribution, d.totalStudents);
    renderStatusChart(d.statusDistribution, d.totalStudents);
    await loadRecentStudents();
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

function animateNumber(elementId, target) {
  const el = document.getElementById(elementId);
  const start = parseInt(el.textContent) || 0;
  const duration = 600;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function renderCourseChart(distribution, total) {
  const chart = document.getElementById("courseChart");
  const barColors = ["bar-purple", "bar-green", "bar-yellow", "bar-blue", "bar-red"];

  if (!distribution.length) {
    chart.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding: 20px;">No data available</p>`;
    return;
  }

  chart.innerHTML = distribution
    .map((item, i) => {
      const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
      const color = barColors[i % barColors.length];
      return `
      <div class="chart-bar-item">
        <span class="chart-bar-label">${item._id || "N/A"}</span>
        <div class="chart-bar-track">
          <div class="chart-bar-fill ${color}" style="width: 0%">${percentage}%</div>
        </div>
        <span class="chart-bar-count">${item.count}</span>
      </div>`;
    })
    .join("");

  // Animate bars
  setTimeout(() => {
    chart.querySelectorAll(".chart-bar-fill").forEach((bar, i) => {
      const percentage = total > 0 ? Math.round((distribution[i].count / total) * 100) : 0;
      bar.style.width = `${Math.max(percentage, 8)}%`;
    });
  }, 100);
}

function renderStatusChart(distribution, total) {
  const chart = document.getElementById("statusChart");
  const colorMap = {
    Active: "bar-green",
    Inactive: "bar-yellow",
    Graduated: "bar-purple",
    Suspended: "bar-red",
  };

  if (!distribution.length) {
    chart.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding: 20px;">No data available</p>`;
    return;
  }

  chart.innerHTML = distribution
    .map((item) => {
      const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
      const color = colorMap[item._id] || "bar-blue";
      return `
      <div class="chart-bar-item">
        <span class="chart-bar-label">${item._id || "N/A"}</span>
        <div class="chart-bar-track">
          <div class="chart-bar-fill ${color}" style="width: 0%">${percentage}%</div>
        </div>
        <span class="chart-bar-count">${item.count}</span>
      </div>`;
    })
    .join("");

  setTimeout(() => {
    chart.querySelectorAll(".chart-bar-fill").forEach((bar, i) => {
      const percentage = total > 0 ? Math.round((distribution[i].count / total) * 100) : 0;
      bar.style.width = `${Math.max(percentage, 8)}%`;
    });
  }, 100);
}

async function loadRecentStudents() {
  try {
    const result = await apiCall(`${API_BASE}?sort=-createdAt&limit=5`);
    const list = document.getElementById("recentList");

    if (!result.data.length) {
      list.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding: 20px;">No students yet</p>`;
      return;
    }

    list.innerHTML = result.data
      .map((s) => {
        const initials = getInitials(s.name);
        const badgeClass = `badge-${(s.status || "active").toLowerCase()}`;
        return `
        <div class="recent-item">
          <div class="recent-avatar">${initials}</div>
          <div class="recent-info">
            <div class="name">${escapeHtml(s.name)} <span style="color: var(--primary-400); font-size: 0.75rem; font-weight: 500;">${s.studentId || ''}</span></div>
            <div class="email">${escapeHtml(s.email)}</div>
          </div>
          <span class="recent-badge badge ${badgeClass}">${s.status || "Active"}</span>
        </div>`;
      })
      .join("");
  } catch (error) {
    console.error("Recent students error:", error);
  }
}

// ── Load Students Table ──
async function loadStudents() {
  try {
    let url = `${API_BASE}?page=${currentPage}&limit=10`;
    if (currentSearch) url += `&search=${encodeURIComponent(currentSearch)}`;
    if (currentCourseFilter) url += `&course=${currentCourseFilter}`;
    if (currentStatusFilter) url += `&status=${currentStatusFilter}`;

    const result = await apiCall(url);
    const tbody = document.getElementById("studentsTableBody");
    const emptyState = document.getElementById("emptyState");
    const table = document.getElementById("studentsTable");

    if (!result.data.length) {
      tbody.innerHTML = "";
      table.style.display = "none";
      emptyState.style.display = "block";
      return;
    }

    table.style.display = "table";
    emptyState.style.display = "none";

    tbody.innerHTML = result.data
      .map(
        (s) => `
      <tr>
        <td><span style="color: var(--primary-400); font-weight: 600; font-family: monospace; font-size: 0.85rem;">${s.studentId || '—'}</span></td>
        <td>
          <div class="td-name">
            <div class="td-avatar">${getInitials(s.name)}</div>
            <span>${escapeHtml(s.name)}</span>
          </div>
        </td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.course)}</td>
        <td>${s.phone ? escapeHtml(s.phone) : "—"}</td>
        <td>${s.enrollmentYear || "—"}</td>
        <td><span class="badge badge-${(s.status || "active").toLowerCase()}">${s.status || "Active"}</span></td>
        <td>
          <div class="action-btns">
            <button class="action-btn view-btn" onclick="viewStudent('${s.studentId}')" title="View Details">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn edit-btn" onclick="editStudent('${s.studentId}')" title="Edit">
              <i class="fas fa-pen"></i>
            </button>
            <button class="action-btn delete-btn" onclick="confirmDeleteStudent('${s.studentId}', '${escapeHtml(s.name)}')" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>`
      )
      .join("");

    renderPagination(result.totalPages, result.currentPage);
  } catch (error) {
    console.error("Load students error:", error);
    showToast("error", "Error", "Failed to load student records");
  }
}

function renderPagination(totalPages, current) {
  const container = document.getElementById("pagination");

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `<button class="page-btn" onclick="goToPage(${current - 1})" ${current <= 1 ? "disabled" : ""}><i class="fas fa-chevron-left"></i></button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= current - 1 && i <= current + 1)) {
      html += `<button class="page-btn ${i === current ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === current - 2 || i === current + 2) {
      html += `<button class="page-btn" disabled>…</button>`;
    }
  }

  html += `<button class="page-btn" onclick="goToPage(${current + 1})" ${current >= totalPages ? "disabled" : ""}><i class="fas fa-chevron-right"></i></button>`;

  container.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  loadStudents();
}

// ── View Student ──
async function viewStudent(id) {
  try {
    const result = await apiCall(`${API_BASE}/${id}`);
    const s = result.data;

    document.getElementById("studentDetails").innerHTML = `
      <div class="detail-item" style="grid-column: 1 / -1; background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.2);">
        <div class="detail-label">Student ID (College ID)</div>
        <div class="detail-value" style="font-size: 1.2rem; color: var(--primary-400); font-family: monospace;">${s.studentId || 'N/A'}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Full Name</div>
        <div class="detail-value">${escapeHtml(s.name)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Email Address</div>
        <div class="detail-value">${escapeHtml(s.email)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Course</div>
        <div class="detail-value">${escapeHtml(s.course)}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Phone</div>
        <div class="detail-value">${s.phone ? escapeHtml(s.phone) : "Not provided"}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Enrollment Year</div>
        <div class="detail-value">${s.enrollmentYear || "Not provided"}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="badge badge-${(s.status || "active").toLowerCase()}">${s.status || "Active"}</span></div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Created At</div>
        <div class="detail-value">${new Date(s.createdAt).toLocaleString()}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Updated At</div>
        <div class="detail-value">${new Date(s.updatedAt).toLocaleString()}</div>
      </div>
    `;

    openModal(viewModal);
  } catch (error) {
    showToast("error", "Error", "Failed to load student details");
  }
}

// ── Edit Student ──
async function editStudent(id) {
  try {
    const result = await apiCall(`${API_BASE}/${id}`);
    const s = result.data;

    document.getElementById("editMode").value = s.studentId;
    document.getElementById("studentIdInput").value = s.studentId;
    document.getElementById("nameInput").value = s.name;
    document.getElementById("emailInput").value = s.email;
    document.getElementById("courseInput").value = s.course;
    document.getElementById("phoneInput").value = s.phone || "";
    document.getElementById("yearInput").value = s.enrollmentYear || "";
    document.getElementById("statusInput").value = s.status || "Active";

    document.getElementById("formTitle").textContent = `Edit Student — ${s.studentId}`;
    document.getElementById("formSubtitle").textContent = `Editing record for ${s.studentId} — ${s.name}`;
    document.getElementById("submitText").textContent = "Update Student";

    showView("add");
  } catch (error) {
    showToast("error", "Error", "Failed to load student for editing");
  }
}

// ── Delete Student ──
function confirmDeleteStudent(id, name) {
  deleteTargetId = id;
  document.getElementById("deleteStudentName").textContent = name;
  openModal(deleteModal);
}

async function handleDelete() {
  if (!deleteTargetId) return;

  try {
    await apiCall(`${API_BASE}/${deleteTargetId}`, "DELETE");
    closeModal(deleteModal);
    showToast("success", "Deleted", "Student record has been removed");
    deleteTargetId = null;
    loadStudents();
    loadDashboard();
  } catch (error) {
    showToast("error", "Error", "Failed to delete student");
  }
}

// ── Form Submit ──
async function handleFormSubmit(e) {
  e.preventDefault();

  // Clear errors
  document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".form-group input, .form-group select").forEach((el) => el.classList.remove("error"));

  const editId = document.getElementById("editMode").value;
  const studentId = document.getElementById("studentIdInput").value.trim();
  const name = document.getElementById("nameInput").value.trim();
  const email = document.getElementById("emailInput").value.trim();
  const course = document.getElementById("courseInput").value;
  const phone = document.getElementById("phoneInput").value.trim();
  const enrollmentYear = document.getElementById("yearInput").value;
  const status = document.getElementById("statusInput").value;

  // Frontend validation
  let hasError = false;

  if (!studentId) {
    showFieldError("studentIdInput", "studentIdError", "Student ID is required");
    hasError = true;
  }
  if (!name || name.length < 2) {
    showFieldError("nameInput", "nameError", "Name must be at least 2 characters");
    hasError = true;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError("emailInput", "emailError", "Please enter a valid email");
    hasError = true;
  }
  if (!course) {
    showFieldError("courseInput", "courseError", "Please select a course");
    hasError = true;
  }
  if (phone && !/^\d{10}$/.test(phone)) {
    showFieldError("phoneInput", "phoneError", "Phone must be 10 digits");
    hasError = true;
  }

  if (hasError) return;

  const body = { studentId, name, email, course, phone, status };
  if (enrollmentYear) body.enrollmentYear = parseInt(enrollmentYear);

  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const originalText = submitText.textContent;
  submitBtn.disabled = true;
  submitText.innerHTML = `<span class="spinner"></span> Saving...`;

  try {
    if (editId) {
      await apiCall(`${API_BASE}/${editId}`, "PUT", body);
      showToast("success", "Updated", `${name}'s record has been updated`);
    } else {
      await apiCall(API_BASE, "POST", body);
      showToast("success", "Created", `${name} has been added successfully`);
    }

    resetForm();
    showView("students");
    loadDashboard();
  } catch (error) {
    if (error.errors) {
      error.errors.forEach((msg) => {
        showToast("error", "Validation Error", msg);
      });
    } else {
      showToast("error", "Error", error.message || "Failed to save student");
    }
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = originalText;
  }
}

function showFieldError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("error");
  document.getElementById(errorId).textContent = message;
}

function resetForm() {
  studentForm.reset();
  document.getElementById("editMode").value = "";
  document.getElementById("studentIdInput").value = "";
  document.getElementById("formTitle").textContent = "Add New Student";
  document.getElementById("formSubtitle").textContent = "Fill in the details to create a new student record";
  document.getElementById("submitText").textContent = "Save Student";
  document.querySelectorAll(".error-text").forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".form-group input, .form-group select").forEach((el) => el.classList.remove("error"));
}

// ── Modals ──
function openModal(modal) {
  modal.classList.add("show");
}

function closeModal(modal) {
  modal.classList.remove("show");
}

// ── Toast Notifications ──
function showToast(type, title, message) {
  const container = document.getElementById("toastContainer");
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.classList.add('removing'); setTimeout(() => this.parentElement.remove(), 300);">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.classList.add("removing");
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// ── Health Check ──
async function checkServerHealth() {
  const statusEl = document.getElementById("serverStatus");
  try {
    await fetch("/api/students?limit=1");
    statusEl.classList.remove("disconnected");
    statusEl.querySelector("span").textContent = "Server Connected";
  } catch {
    statusEl.classList.add("disconnected");
    statusEl.querySelector("span").textContent = "Server Offline";
  }
}

// ── Helpers ──
function getInitials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
