import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    rank: {
        type: String,
        default: "Beginner"
    },
    institution:{
        type: String,
        default: "Unknown"
    } ,
    location:{
        type: String,
        default: "Unknown"
    },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
    totalProblemsSolved: { type: Number, default: 0 },
    role:{
        type: String,
    enum: ['user', 'admin'],
    default: 'user',
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});


// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {_id:this._id,
        role:this.role,
        email:this.email,
        username:this.username,
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { _id: this._id,},
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
}

const User = mongoose.model("User", userSchema);
export default User;