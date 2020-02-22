// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var accordion = $("<div class = 'accordion' id = 'accordion'>").appendTo($("#articles"));

    var card = $("<div class = 'card'>").appendTo(accordion);

    var cardHeader = $("<div class = 'card-header'>").appendTo(card);

    var button = $("<button class='btn btn-link artButton' data-id='" + data[i]._id + "' type='button' data-toggle='collapse' data-target='#collapse-" + i + "' aria-expanded='false' aria-controls='collapse-" + i + "'>" + data[i].title + "</button>").appendTo(cardHeader);
    var collapse = $("<div id='collapse-" + i + "' class='collapse' aria-labelledby='headingOne' data-parent='#accordion'>").appendTo(card);
    var body = $("<div class = 'card-body'>" + data[i].title + "<br />" + data[i].link + "</div>").appendTo(collapse);

    //"<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
  $(".artButton").on("click", function () { 
    $("#comments").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/:id" + thisId
    }).then(function (data) {
      for (i = 0; i<data.length; i++) {
    var commentCard = $("<div class = 'card'>").appendTo($("#commentHistory"));
    var commentBody = $("<div class = 'card-body'>" + data[i].title).appendTo(commentCard);
    var commentText = $("<p class = 'card-text'>" + data[i].body + "</p>").appendTo(commentBody);
    var deleteButton = $("<a href = '#' class = 'btn btn-primary'>Delete This Comment" + "</a>").appendTo(commentBody);
   
      };
    });
    
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function (data) {
        console.log(data);
        // The title of the article
        $("#comments").append("<h2>" + data.title + "</h2>");
        // An input to enter a new title
        $("#comments").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");
        // If there's a note in the article
        if (data.Comment) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.comment.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.comment.body);
        }
      });
  });
});
$(document).on("click", "#savecomment", function() {
  
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});






