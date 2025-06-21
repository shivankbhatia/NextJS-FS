import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "../../../../lib/dbConnect";
import Video, { IVideo } from "../../../../models/video"; // Adjust the path as needed to your Mongoose model
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
    try {
        await ConnectDB();
        const videos = await Video.find({}).sort({ createdAt: -1 }).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }
        return NextResponse.json(videos, { status: 200 })
    } catch (error) {
        console.error("Failed to fetch videos.")
        return NextResponse.json(
            {
                error: "Failed to fetch Videos.",
                status: 500
            }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                {
                    error: "Unauthorised.",
                    status: 401
                }
            )
        }
        await ConnectDB();
        const body: IVideo = await request.json();
        if (!body.title || !body.description || !body.videoURL || !body.thumbnailURL) {
            return NextResponse.json(
                {
                    error: "Missing required fields.",
                    status: 401
                }
            )
        }

        //data given by imagekit after uploading a video from frontend...
        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100,
            }
        }
        //store in database the info received...
        const newVideo = await Video.create(videoData);

        return NextResponse.json(newVideo)
    }
    catch (error) {
        console.error("Video not uploaded.")
        return NextResponse.json(
            {
                error: "Failed to upload Video.",
                status: 500
            }
        )
    }
}