function toggleDroplist() {
    var droplistContent = document.getElementById("droplistContent");
    droplistContent.style.display = (droplistContent.style.display === "block") ? "none" : "block";
  }

  // Close the droplist only when clicking outside the droplist button or its children
  window.onclick = function(event) {
    var droplistButton = document.querySelector('.droplist-button');
    var droplistContent = document.getElementById("droplistContent");

    if (!event.target.closest('.droplist-container')) {
      droplistContent.style.display = "none";
    }
  }

  // Stop event propagation when clicking on checkboxes or labels
  function stopPropagation(event) {
    event.stopPropagation();
  }