import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../../lib/dbConnect";
import User from "../../../../../models/user";

export async function POST(request: NextRequest) {
    try {
        //Get data from frontend...
        const { email, password } = await request.json();
        //Validation..
        if (!email || !password) {
            return NextResponse.json({
                error: "Email and Password are required.",
                status: 400
            });
        }

        //Check for DB Connection...(already done in dbConnect function)
        await ConnectDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                error: "user already registered.",
                status: 400
            });
        }
        await User.create({
            email, password
        });

        return NextResponse.json({
            message: "User Registered Successfully.",
            status: 200
        });
    }
    catch (error) {
        console.error("registration error!")
        return NextResponse.json({
            error: "Failed to Register User",
            status: 400
        });
    }
}