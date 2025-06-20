import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from "bcryptjs";

// interface decalaration in TypeScript.... (s in string)
export interface IUser {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date
};

// using the interface... to declare a Schema in JS
const userSchema = new Schema<IUser>(
    {
        // defining generics...
        // JavaScript...(S in String) 
        email: {
            type: String,
            required: true,
            unique: true
        },
        password:
        {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

// Hooks used for uploading data to Database -> pre hooks (password hashed)
// Hooks used after fetching data from Database -> post hooks
userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


