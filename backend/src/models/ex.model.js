const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // doesnt return password unless specified
    },
    age: {
      type: Number,
      min: 18,
      max: 120,
      default: 18,
    },
    roles: {
      type: [String],
      enum: ["user", "admin", "moderator"],
      default: ["user"],
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,  //Foreign key .populate()  to populate the items
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true },
    // toObject: { virtuals: true },
  }
);

// Compound index example
// userSchema.index({ email: 1, isActive: 1 });


// Middleware: hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Middleware: log after save
userSchema.post("save", function (doc, next) {
  console.log(`User ${doc.email} saved.`);
  next();
});

// Instance method: compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method: generate JWT  //called on document   
// const user = await User.findById(id);   user.generateAuthToken();
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

// Static method: find by role   //called on model  
// User.findByRole("admin");
userSchema.statics.findByRole = function (role) {
  return this.find({ roles: role });
};


// Populate example helper
userSchema.methods.populateFriends = function () {
  return this.populate("friends");
};
//const user = await User.findById(userId).populate("friends");

// Plugin example (timestamps already included, but you can add custom plugins)
// userSchema.plugin(somePlugin);



// Model creation
const User = mongoose.model("User", userSchema);

export default User; //ES6 syntax import User from './models.'
