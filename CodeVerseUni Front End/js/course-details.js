$(document).ready(function () {
  // Load the navigation bar using jQuery's load() function
  $("#navbarContainer").load("navbar.html");

  // Get course ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  $("#reviewForm").submit(function (event) {
    event.preventDefault();
    const formData = {
        comment: $("#review").val(),
        courseId: courseId
    };

    $.ajax({
      url: "http://127.0.0.1:8080/codeverseuni/api/v1/reviews/",
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
    window.location.href = `course-details.html?id=${courseId}`;
});

  // Fetch course details
  $.ajax({
    url: `http://127.0.0.1:8080/codeverseuni/api/v1/courses/reviews/${courseId}`,
    type: "GET",
    success: function (course) {
      course = course.content[0];
      // Display course details
      const courseDetailsHtml = `
                <h4>Course ID: ${course.id}</h4>
                <h4>Title: ${course.title}</h4>
            `;
      $("#courseDetails").html(courseDetailsHtml);

      if (course.reviews && course.reviews.length > 0) {
        // Fetch and display reviews
        fetchReviews(course.reviews, course.id);
      }
      else{
        $("#reviewsList").html("<li>No reviews available.</li>");
      }
    },
    error: function () {
      console.log("Error fetching course details");
    },
  });
});

function fetchReviews(reviews, courseId) {
  const reviewsList = $("#reviewsList");
  reviewsList.empty();

  reviews.forEach(function (review) {
    const reviewItem = `
                  <li class="list-group-item">
                      Review ID: ${review.id}<br>
                      Comment: ${review.comment}<br>
                      <button class="btn btn-danger delete" data-review-id="${review.id}">Delete</button>
                  </li>
              `;
    reviewsList.append(reviewItem);
     // Add click event listener to delete buttons
     $(".delete").click(function () {
      const reviewId = $(this).data("review-id");
      deleteReview(reviewId, courseId);
  });
  });
}

function deleteReview(reviewId, courseId) {
  $.ajax({
      url: `http://127.0.0.1:8080/codeverseuni/api/v1/reviews/${reviewId}`,
      type: "DELETE",
      success: function () {
        window.location.href = `course-details.html?id=${courseId}`;

      },
      error: function () {
          console.log("Error deleting instructor");
      }
  });
}
