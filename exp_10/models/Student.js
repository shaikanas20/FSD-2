const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      enum: {
        values: ["BCA", "MCA", "BBA", "MBA", "BSc", "MSc", "BTech", "MTech", "PhD", "Other"],
        message: "{VALUE} is not a supported course",
      },
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    enrollmentYear: {
      type: Number,
      min: [2000, "Year must be after 2000"],
      max: [2030, "Year must be before 2030"],
      default: new Date().getFullYear(),
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Graduated", "Suspended"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// No auto-generation — studentId is provided by the user

// Virtual for display name
studentSchema.virtual("displayInfo").get(function () {
  return `${this.studentId} - ${this.name} (${this.course}) - ${this.status}`;
});

// Index for faster queries (email index already created by unique:true)
studentSchema.index({ course: 1 });
studentSchema.index({ status: 1 });

module.exports = mongoose.model("Student", studentSchema);
