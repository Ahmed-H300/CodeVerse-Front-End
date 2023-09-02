$(document).ready(function () {
  // Load the navigation bar using jQuery's load() function
  $("#navbarContainer").load("navbar.html");
  // Get the instructor ID from the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const instructorId = urlParams.get("id");

  // Fetch instructor details from the API
  fetchInstructorDetails(instructorId);
});

// Function to fetch instructor details from the API
function fetchInstructorDetails(instructorId) {
  $.ajax({
    url: `http://127.0.0.1:8080/codeverseuni/api/v1/instructors/details/${instructorId}`,
    method: "GET",
    dataType: "json",
    success: function (instructor) {
      // Display instructor details
      $("#firstName").text(instructor.firstName);
      $("#lastName").text(instructor.lastName);
      $("#email").text(instructor.email);

      // Display salary only if instructorDetails is available
      if (instructor.instructorDetails) {
        $("#salary").text(instructor.instructorDetails.salary);
      } else {
        $("#salary").text("N/A");
      }

      // Display courses if available
      if (instructor.courses && instructor.courses.length > 0) {
        const coursesList = instructor.courses
          .map((course) => `<li>${course.title}</li>`)
          .join("");
        $("#coursesList").html(coursesList);
      } else {
        $("#coursesList").html("<li>No courses available.</li>");
      }
      $("#detailsContainer").html("<p>Done fetching instructor details.</p>");
    },
    error: function () {
      // Handle error case
      $("#detailsContainer").html("<p>Error fetching instructor details.</p>");
    },
  });
}
