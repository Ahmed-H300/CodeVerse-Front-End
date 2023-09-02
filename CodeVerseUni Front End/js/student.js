let currentPage = 1;

$(document).ready(function () {
    // Load the navigation bar using jQuery's load() function
    $("#navbarContainer").load("navbar.html");

    // Initialize the current page number
    currentPage = 1;

    // Fetch students and populate the table
    fetchStudents(currentPage, populateTable);
});

function fetchStudents(pageNumber, callback) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/students/all?page=${pageNumber - 1}`,
        type: "GET",
        success: function (data) {
            callback(data.content);
            updatePagination(data.totalPages, pageNumber);
        },
        error: function () {
            console.log("Error fetching students");
        }
    });
}

function populateTable(students) {
    const tableBody = $("#studentTableBody");
    tableBody.empty();

    students.forEach(function (student) {
        const row = `<tr>
                        <td>${student.id}</td>
                        <td>${student.firstName}</td>
                        <td>${student.lastName}</td>
                        <td>${student.email}</td>
                        <td>
                            <button class="btn btn-primary details" data-student-id="${student.id}">Details</button>
                            <button class="btn btn-warning modify" data-student-id="${student.id}">Modify</button>
                            <button class="btn btn-danger delete" data-student-id="${student.id}">Delete</button>
                        </td>
                    </tr>`;
        tableBody.append(row);
    });

    // Add click event listener to details buttons
    $(".details").click(function () {
        const studentId = $(this).data("student-id");
        // Redirect to student details page using studentId
        window.location.href = `student-details.html?id=${studentId}`;
    });

    // Add click event listener to modify buttons
    $(".modify").click(function () {
        const studentId = $(this).data("student-id");
        // Redirect to student edit page using studentId
        window.location.href = `add-edit-student.html?id=${studentId}`;
    });

    // Add click event listener to delete buttons
    $(".delete").click(function () {
        const studentId = $(this).data("student-id");
        deleteStudent(studentId, currentPage);
    });
}

function deleteStudent(studentId, currentPage) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/students/${studentId}`,
        type: "DELETE",
        success: function () {
            // Refresh the table after successful deletion
            fetchStudents(currentPage, populateTable);
        },
        error: function () {
            console.log("Error deleting student");
        }
    });
}

function updatePagination(totalPages, currentPage) {
    const pagination = $("#pagination");
    pagination.empty();

    for (let i = 1; i <= totalPages; i++) {
        const liClass = i === currentPage ? "page-item active" : "page-item";
        const pageLink = `<li class="${liClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        pagination.append(pageLink);
    }

    // Add click event listener to pagination links
    pagination.find("a.page-link").click(function (event) {
        event.preventDefault();
        const newPage = $(this).data("page");
        fetchStudents(newPage, populateTable);
    });
}
