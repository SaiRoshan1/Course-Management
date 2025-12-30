const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

/* MongoDB Connection (LocalDB) */
mongoose.connect("mongodb://localhost:27017/courseDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* Course Model (Schema + Model in one file) */
const Course = mongoose.model("Course", {
  courseCode: { type: String, unique: true },
  courseName: String,
  category: String,
  duration: Number
});

/* CREATE Course */
app.post("/api/courses", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* READ All Courses */
app.get("/api/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

/* UPDATE Course */
app.put("/api/courses/:id", async (req, res) => {
  const updated = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

/* DELETE Course */
app.delete("/api/courses/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course Deleted" });
});

/* Server Start */
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
