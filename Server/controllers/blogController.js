
// file-imports
import { blogModel } from "../models/BlogModel.js";
import { bookmarkModel } from "../models/BookmarkModel.js";
import { followerModel } from "../models/FollowersModel.js";
import { likeModel } from "../models/LikeBlogModel.js";
import { userModel } from "../models/UserModel.js";

// func to post a blog
export const blogCreate = async (req, res) => {
    let { title, intro, body, conclusion, hashtags } = req.body
    const userID = req.session.user.userId
    title = title.trim();
    intro = intro.trim();
    body = body.trim();
    conclusion = conclusion.trim();

    if (!title || !intro || !body || !conclusion) {
        return res.send({
            status: 400,
            success: false,
            message: "Given data is not complete!"
        })
    }

    const length = intro.length + body.length + conclusion.length

    if (length < 500 || length > 2000) {
        return res.send({
            status: 400,
            success: false,
            message: "Blog should have 500-2000 characters only."
        })
    }

    let userObj = await userModel.findById(userID)

    if (!userObj) {
        return res.send({
            status: 400,
            success: false,
            message: "User not found!"
        })
    }

    try {
        // update count of blogs posted by a user
        userObj = await userModel.findOneAndUpdate(
            { _id: userID }, // find user by ID
            { $inc: { blogsPosted: 1 } }, // increment the value of blogsPosted by 1
            { new: true } // new:true will return the updated document, which is optional
        )
        // save new blog to database
        const blogObj = await blogModel.create({
            title: title,
            intro: intro,
            body: body,
            conclusion: conclusion,
            hashtags: hashtags,
            user: userObj,
            name: userObj.name
        })

        return res.send({
            status: 201,
            success: true,
            message: "Blog posted",
            blog: blogObj
        })

    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal Database Error!",
            error: err
        })
    }

}

// func to get all the blogs
export const getAllBlogs = async (req, res) => {
    const skip = req.query.skip || 0
    // sorting and pagination
    try {
        const blogObjs = await blogModel.aggregate([ // using aggregate method to find data using pipeline and multiple queries
            { $match: { isDeleted: false } }, // match if blog is not deleted
            { $sort: { createdAt: -1 } }, // sorting data in desc order or by recently posted blogs
            { $skip: parseInt(skip) }, // defining the data we want to skip
            { $limit: parseInt(process.env.LIMIT) } // defining how much data we want at a time
        ])
        if (!blogObjs) {
            return res.send({
                status: 400,
                success: false,
                message: "No Blogs Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "All blogs",
            blogs: blogObjs
        })
    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all of my blogs
export const getMyBlogs = async (req, res) => {
    const userID = req.session.user.userId
    const skip = req.query.skip || 0
    //find, sort, pagination
    try {
        const blogObjs = await blogModel.find({ $and: [{ user: userID }, { isDeleted: false }] }).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(process.env.LIMIT))
        if (!blogObjs) {
            return res.send({
                status: 400,
                success: false,
                message: "No blogs posted by you!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Here are your blogs",
            blogs: blogObjs
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all blogs posted by any user
export const getAnyUserBlog = async (req, res) => {
    const userID = req.params.id
    const skip = req.query.skip || 0
    //find, sort, pagination
    try {
        const blogObjs = await blogModel.find({ $and: [{ user: userID }, { isDeleted: false }] }).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(process.env.LIMIT))
        if (!blogObjs) {
            return res.send({
                status: 400,
                success: false,
                message: "No blogs posted by you!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Here are your blogs",
            blogs: blogObjs
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get the blogs posted by people I follow
export const getFollowersBlog = async (req, res) => {
    const userID = req.session.user.userId
    const skip = req.query.skip || 0
    // list of people I follow
    const myFollowings = await followerModel.find({ user: userID }).distinct('following')
    if (!myFollowings) {
        return res.send({
            status: 400,
            success: false,
            message: "You don't have any followers!",
        })
    }

    //if user is following other users or not
    const blogs = await blogModel.aggregate([
        { $match: { user: { $in: myFollowings }, isDeleted: false } },
        { $sort: { createdAt: -1 } },
        { $skip: parseInt(skip) },
        { $limit: parseInt(process.env.LIMIT) }
    ])

    if (!blogs) {
        return res.send({
            status: 400,
            success: false,
            message: "No blogs found"
        })
    }

    return res.status(200).json({
        success: true,
        message: "All the blogs posted by the people you follow",
        blog: blogs
    })

}

// func to get a count of total likes and bookmarked for a particular blog
export const getTotalCount = async (req, res) => {
    const blogID = req.params.id;
    let likes = 0;
    let bookmarked = 0;
    try {
        // find total likes
        const totalLikes = await likeModel.find({ blog: blogID })
        if (totalLikes && totalLikes.length > 0) {
            likes = totalLikes.length
        }
        //find total bookmarked
        const totalBookmarked = await bookmarkModel.find({ blog: blogID })
        if (totalBookmarked && totalBookmarked.length > 0) {
            bookmarked = totalBookmarked.length
        }
        return res.status(200).json({
            success: true,
            message: "Total count of likes and bookmarked",
            like: likes,
            bookmark: bookmarked
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 400,
            success: false,
            message: "Internal server error"
        })
    }
}

// func to edit a blog
export const blogEdit = async (req, res) => {
    const blogID = req.params.id;
    const userID = req.session.user.userId;
    // check if this user have permission to edit this blog or not
    const findBlog = await blogModel.findOne({ $and: [{ _id: blogID }, { user: userID }] })
    if (!findBlog) {
        return res.send({
            status: 401,
            success: false,
            message: "You're not authorized to edit this blog"
        })
    }
    // cleaning up data
    let { title, intro, body, conclusion } = req.body
    title = title.trim();
    intro = intro.trim();
    body = body.trim();
    conclusion = conclusion.trim();
    // check if we have all the information
    if (!title || !intro || !body || !conclusion) {
        return res.send({
            status: 400,
            success: false,
            message: "Given data is not complete!"
        })
    }
    const length = intro.length + body.length + conclusion.length
    //check blog length
    if (length < 500 || length > 2000) {
        return res.send({
            status: 400,
            success: false,
            message: "Blog should have 500-2000 characters only."
        })
    }
    // update in db
    try {
        findBlog.title = title
        findBlog.intro = intro
        findBlog.body = body
        findBlog.conclusion = conclusion
        findBlog.isEdited = true
        await findBlog.save()
        // return
        return res.status(200).json({
            success: true,
            message: "Blog is edited",
            blog: findBlog
        })

    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal server error"
        })
    }
}

// func to move a blog to bin
export const moveBlogToBin = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    //update it's property
    try {
        const blogFind = await blogModel.findOne({ $and: [{ _id: blogID }, { user: userId }] })
        if (!blogFind) {
            return res.send({
                status: 400,
                success: false,
                message: "Invalid BlogID or user is not authorized to make changes"
            })
        }
        blogFind.isDeleted = true
        await blogFind.save()
        await userModel.findOneAndUpdate(
            { _id: userId }, // find user by ID
            { $inc: { blogsDeleted: 1 } }, // increment the value of blogsDeleted by 1
            { new: true }) // new:true will return the updated document, which is optional
        return res.status(200).json({
            success: true,
            message: "Moved to Bin",
            blog: blogFind
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to restore/remove a blog from bin
export const removeBlogFromBin = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    //update it's property
    try {
        const blogFind = await blogModel.findOne({ $and: [{ _id: blogID }, { user: userId }] })
        if (!blogFind) {
            return res.send({
                status: 400,
                success: false,
                message: "Invalid BlogID or user is not authorized to make changes"
            })
        }
        blogFind.isDeleted = false
        await blogFind.save()
        await userModel.findOneAndUpdate(
            { _id: userId }, // find user by ID
            { $inc: { blogsDeleted: -1 } }, // decrement the value of blogsDeleted by 1
            { new: true }) // new:true will return the updated document, which is optional
        return res.status(200).json({
            success: true,
            message: "Removed from Bin",
            blog: blogFind
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all the blogs from bin
export const getBlogsFromBin = async (req, res) => {
    const userId = req.session.user.userId;
    //update it's property
    try {
        const blogFind = await blogModel.find({ $and: [{ user: userId }, { isDeleted: true }] }).sort({ createdAt: -1 })
        if (!blogFind) {
            return res.send({
                status: 400,
                success: false,
                message: "Your bin is empty"
            })
        }
        return res.status(200).json({
            success: true,
            message: "All blogs from bin",
            blog: blogFind
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all the blogs filtered by a hashtag
export const getBlogFilteredByHashtag = async (req, res) => {
    const skip = req.query.skip || 0
    let hash = req.query.hash

    if (!hash) {
        return res.send({
            status: 400,
            success: false,
            message: "Please provide a hashtag"
        })
    }

    hash = "#" + hash

    try {
        const allBlogs = await blogModel.aggregate([
            { $match: { hashtags: { $in: [hash] } } }, // find blogs which have this hashtag
            { $sort: { createdAt: -1 } }, // sorting by time, recent first
            { $skip: parseInt(skip) }, // pagination
            { $limit: parseInt(process.env.LIMIT) } // only limited at a time
        ])
        if (!allBlogs) {
            return res.send({
                status: 400,
                success: false,
                message: "No  blogs found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Filtered By Hashtags",
            blog: allBlogs
        })

    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to find tog 5 trending hashtags
export const getTrendingHashtags = async (req, res) => {
    try {
        const listHashtags = await blogModel.aggregate([
            { $match: { isDeleted: false } }, // Filter out deleted blogs
            { $sort: { createdAt: -1 } }, // Sort blogs in descending order of creation date
            { $limit: parseInt(process.env.HASHTAG_BLOG_LIMIT) }, // Limit to the last 10 entries
            { $unwind: "$hashtags" }, // Unwind the hashtags array
            { $group: { _id: "$hashtags", count: { $sum: 1 } } }, // Group by hashtags and count their occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order
            { $limit: parseInt(process.env.HASHTAG_LIST_LIMIT) } // Limit to the top trending hashtags
        ]);

        if (!listHashtags) {
            res.send({
                status: 400,
                success: false,
                message: "No trending hashtag found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "List of trending hashtag",
            hashtag: listHashtags
        })

    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}



// <-------------- follow, unfollow, like, dislike, bookmark add/remove funcs -------------->

// func to follow someone
export const followUser = async (req, res) => {
    const personId = req.params.id
    const userID = req.session.user.userId

    // if personId is valid/exist or not
    const person = await userModel.findOne({ _id: personId })
    if (!person) {
        return res.send({
            status: 400,
            success: false,
            message: "Invalid ID"
        })
    }

    // check if I already follow this person or not
    const already = await followerModel.findOne({ $and: [{ user: userID }, { following: personId }] })

    if (already) {
        return res.send({
            status: 400,
            success: false,
            message: "You already follow this person"
        })
    }

    try {
        const me = await userModel.findOne({ _id: userID })
        // updating db
        const following = await followerModel.create({
            user: me,
            following: person
        })

        return res.status(201).json({
            success: true,
            message: "Following Successful",
            followDetails: following
        })
    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal server error"
        })
    }
}

// func to unfollow someone
export const unFollowUser = async (req, res) => {
    const personId = req.params.id
    const userID = req.session.user.userId

    // if personId is valid/exist or not
    const person = await userModel.findOne({ _id: personId })
    if (!person) {
        return res.send({
            status: 400,
            success: false,
            message: "Invalid ID"
        })
    }

    // check if I already follow this person or not
    const already = await followerModel.findOne({ $and: [{ user: userID }, { following: personId }] })

    if (!already) {
        return res.send({
            status: 400,
            success: false,
            message: "You don't follow this person"
        })
    }

    // updating db
    try {
        await followerModel.deleteOne({ $and: [{ user: userID }, { following: personId }] })
        return res.status(201).json({
            success: true,
            message: "Unfollowed Successfully",
        })
    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal server error"
        })
    }
}

// func to get the list of all the followers
export const listFollowers = async (req, res) => {
    const userID = req.params.id
    // find number of people follows this user
    try {
        const followers = await followerModel.find({ following: userID })
        if (!followers) {
            return res.send({
                status: 400,
                success: false,
                message: "No followers found"
            })
        }
        const followersIDs = followers.map(e => e.user)

        const userData = await userModel.find({ _id: { $in: followersIDs } })

        if (!userData) {
            return res.send({
                status: 400,
                success: false,
                message: "Unable to fetch user's data"
            })
        }

        return res.status(200).json({
            success: true,
            message: "List of your followers",
            followers: userData
        })
    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get the list of all the followings
export const listFollowings = async (req, res) => {
    const userID = req.params.id
    // find number of people user is following
    try {
        const following = await followerModel.find({ user: userID })
        if (!following) {
            return res.send({
                status: 400,
                success: false,
                message: "No following found"
            })
        }

        const followingsIDs = following.map(e => e.following)

        const userData = await userModel.find({ _id: { $in: followingsIDs } })
        if(!userData){
            return res.send({
                status: 400,
                success: false,
                message: "Unable to fetch user data"
            })
        }

        return res.status(200).json({
            success: true,
            message: "List of people you follow",
            followings: userData
        })
    } catch (err) {
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to check whether you follow a person && check other person following you or not
export const followCheck = async (req, res) => {
    const personId = req.params.id
    const userID = req.session.user.userId

    let iFollowThisPerson = false;
    let isPersonFollowMe = false;

    try {
        // check if I already follow this person or not
        const check1 = await followerModel.findOne({ $and: [{ user: userID }, { following: personId }] })
        if (check1) {
            iFollowThisPerson = true;
        }
        // check if this person following me or not
        const check2 = await followerModel.findOne({ $and: [{ user: personId }, { following: userID }] })
        if (check2) {
            isPersonFollowMe = true;
        }
        return res.send({
            status: 200,
            success: true,
            otherFollowMe: isPersonFollowMe,
            iFollowOther: iFollowThisPerson
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }

}

// func to like a blog
export const blogLike = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    // check if already liked by user or not
    const liked = await likeModel.findOne({ $and: [{ userID: userId }, { blog: blogID }] })
    if (liked) {
        return res.send({
            status: 400,
            success: false,
            message: "Already liked by you"
        })
    }
    //save in db
    try {
        await likeModel.create({
            userID: userId,
            blog: blogID
        })
        return res.status(201).json({
            success: true,
            message: 'Liked successful'
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to dislike a blog
export const blogDislike = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    // check if already liked by user or not
    const liked = await likeModel.findOne({ $and: [{ userID: userId }, { blog: blogID }] })
    if (!liked) {
        return res.send({
            status: 400,
            success: false,
            message: "You have to like it first before dislike it"
        })
    }
    // update in db
    try {
        await likeModel.deleteOne({ $and: [{ userID: userId }, { blog: blogID }] })
        return res.status(200).json({
            success: true,
            message: 'Disliked successful'
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to check blog is liked by user or not
export const blogCheckLike = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    // check if already liked by user or not
    const liked = await likeModel.findOne({ $and: [{ userID: userId }, { blog: blogID }] })
    if (liked) {
        return res.send({
            status: 200,
            success: true,
            message: "Already liked by you"
        })
    }
    return res.send({
        status: 200,
        success: false,
        message: "Not Liked By You"
    })
}

// func to get all the blogs liked by a user
export const getLikedBlogs = async (req, res) => {
    const userId = req.session.user.userId;
    const skip = req.query.skip || 0
    // check if user ever liked a blog or not
    const likedBlogs = await likeModel.find({ userID: userId }).distinct('blog')
    if (!likedBlogs) {
        return res.send({
            status: 400,
            success: false,
            message: "You didn't like any blog so far"
        })
    }
    // get the details of all the liked blogs
    try {
        const blogs = await blogModel.aggregate([
            { $match: { _id: { $in: likedBlogs }, isDeleted: false } },
            { $sort: { createdAt: -1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(process.env.LIMIT) }
        ])
        return res.status(200).json({
            success: true,
            message: "All the blogs liked by you",
            blog: blogs
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to bookmark a blog
export const blogBookmark = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    //check if already bookmarked
    const bookmark = await bookmarkModel.findOne({ $and: [{ userID: userId }, { blog: blogID }] })
    if (bookmark) {
        return res.send({
            status: 400,
            success: false,
            message: "Already bookmarked by you"
        })
    }
    try {
        await bookmarkModel.create({
            userID: userId,
            blog: blogID
        })
        return res.status(201).json({
            success: true,
            message: 'Bookmarked successfully'
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to remove bookmarked blog
export const blogBookmarkRemove = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    //check if already bookmarked
    const bookmark = await bookmarkModel.findOne({ $and: [{ userID: userId }, { blog: blogID }] })
    if (!bookmark) {
        return res.send({
            status: 400,
            success: false,
            message: "This blog is not bookmarked by you"
        })
    }
    // update in db
    try {
        await bookmarkModel.deleteOne({ $and: [{ userID: userId }, { blog: blogID }] })
        return res.status(200).json({
            success: true,
            message: 'Bookmark removed successfully'
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to check this blog is bookmarked by user or not
export const blogCheckBookmark = async (req, res) => {
    const blogID = req.params.id;
    const userId = req.session.user.userId;
    //check if already bookmarked
    const bookmark = await bookmarkModel.findOne({ $and: [{ userID: userId }, { blog: blogID }] })
    if (bookmark) {
        return res.send({
            status: 200,
            success: true,
            message: "Already bookmarked by you"
        })
    }
    return res.send({
        status: 200,
        success: false,
        message: "This blog is not bookmarked by you"
    })
}

// func to get all the blogs bookmarked by a user
export const getBookmarkedBlogs = async (req, res) => {
    const userId = req.session.user.userId;
    const skip = req.query.skip || 0
    // check if user ever liked a blog or not
    const bookmarkedBlogs = await bookmarkModel.find({ userID: userId }).distinct('blog')
    if (!bookmarkedBlogs) {
        return res.send({
            status: 400,
            success: false,
            message: "You didn't bookmark any blog so far"
        })
    }
    // get the details of all the bookmarked blogs
    try {
        const blogs = await blogModel.aggregate([
            { $match: { _id: { $in: bookmarkedBlogs }, isDeleted: false } },
            { $sort: { createdAt: -1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(process.env.LIMIT) }
        ])
        return res.status(200).json({
            success: true,
            message: "All the blogs bookmarked by you",
            blog: blogs
        })
    } catch (err) {
        console.log(err)
        return res.send({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: err
        })
    }
}