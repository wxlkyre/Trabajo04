document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const errorMessage = document.getElementById('error-message');

    // Cargar tareas localStorage al cargar la página
    loadTasks();

    // Manejar el envío del formulario
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        // Validar que la tarea no esté vacía
        if (taskText === "") {
            showError("Por favor, escribe una tarea.");
            return;
        }

        // Crear nueva tarea
        addTask(taskText);

        // Limpiar campo de entrada
        taskInput.value = "";
        errorMessage.textContent = '';
    });

    // Agregar tarea
    function addTask(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;

        // Botón de eliminar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Eliminar";
        deleteBtn.classList.add('delete');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveTasks();
        });

        // Marcar tarea como completada
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        saveTasks();
    }

    // Mostrar mensaje de error
    function showError(message) {
        errorMessage.textContent = message;
    }

    // Guardar tareas localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(taskItem => {
            tasks.push({
                text: taskItem.firstChild.textContent,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Cargar tareas localStorage
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
            savedTasks.forEach(task => {
                addTask(task.text);
                if (task.completed) {
                    const lastTask = taskList.lastChild;
                    lastTask.classList.add('completed');
                }
            });
        }
    }
});
