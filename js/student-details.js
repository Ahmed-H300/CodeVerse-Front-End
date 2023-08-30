$(document).ready(function () {
    // Load the navigation bar using jQuery's load() function
    $("#navbarContainer").load("navbar.html");

    // Get student ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("id");

    // Fetch student details
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/students/details/${studentId}`,
        type: "GET",
        success: function (student) {
            // Display student details
            const studentDetailsHtml = `
                <h4>Student ID: ${student.id}</h4>
                <h4>First Name: ${student.firstName}</h4>
                <h4>Last Name: ${student.lastName}</h4>
                <h4>Email: ${student.email}</h4>
            `;
            $("#studentDetails").html(studentDetailsHtml);

            if (student.courses && student.courses.length > 0) {
                // Fetch and display enrolled courses
                fetchCourses(student.courses);
            } else {
                $("#coursesList").html("<li>No courses enrolled.</li>");
            }
        },
        error: function () {
            console.log("Error fetching student details");
        },
    });
});

function fetchCourses(courses) {
    const coursesList = $("#coursesList");
    coursesList.empty();

    courses.forEach(function (course) {
        const courseItem = `
            <li class="list-group-item">
                Course ID: ${course.id}<br>
                Title: ${course.title}
            </li>
        `;
        coursesList.append(courseItem);
    });
}
