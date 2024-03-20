document.addEventListener('DOMContentLoaded', () => {
    const courseForm = document.getElementById('courseForm');
    const taskEntry = document.getElementById('taskEntry');
    const taskForm = document.getElementById('taskForm');
    const enterCourseBtn = document.getElementById('enterCourseBtn');
    
    enterCourseBtn.addEventListener('click', () => {
        const studentName = document.getElementById('studentName').value;
        const courseId = document.getElementById('courseId').value;
        const courseName = document.getElementById('courseName').value;

        fetch('/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentName, courseId, courseName })
        })
        .then(response => {
            if (response.ok) {
                courseForm.style.display = 'none';
                taskEntry.style.display = 'block';
            } else {
                console.error('Failed to add course.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const courseId = document.getElementById('courseId').value; 
        const taskName = document.getElementById('taskName').value;
        const dueDate = document.getElementById('dueDate').value;
        const details = document.getElementById('details').value;

        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId, taskName, dueDate, details })
        })
        .then(response => {
            if (response.ok) {
                const returnToCourse = confirm('Task added successfully! Return to course page?');
                if (returnToCourse) {
                    window.location.href = '/'; 
                } else {
                    taskForm.reset();
                }
            } else {
                console.error('Failed to add task.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
