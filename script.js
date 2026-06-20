const form = document.querySelector("form");
const taskInput = document.querySelector("#task-title");
const categorySelect = document.querySelector("#category");

const tasksContainer = document.querySelector(".tasks-container");

const clearAllBtn = document.querySelector(".clear-all-btn");

const searchInput = document.querySelector(".search-box input");

const totalTasks = document.querySelector(".total .stat-info p");
const pendingTasks = document.querySelector(".pending .stat-info p");
const completedTasks = document.querySelector(".completed .stat-info p");
const categoryTasks = document.querySelector(".category .stat-info p");

let taskId = 1;


// ==================== UPDATE STATS ====================

function updateStats() {

    const allTasks = document.querySelectorAll(".task-card").length;

    const pendingCount = document.querySelectorAll(
        '.task-card[data-status="pending"]'
    ).length;

    const completedCount = document.querySelectorAll(
        '.task-card[data-status="completed"]'
    ).length;

    const categories = new Set();

    document.querySelectorAll(".task-card").forEach(task => {
        categories.add(task.dataset.category);
    });

    totalTasks.textContent = allTasks;
    pendingTasks.textContent = pendingCount;
    completedTasks.textContent = completedCount;
    categoryTasks.textContent = categories.size;
}


// ==================== ADD TASK ====================

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const taskTitle = taskInput.value.trim();
    const category = categorySelect.value;

    if (taskTitle === "") {
        alert("Please enter a task");
        return;
    }

    const taskCard = document.createElement("div");

    taskCard.classList.add("task-card");

    taskCard.setAttribute("data-id", taskId);
    taskCard.setAttribute("data-status", "pending");
    taskCard.setAttribute("data-category", category);

    taskCard.innerHTML = `
    
        <div class="task-header">
            <h3>${taskTitle}</h3>
            <span class="task-id">ID: ${taskId}</span>
        </div>

        <div class="task-tags">
            <span class="category-tag">${category}</span>
            <span class="status-tag">Pending</span>
        </div>

        <div class="task-actions">

            <button class="complete-btn">
                <i class="fa-solid fa-check"></i> Complete
            </button>

            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i> Delete
            </button>

        </div>
    
    `;

    tasksContainer.appendChild(taskCard);

    taskInput.value = "";

    taskId++;

    updateStats();
    applyFilters();

});


// ==================== DELETE + COMPLETE ====================

tasksContainer.addEventListener("click", function (e) {

    const card = e.target.closest(".task-card");

    if (!card) return;


    // DELETE

    if (e.target.closest(".delete-btn")) {

        card.remove();

        updateStats();
    }


    // COMPLETE

    if (e.target.closest(".complete-btn")) {

        card.dataset.status = "completed";

        const statusTag = card.querySelector(".status-tag");

        statusTag.textContent = "Completed";
        statusTag.classList.remove("pending");
        statusTag.classList.add("completed");

        const completeBtn = card.querySelector(".complete-btn");
        completeBtn.innerHTML = '<i class="fa-solid fa-check"></i> Completed';
        completeBtn.disabled = true;

        updateStats();
        applyFilters();
    }

});


// ==================== CLEAR ALL ====================

clearAllBtn.addEventListener("click", function () {

    const confirmDelete = confirm(
        "Are you sure you want to delete all tasks?"
    );

    if (!confirmDelete) return;

    tasksContainer.innerHTML = "";

    taskId = 1;

    updateStats();

});


// ==================== SEARCH TASK ====================

searchInput.addEventListener("input", applyFilters);


// ==================== CATEGORY + STATUS FILTER ====================

const categoryFilter = document.querySelector(".category-filter");
const statusFilter = document.querySelector(".status-filter");

categoryFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);

function applyFilters() {

    const searchValue = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const selectedStatus = statusFilter.value.toLowerCase();

    const cards = document.querySelectorAll(".task-card");

    cards.forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();
        const cardCategory = card.dataset.category.toLowerCase();
        const cardStatus = card.dataset.status.toLowerCase();

        const matchSearch = title.includes(searchValue);

        const matchCategory =
            selectedCategory === "" ||
            selectedCategory === "all categories" ||
            cardCategory === selectedCategory;

        const matchStatus =
            selectedStatus === "" ||
            selectedStatus === "all status" ||
            cardStatus === selectedStatus;

        card.style.display = (matchSearch && matchCategory && matchStatus)
            ? "block"
            : "none";

    });

}


// ==================== THEME TOGGLE (Light/Dark) ====================

const themeBtn = document.querySelector(".theme-btn");
const themeIcon = themeBtn.querySelector("i");

// Restore saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeIcon.className = "fa-solid fa-sun";
} else {
    document.body.classList.remove("dark");
    themeIcon.className = "fa-solid fa-moon";
}

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeIcon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";

    localStorage.setItem("theme", isDark ? "dark" : "light");

});


// ==================== MOBILE SIDEBAR MENU ====================

const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".sidebar-overlay");

if (menuBtn) {
    menuBtn.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("active");
    });
}

if (overlay) {
    overlay.addEventListener("click", function () {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });
}

// Close sidebar on nav link click (mobile)
document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });
});


// ==================== INITIAL ====================

updateStats();