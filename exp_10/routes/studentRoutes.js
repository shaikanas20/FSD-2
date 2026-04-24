const express = require("express");
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStats,
} = require("../controllers/studentController");

// Stats route (must be before /:id to avoid conflict)
router.get("/stats/overview", getStats);

// CRUD Routes
router.route("/")
  .get(getAllStudents)
  .post(createStudent);

router.route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
