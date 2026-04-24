const Student = require("../models/Student");

// Helper: find student by studentId first, then fallback to MongoDB _id
async function findStudent(id) {
  // First try to find by studentId field
  const student = await Student.findOne({ studentId: id });
  if (student) return student;
  // Fallback: try MongoDB ObjectId
  try {
    return await Student.findById(id);
  } catch {
    return null;
  }
}

// @desc    Create a new student
// @route   POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, email, course, phone, enrollmentYear } = req.body;

    // Check if studentId already exists
    const existingId = await Student.findOne({ studentId });
    if (existingId) {
      return res.status(409).json({
        success: false,
        message: "A student with this Student ID already exists",
      });
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "A student with this email already exists",
      });
    }

    const student = new Student({
      studentId,
      name,
      email,
      course,
      phone,
      enrollmentYear,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: `Student created successfully with ID: ${student.studentId}`,
      data: student,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get all students with filtering, sorting, and pagination
// @route   GET /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "-createdAt",
      course,
      status,
      search,
    } = req.query;

    // Build filter
    const filter = {};
    if (course) filter.course = course;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get single student by studentId (STU0001) or MongoDB _id
// @route   GET /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await findStudent(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Update student by studentId or MongoDB _id
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    // Try to find by studentId first, then by MongoDB _id
    let student = await Student.findOne({ studentId: req.params.id });
    if (!student) {
      try {
        student = await Student.findById(req.params.id);
      } catch {
        // Invalid ObjectId format, ignore
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`,
      });
    }

    // If studentId is being changed, check it's not taken by another student
    if (req.body.studentId && req.body.studentId !== student.studentId) {
      const existing = await Student.findOne({ studentId: req.body.studentId });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "A student with this Student ID already exists",
        });
      }
    }

    // Update fields
    Object.assign(student, req.body);
    await student.save();

    res.status(200).json({
      success: true,
      message: `Student ${student.studentId} updated successfully`,
      data: student,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Delete student by studentId or MongoDB _id
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    // Try to find by studentId first, then by MongoDB _id
    let student = await Student.findOneAndDelete({ studentId: req.params.id });
    if (!student) {
      try {
        student = await Student.findByIdAndDelete(req.params.id);
      } catch {
        // Invalid ObjectId format, ignore
      }
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Student ${student.studentId} deleted successfully`,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get student statistics
// @route   GET /api/students/stats/overview
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: "Active" });

    const courseDistribution = await Student.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const statusDistribution = await Student.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const yearDistribution = await Student.aggregate([
      { $group: { _id: "$enrollmentYear", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        courseDistribution,
        statusDistribution,
        yearDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
