$(document).ready(function () {
    // Load the navigation bar using jQuery's load() function
    $("#navbarContainer").load("navbar.html");

    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("id");

    if (studentId) {
        // Fetch student details by ID and pre-fill the form for editing
        fetchStudentDetails(studentId);
        $("#submitBtn").text("Update Student");
    }

    $("#studentForm").submit(function (event) {
        event.preventDefault();
        const formData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#email").val(),
            courseIds: $("#courseIds").val().split(",").map(id => parseInt(id.trim()))
        };

        if (studentId) {
            // Editing an existing student
            updateStudent(studentId, formData);
        } else {
            // Adding a new student
            addStudent(formData);
        }
    });
});

function fetchStudentDetails(studentId) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/students/details/${studentId}`,
        type: "GET",
        success: function (student) {
            $("#firstName").val(student.firstName);
            $("#lastName").val(student.lastName);
            $("#email").val(student.email);
            $("#courseIds").val(student.courses.map(course => course.id).join(","));
        },
        error: function () {
            console.log("Error fetching student details");
        },
    });
}

function addStudent(formData) {
    $.ajax({
        url: "http://127.0.0.1:8080/codeverseuni/api/v1/students/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
            // Redirect to student list or details page
            window.location.href = "student.html";
        },
        error: function () {
            console.log("Error adding student");
        },
    });
}

function updateStudent(studentId, formData) {
    formData.id = studentId;
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/students/`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
            // Redirect to student list or details page
            window.location.href = "student-details.html?id=" + studentId;
        },
        error: function () {
            console.log("Error updating student");
        },
    });
}
