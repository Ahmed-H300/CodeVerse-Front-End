$(document).ready(function () {
    $("#navbarContainer").load("navbar.html");

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    if (courseId) {
        // Fetch course details by ID and pre-fill the form for editing
        fetchCourseDetails(courseId);
        $("#submitBtn").text("Update Course");
    }

    $("#courseForm").submit(function (event) {
        event.preventDefault();
        const formData = {
            title: $("#title").val(),
            instructorId: $("#instructorId").val()
        };

        if (courseId) {
            // Editing an existing course
            updateCourse(courseId, formData);
        } else {
            // Adding a new course
            addCourse(formData);
        }
    });
});

function fetchCourseDetails(courseId) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/courses/${courseId}`,
        type: "GET",
        success: function (course) {
            // Populate form fields with retrieved course details
            $("#title").val(course.title);
        },
        error: function () {
            console.log("Error fetching course details");
        }
    });
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/courses/instructor/${courseId}`,
        type: "GET",
        success: function (instructor) {
            // Populate form fields with retrieved course details
            
            $("#instructorId").val(instructor.id);
        },
        error: function () {
            console.log("Error fetching course details");
        }
    });
}

function addCourse(formData) {
    $.ajax({
        url: "http://127.0.0.1:8080/codeverseuni/api/v1/courses/",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function () {
            // Redirect to the course portal after successful addition
            window.location.href = "courses.html";
        },
        error: function () {
            console.log("Error adding course");
        }
    });
}

function updateCourse(courseId, formData) {
    $.ajax({
        url: "http://127.0.0.1:8080/codeverseuni/api/v1/courses/",
        type: "PUT",
        data: JSON.stringify({
            id: courseId,
            title: formData.title,
            instructorId: formData.instructorId
        }),
        contentType: "application/json",
        success: function () {
            // Redirect to the course portal after successful update
            window.location.href = "courses.html";
        },
        error: function () {
            console.log("Error updating course");
        }
    });
}
