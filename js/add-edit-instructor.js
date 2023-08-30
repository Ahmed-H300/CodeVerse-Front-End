$(document).ready(function () {
    $("#navbarContainer").load("navbar.html");

    const instructorId = getUrlParameter("id");

    if (instructorId) {
        // Fetch instructor details by ID and pre-fill the form
        fetchInstructorDetails(instructorId);
        $("#submitBtn").text("Update Instructor");
    }

    $("#instructorForm").submit(function (event) {
        event.preventDefault();
        const formData = {
            firstName: $("#firstName").val(),
            lastName: $("#lastName").val(),
            email: $("#email").val(),
            instructorDetails: {
                "salary": $("#salary").val()
            }
        };

        if (instructorId) {
            // Editing an existing instructor
            updateInstructor(instructorId, formData);
        } else {
            // Adding a new instructor
            addInstructor(formData);
        }
        window.location.href = "instructor.html";
    });
});

function fetchInstructorDetails(instructorId) {
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/instructors/${instructorId}`,
        type: "GET",
        success: function (instructor) {
            $("#firstName").val(instructor.firstName);
            $("#lastName").val(instructor.lastName);
            $("#email").val(instructor.email);
            $("#salary").val(instructor.instructorDetails.salary);
        },
        error: function () {
            console.log("Error fetching instructor details");
        }
    });
}

function addInstructor(formData) {
    $.ajax({
        url: "http://127.0.0.1:8080/codeverseuni/api/v1/instructors/",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
            // Handle success
        },
        error: function () {
            console.log("Error adding instructor");
        }
    });
}

function updateInstructor(instructorId, formData) {
    formData.id = instructorId;
    $.ajax({
        url: `http://127.0.0.1:8080/codeverseuni/api/v1/instructors/`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
            // Handle success
        },
        error: function () {
            console.log("Error updating instructor");
        }
    });
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}
