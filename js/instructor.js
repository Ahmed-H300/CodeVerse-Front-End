let currentPage = 1
// instructor.js

$(document).ready(function () {
    // Load the navigation bar using jQuery's load() function
    $("#navbarContainer").load("navbar.html");

    // Initialize the current page number
    currentPage = 1;

    // Fetch instructors and populate the table
    fetchInstructors(currentPage, populateTable);
});

function fetchInstructors(pageNumber, callback) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/instructors/all?page=${pageNumber - 1}`, // Adjust the page number
        type: "GET",
        success: function (data) {
            callback(data.content);
            updatePagination(data.totalPages, pageNumber);
        },
        error: function () {
            console.log("Error fetching instructors");
        }
    });
}


function populateTable(instructors) {
    const tableBody = $("#instructorTableBody");
    tableBody.empty();

    instructors.forEach(function (instructor) {
        const row = `<tr>
                        <td>${instructor.id}</td>
                        <td>${instructor.firstName}</td>
                        <td>${instructor.lastName}</td>
                        <td>${instructor.email}</td>
                        <td>
                            <a href="instructor-details.html?id=${instructor.id}" class="btn btn-primary">Show Details</a>
                            <a href="add-edit-instructor.html?id=${instructor.id}" class="btn btn-warning">Modify</a>
                            <button class="btn btn-danger delete" data-instructor-id="${instructor.id}">Delete</button>
                        </td>
                    </tr>`;
        tableBody.append(row);
    });

    // Add click event listener to delete buttons
    $(".delete").click(function () {
        const instructorId = $(this).data("instructor-id");
        deleteInstructor(instructorId, currentPage);
    });
}


function deleteInstructor(instructorId, currentPage) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/instructors/${instructorId}`,
        type: "DELETE",
        success: function () {
            // Refresh the table after successful deletion
            fetchInstructors(currentPage, populateTable);
        },
        error: function () {
            console.log("Error deleting instructor");
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
        fetchInstructors(newPage, populateTable);
    });
}
