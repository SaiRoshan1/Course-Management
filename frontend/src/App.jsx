import { useEffect, useState } from "react";

function App() {
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [courses, setCourses] = useState([]);
  const [editId, setEditId] = useState(null);

  /* Load Courses */
  const loadCourses = async () => {
    const res = await fetch("http://localhost:5050/api/courses");
    const data = await res.json();
    setCourses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* Add or Update Course */
  const submitCourse = async () => {
    if (!courseCode || !courseName || !category || !duration) return;

    const courseData = { courseCode, courseName, category, duration };

    if (editId) {
      await fetch(`http://localhost:5050/api/courses/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:5050/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData)
      });
    }

    setCourseCode("");
    setCourseName("");
    setCategory("");
    setDuration("");
    loadCourses();
  };

  /* Edit */
  const editCourse = (c) => {
    setEditId(c._id);
    setCourseCode(c.courseCode);
    setCourseName(c.courseName);
    setCategory(c.category);
    setDuration(c.duration);
  };

  /* Delete */
  const deleteCourse = async (id) => {
    await fetch(`http://localhost:5050/api/courses/${id}`, {
      method: "DELETE"
    });
    loadCourses();
  };

  return (
    <div className="container-fluid bg-light min-vh-100 align-items-center justify-content-center">
      <h2 className="text-center mt-5">Online Course Management</h2> <br></br>
      <div className="container bg-white p-4 rounded shadow mt-2 w-50 justify-content-center">
        <h3 className="text-center mt-3 mb-4 text-success">{editId ? "Update Course" : "Add Course"}</h3>
      <input className="form-control" placeholder="Course Code" value={courseCode}
        onChange={e => setCourseCode(e.target.value)} /><br /><br />

      <input className="form-control" placeholder="Course Name" value={courseName}
        onChange={e => setCourseName(e.target.value)} /><br /><br />

      <input className="form-control" placeholder="Category" value={category}
        onChange={e => setCategory(e.target.value)} /><br /><br />

      <input className="form-control" type="number" placeholder="Duration (hours)" value={duration}
        onChange={e => setDuration(e.target.value)} /><br /><br />
      <button type="button" className="btn btn-success me-10" onClick={submitCourse} id="liveAlertBtn">
        {editId ? "Update Course" : "Add Course"}
      </button>
      </div><br></br>
      <div className="container bg-white p-4 rounded shadow w-50 mb-3">
        <h3 className="text-center mt-3 text-success">Course List</h3>
      <table className="table table-hover table-bordered table-striped mt-4 mx-auto">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Duration (Hours)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr><td colSpan="5">No Courses Found</td></tr>
          ) : (
            courses.map(c => (
              <tr key={c._id}>
                <td>{c.courseCode}</td>
                <td>{c.courseName}</td>
                <td>{c.category}</td>
                <td>{c.duration}</td>
                <td>
                  <button type="button" className="btn btn-outline-info" onClick={() => editCourse(c)}>Edit</button>
                  <button type="button" className="btn btn-outline-danger ms-2" onClick={() => deleteCourse(c._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default App;
