const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      minlength: [3, 'Username should be at least 3 characters long'],
      maxlength: [20, 'Username should be at most 20 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: 'Invalid email format',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password should be at least 6 characters long'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minlength: [3, 'Full name should be at least 3 characters long'],
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio should be less than 500 characters'],
      default: '',
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validates a 10-digit phone number
        },
        message: 'Invalid phone number format',
      },
    },
    profilePicture: {
      type: String, // URL to the user's profile picture (if uploaded)
      default: '',
    },
    role: {
      type: String,
      enum: ['USR', 'ADM'], // Define the roles (USR = User, ADM = Admin)
      default: 'USR', // Default role is 'USR'
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

//Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password); // Returns true or false
};

//Soft Delete
userSchema.methods.deactivateAccount = async function () {
  this.isActive = false;
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;
