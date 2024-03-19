import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { APiResponce } from "../utils/apiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/videos.models.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    let { page = 1, limit = 10 } = req.query
    page = isNaN(page) ? 1 : Number(page)
    limit = isNaN(limit) ? 1 : Number(limit)
    if (!videoId.trim() || !isValidObjectId(videoId)) {
        throw new ApiError(401, "Video id is Required")
    }
    if (page <= 0) {
        page = 1
    }
    if (limit <= 10) {
        limit = 10
    }

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullname: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: limit
        }
    ])

    if (!comments) {
        throw new ApiError(401, "Cannot get all the comments")
    }
    
    res
        .status(200)
        .json(
            new APiResponce(200, comments, "Got all comments Succesfully")
        )



})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const content = req.body?.content?.trim();
    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Video id is not avaliable !!")
    }
    const currentUser = req.user
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(401, "Video is not avaliable")
    }
    console.log(content)
    if (!content) {
        throw new ApiError(400, "content is Required for the comment !!")
    }
    if (!currentUser || !isValidObjectId(currentUser)) {
        throw new ApiError(400, "user is Required !!")
    }

    const comment = await Comment.create(
        {
            content: content,
            video: video,
            owner: currentUser
        }
    )
    res
        .status(200)
        .json(
            new APiResponce(200, comment, "Added Comment Succesfullt")
        )

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(401, "Comment Id is required")
    }
    const commentContent = req.body?.content.trim();
    if (!(commentContent.trim())) {
        throw new ApiError("Comment content is Required")
    }
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: {
                content: commentContent // can be a possible error
            },
        },
        { new: true }
    )

    if (!comment) {
        throw new ApiError(401, "Comment is not avaliable")
    }
    res
        .status(200)
        .json(
            new APiResponce(200, comment, "Upated Comment Succesfully")
        )

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    if (!commentId || !isValidObjectId(commentId)) {
        throw new ApiError(400, "Comment id is required")
    }
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment is not avaliable")
    }
    if (!(comment.owner?.toString() == req.user?._id?.toString())) {
        throw new ApiError(301, "Comment can be only deleted by owner")
    }
    const deleteResponce = await Comment.findByIdAndDelete(comment._id)

    res
        .status(200)
        .json(
            new APiResponce(200, {}, "Commment deleted Succesfuly")
        )

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}