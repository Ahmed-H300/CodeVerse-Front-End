let currentPage = 1;

$(document).ready(function () {
    // Load the navigation bar using jQuery's load() function
    $("#navbarContainer").load("navbar.html");

    // Initialize the current page number
    currentPage = 1;

    // Fetch courses and populate the table
    fetchCourses(currentPage, populateTable);
});

function fetchCourses(pageNumber, callback) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/courses/all?page=${pageNumber - 1}`, // Adjust the page number
        type: "GET",
        success: function (data) {
            callback(data.content);
            updatePagination(data.totalPages, pageNumber);
        },
        error: function () {
            console.log("Error fetching courses");
        }
    });
}

function populateTable(courses) {
    const tableBody = $("#courseTableBody");
    tableBody.empty();

    courses.forEach(function (course) {
        const row = `<tr>
                        <td>${course.id}</td>
                        <td>${course.title}</td>
                        <td>
                            <button class="btn btn-primary details" data-course-id="${course.id}">Details</button>
                            <button class="btn btn-warning modify" data-course-id="${course.id}">Modify</button>
                            <button class="btn btn-danger delete" data-course-id="${course.id}">Delete</button>
                        </td>
                    </tr>`;
        tableBody.append(row);
    });

    // Add click event listeners to buttons
    $(".details").click(function () {
        const courseId = $(this).data("course-id");
        // Redirect to course details page with the specific course ID
        window.location.href = `course-details.html?id=${courseId}`;
    });

    $(".modify").click(function () {
        const courseId = $(this).data("course-id");
        // Redirect to edit course page with the specific course ID
        window.location.href = `add-edit-course.html?id=${courseId}`;
    });

    $(".delete").click(function () {
        const courseId = $(this).data("course-id");
        deleteCourse(courseId, currentPage);
    });
}

function deleteCourse(courseId, currentPage) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/courses/${courseId}`,
        type: "DELETE",
        success: function () {
            // Refresh the table after successful deletion
            fetchCourses(currentPage, populateTable);
        },
        error: function () {
            console.log("Error deleting course");
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
        fetchCourses(newPage, populateTable);
    });
}
