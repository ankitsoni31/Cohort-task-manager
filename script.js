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

function saveTasks() {
    const cards = document.querySelectorAll(".task-card");
    const tasks = [];
    cards.forEach(card => {
        tasks.push({
            id: card.dataset.id,
            title: card.querySelector("h3").textContent,
            category: card.dataset.category,
            status: card.dataset.status
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("taskId", taskId);
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    const savedId = localStorage.getItem("taskId");

    if (savedId) taskId = parseInt(savedId);

    if (saved) {
        const tasks = JSON.parse(saved);
        tasks.forEach(task => {
            createTaskCard(task.title, task.category, task.id, task.status);
        });
        updateStats();
    }
}


function createTaskCard(taskTitle, category, id, status = "pending") {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");
    taskCard.setAttribute("data-id", id);
    taskCard.setAttribute("data-status", status);
    taskCard.setAttribute("data-category", category);

    const isCompleted = status === "completed";

    taskCard.innerHTML = `
        <div class="task-header">
            <h3>${taskTitle}</h3>
            <span class="task-id">ID: ${id}</span>
        </div>
        <div class="task-tags">
            <span class="category-tag">${category}</span>
            <span class="status-tag ${isCompleted ? "completed" : ""}">${isCompleted ? "Completed" : "Pending"}</span>
        </div>
        <div class="task-actions">
            <button class="complete-btn" ${isCompleted ? "disabled" : ""}>
                <i class="fa-solid fa-check"></i> ${isCompleted ? "Completed" : "Complete"}
            </button>
            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i> Delete
            </button>
        </div>
    `;

    tasksContainer.appendChild(taskCard);
}


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



form.addEventListener("submit", function (e) {

    e.preventDefault();

    const taskTitle = taskInput.value.trim();
    const category = categorySelect.value;

    if (taskTitle === "") {
        alert("Please enter a task");
        return;
    }

    createTaskCard(taskTitle, category, taskId);

    taskInput.value = "";

    taskId++;

    updateStats();
    saveTasks();
    applyFilters();

});



tasksContainer.addEventListener("click", function (e) {

    const card = e.target.closest(".task-card");

    if (!card) return;

    if (e.target.closest(".delete-btn")) {
        card.remove();
        updateStats();
        saveTasks();
    }

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
        saveTasks();
        applyFilters();
    }

});


clearAllBtn.addEventListener("click", function () {

    const confirmDelete = confirm("Are you sure you want to delete all tasks?");

    if (!confirmDelete) return;

    tasksContainer.innerHTML = "";
    taskId = 1;

    updateStats();
    saveTasks();

});


searchInput.addEventListener("input", applyFilters);

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
            selectedCategory.includes("all") ||
            cardCategory === selectedCategory;

        const matchStatus =
            selectedStatus === "" ||
            selectedStatus.includes("all") ||
            cardStatus === selectedStatus;

        card.style.display = (matchSearch && matchCategory && matchStatus)
            ? ""
            : "none";

    });

}




const themeBtn = document.querySelector(".theme-btn");
const themeIcon = themeBtn.querySelector("i");

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

document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
    });
});



loadTasks();