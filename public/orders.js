document.addEventListener("DOMContentLoaded", () => {
    fetchOrders();
    setupFilters(); // Initialize filters
    setupSorting(); // Initialize sorting
    setupOrderIdFilter(); // Initialize order ID filter with fuzzy search

    const token = localStorage.getItem("token");
    if (token) {
        document.getElementById("logoutButton").style.display = "block"; // Show logout button
    }
});

function fetchOrders(statusFilter = "All", sortBy = "createdAt", sortOrder = "asc", orderIdFilter = "") {
    const userEmail = localStorage.getItem("userEmail"); // Get logged-in user's email

    if (!userEmail) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
        return;
    }

    fetch(`http://localhost:5000/get-orders/${userEmail}`)
        .then(response => response.json())
        .then(data => {
            console.log("Orders received:", data);
            displayOrders(data.orders, statusFilter, sortBy, sortOrder, orderIdFilter);
        })
        .catch(error => console.error("Error fetching orders:", error));
}

function displayOrders(orders, statusFilter, sortBy, sortOrder, orderIdFilter) {
    const tableBody = document.querySelector("#ordersTable tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    let filteredOrders = orders;
    if (statusFilter !== "All") {
        filteredOrders = orders.filter(order => order.status === statusFilter);
    }
    if (orderIdFilter) {
        const regex = new RegExp(orderIdFilter, "i"); // Case-insensitive fuzzy matching
        filteredOrders = filteredOrders.filter(order => regex.test(order._id));
    }

    filteredOrders.sort((a, b) => {
        let valA = a[sortBy] || "";
        let valB = b[sortBy] || "";

        if (sortBy === "createdAt") {
            valA = new Date(valA);
            valB = new Date(valB);
        } else if (sortBy === "area" || sortBy === "perimeter") {
            valA = parseFloat(valA);
            valB = parseFloat(valB);
        }

        return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    if (filteredOrders.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='8'>No orders found.</td></tr>";
        return;
    }

    filteredOrders.forEach(order => {
        const row = document.createElement("tr"); // Ensure row is correctly defined
        const status = order.status || "Pending";
        const statusClass = status.toLowerCase();

        // Create status dropdown
        const statusOptions = ["Pending", "Processing", "Completed"];
        const statusDropdown = `<select class="status-dropdown status-${statusClass}" id="status-${order._id}" onchange="updateOrderStatus('${order._id}')">
            ${statusOptions.map(option => `<option value="${option}" ${status === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>`;

        row.innerHTML = `
            <td>${order._id}</td>
            <td>${order.user.email || "Unknown"}</td>
            <td>${order.searchType}</td>
            <td>${order.polygon.area} ha</td>
            <td>${order.polygon.perimeter} m</td>
            <td>${order.turnaroundTime}</td>
            <td class="status-${statusClass}">${statusDropdown}</td>
            <td>
                <button onclick="deleteOrder('${order._id}')">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

function setupOrderIdFilter() {
    const filterContainer = document.createElement("div");
    filterContainer.innerHTML = `
        <label for="orderIdFilter">Filter by Order ID:</label>
        <input type="text" id="orderIdFilter" placeholder="Enter Order ID" oninput="fetchOrders(document.getElementById('statusFilter').value, document.getElementById('sortBy').value, document.getElementById('sortOrder').value, this.value)">
    `;
    document.body.insertBefore(filterContainer, document.getElementById("ordersTable"));
}
