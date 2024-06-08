$(document).ready(function () {
  //! API
  const apiUrl = "https://jsonplaceholder.typicode.com/todos";

  //! RETRIEVE THE TASKS FROM API
  function fetchTasks(limit = 15) {
    $.get(`${apiUrl}?_limit=${limit}`, function (tasks) {
      displayTasks(tasks);
    });
  }

  //! BUILD LIST FOR TASKS
  function displayTasks(tasks) {
    $("#task-list").empty();
    tasks.forEach((task) => {
      const taskItem = `
            <li id="task-${
              task.id
            }" class="task-item flex justify-between items-center p-2 bg-white shadow rounded mb-2" draggable="true" data-id="${
        task.id
      }">
                <div class="inline-flex items-center">
                    <input type="checkbox" id="task-${
                      task.id
                    }" class="task-status appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-primary checked:border-transparent focus:outline-none focus:ring-2 focus:ring-primary" data-id="${
        task.id
      }" ${task.completed ? "checked" : ""}>
                                    <label for="task-${task.id}" class="ml-2 ${
        task.completed ? "line-through" : ""
      }">${task.title}</label>
                                </div>
                                <div>
                                    <button id="editTask" class="edit-task p-1 rounded" data-id="${
                                      task.id
                                    }">
                                        <img src="img/edit.png" alt="Edit" class="w-5 h-5">
                                    </button>
                                    <button id="deleteTask" class="delete-task p-1 rounded" data-id="${
                                      task.id
                                    }">
                        <img src="img/delete.png" alt="Delete" class="w-4 h-4">
                    </button>
                </div>
            </li>
        `;
      $("#task-list").append(taskItem);
    });
    addDragAndDropListeners();
  }

  //! ADD NEW TASK
  let nextTaskId = 16; // Start the new task ID from 201
  function addTask(title) {
    $.post(apiUrl, { title, completed: false }, function (newTask) {
      // Since jsonplaceholder is a mock API, we'll use our counter for new task IDs
      newTask.id = nextTaskId++;
      newTask.completed = false;

      // Create the new task element
      const taskItem = `
           <li id="task-${newTask.id}" class="task-item flex justify-between items-center p-2 bg-white shadow rounded mb-2" draggable="true" data-id="${newTask.id}">
              <div class="inline-flex items-center">
                  <input type="checkbox" id="task-${newTask.id}" class="task-status appearance-none h-5 w-5 border border-gray-300 rounded-md checked:bg-primary checked:border-transparent focus:outline-none focus:ring-2 focus:ring-primary" data-id="${newTask.id}">
                  <label for="task-${newTask.id}" class="ml-2">${newTask.title}</label>
              </div>
              <div>
                  <button id="editTask" class="edit-task p-1 rounded" data-id="${newTask.id}">
                      <img src="img/edit.png" alt="Edit" class="w-4 h-4">
                  </button>
                  <button id="deleteTask" class="delete-task p-1 rounded" data-id="${newTask.id}">
                      <img src="img/delete.png" alt="Delete" class="w-4 h-4">
                  </button>
              </div>
          </li>
      `;
      // Append the new task element to the task list
      $("#task-list").append(taskItem);
    });
    createGlobalPopup("Task added!");
    addDragAndDropListeners();
  }

  $("#add-task").click(function () {
    const title = $("#new-task-title").val();
    if (title) {
      addTask(title);
      $("#new-task-title").val("");
    }
  });

  //! DELETE TASK
  $(document).on("click", ".delete-task", function () {
    const taskId = $(this).data("id");
    $.ajax({
      url: `${apiUrl}/${taskId}`,
      type: "DELETE",
      success: function () {
        $(`#task-${taskId}`).closest("li").remove();
        createGlobalPopup("Task removed!");
      },
    });
  });

  //! EDIT TASK
  $(document).on("click", ".edit-task", function () {
    const taskId = $(this).data("id");
    const taskTitle = $(`label[for='task-${taskId}']`).text();

    // Set initial value of input field
    $("#editTaskInput").val(taskTitle);

    // Show modal
    $("#editTaskModal").removeClass("hidden");
    $("#editTaskModal").css("display", "block");

    // Handle confirm button click
    $(document).on("click", "#editTaskConfirm", function () {
      const newTitle = $("#editTaskInput").val();

      alert(newTitle);

      if (newTitle) {
        $.ajax({
          url: `${apiUrl}/${taskId}`,
          type: "PUT",
          data: JSON.stringify({ title: newTitle }),
          contentType: "application/json; charset=UTF-8",
          success: function () {
            $(`label[for='task-${taskId}']`).text(newTitle);
            $("#editTaskModal").addClass("hidden");
            $("#editTaskModal").css("display", "none");
          },
        });
      }
    });
  });

  //! CANCEL ON MODAL
  $(document).on("click", "#editTaskCancel", function () {
    $("#editTaskModal").addClass("hidden");
    $("#editTaskModal").css("display", "none");
  });

  $(document).on("change", ".task-status", function () {
    const taskId = $(this).data("id");
    const completed = $(this).is(":checked");
    if (taskId < 201) {
      $.ajax({
        url: `${apiUrl}/${taskId}`,
        type: "PUT",
        data: JSON.stringify({ completed }),
        contentType: "application/json; charset=UTF-8",
        success: function () {
          // Update the UI to reflect the change
          const label = $(`label[for='task-${taskId}']`);
          if (completed) {
            label.addClass("line-through");
          } else {
            label.removeClass("line-through");
          }
        },
      });
    } else {
      // Update the UI to reflect the change
      const label = $(`label[for='task-${taskId}']`);
      if (completed) {
        label.addClass("line-through");
      } else {
        label.removeClass("line-through");
      }
    }
  });

  //! FILTERING BUTTONS
  $("#filter-all").click(function () {
    fetchTasks();
  });

  $("#filter-completed").click(function () {
    $.get(apiUrl, function (tasks) {
      const completedTasks = tasks.filter((task) => task.completed);
      displayTasks(completedTasks);
    });
  });

  $("#filter-pending").click(function () {
    $.get(apiUrl, function (tasks) {
      const pendingTasks = tasks.filter((task) => !task.completed);
      displayTasks(pendingTasks);
    });
  });

  fetchTasks(); // Fetch tasks on load

  //! BUTTON ACTIVE STYLING
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("bg-primary");
        btn.classList.remove("text-white");
        btn.classList.add("bg-secondary");
      });
      // Add active class to the clicked button
      button.classList.remove("bg-secondary");
      button.classList.add("bg-primary");
      button.classList.add("text-white");
    });
  });

  //! POPUP MESSAGE
  function createGlobalPopup(message) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");
    popupContainer.style.display = "block";

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    const popupMessage = document.createElement("div");
    popupMessage.classList.add("popup-message");
    popupMessage.textContent = message;

    const closePopupButton = document.createElement("button");
    closePopupButton.classList.add("popup-button");
    closePopupButton.textContent = "Close";

    // Append elements to popupContent
    popupContent.appendChild(popupMessage);

    popupContent.appendChild(closePopupButton);

    // Append popupContent to popupContainer
    popupContainer.appendChild(popupContent);

    // Append popupContainer to the body
    document.body.appendChild(popupContainer);

    closePopupButton.addEventListener("click", () => {
      if (document.body.contains(popupContainer)) {
        document.body.removeChild(popupContainer);
      }
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(popupContainer)) {
        document.body.removeChild(popupContainer);
      }
    }, 5000); // 5 seconds in milliseconds
  }

  //! DRAG AND DROP
  function addDragAndDropListeners() {
    const taskItems = document.querySelectorAll(".task-item");

    taskItems.forEach((item) => {
      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragover", handleDragOver);
      item.addEventListener("drop", handleDrop);
      item.addEventListener("dragend", handleDragEnd);
    });
  }

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.currentTarget.classList.add("dragging");
  }

  function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    const container = document.getElementById("task-list");
    const dragging = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(dragging);
    } else {
      container.insertBefore(dragging, afterElement);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove("dragging");
  }

  function getDragAfterElement(y) {
    const taskItems = [
      ...document.querySelectorAll(".task-item:not(.dragging)"),
    ];

    return taskItems.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  //! THEME TOGGLE `incomplete`
  document
    .getElementById("theme-toggle")
    .addEventListener("click", function () {
      const html = document.documentElement;
      if (html.classList.contains("light")) {
        html.classList.remove("light");
        html.classList.add("dark");
        document.body.classList.remove("bg-lightBg", "text-lightText");
        document.body.classList.add("bg-darkBg", "text-darkText");
      } else {
        html.classList.remove("dark");
        html.classList.add("light");
        document.body.classList.remove("bg-darkBg", "text-darkText");
        document.body.classList.add("bg-lightBg", "text-lightText");
      }
    });
});
