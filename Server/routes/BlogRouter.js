import express from 'express';

// file-imports
import { isUserAuthenticated } from '../middlewares/IsAuthMiddleware.js';
import { blogBookmark, blogBookmarkRemove, blogCheckBookmark, blogCheckLike, blogCreate, blogDislike, blogEdit, blogLike, followCheck, followUser, getAllBlogs, getAnyUserBlog, getBlogFilteredByHashtag, getBlogsFromBin, getBookmarkedBlogs, getFollowersBlog, getLikedBlogs, getMyBlogs, getTotalCount, getTrendingHashtags, listFollowers, listFollowings, moveBlogToBin, removeBlogFromBin, unFollowUser } from '../controllers/blogController.js';

//creating a router
const blogRouter = express.Router();

// api or route to create a new blog
blogRouter.post("/post", isUserAuthenticated, blogCreate)

// api or route to edit a new blog
blogRouter.post("/edit/:id", isUserAuthenticated, blogEdit)

// api or route to get all blogs
blogRouter.get("/all", isUserAuthenticated, getAllBlogs)

// api or route to get my blogs
blogRouter.get("/my", isUserAuthenticated, getMyBlogs)

// api or route to get all blogs posted by any user
blogRouter.get("/all/:id", isUserAuthenticated, getAnyUserBlog)

// api or route to get blogs posted by people I follow
blogRouter.get("/my/following", isUserAuthenticated, getFollowersBlog)

// api or route to get count of "likes and bookmarked" for a particular blog
blogRouter.get("/count/:id", isUserAuthenticated, getTotalCount)

// api or route to move a blog to bin
blogRouter.put("/bin/move/:id", isUserAuthenticated, moveBlogToBin)

// api or route to recover a blog from bin
blogRouter.put("/bin/recover/:id", isUserAuthenticated, removeBlogFromBin)

// api or route to get all the blogs from bin
blogRouter.get("/bin", isUserAuthenticated, getBlogsFromBin)

// api or route to get all the blogs filtered by a hashtag
blogRouter.get("/hashtag", isUserAuthenticated, getBlogFilteredByHashtag)

// api or route to get a list of trending hashtag
blogRouter.get("/hashtag/trending", isUserAuthenticated, getTrendingHashtags)


// <-------------- follow, unfollow, like, dislike, bookmark add/remove apis -------------->

// api or route to follow someone
blogRouter.post("/follow/:id", isUserAuthenticated, followUser)

// api or route to unfollow someone
blogRouter.delete("/follow/:id", isUserAuthenticated, unFollowUser)

// api or route to get the list of all the followers
blogRouter.get("/followers/:id", isUserAuthenticated, listFollowers)

// api or route to get the list of all the people user follows (followings)
blogRouter.get("/followings/:id", isUserAuthenticated, listFollowings)

// api or route to check whether I follow this person or not && also to check whether other person is following you or not
blogRouter.get("/follow/check/:id", isUserAuthenticated, followCheck)

// api or route to like a blog
blogRouter.post("/like/:id", isUserAuthenticated, blogLike)

// api or route to dislike a blog
blogRouter.delete("/like/:id", isUserAuthenticated, blogDislike)

// api or route to check liked by me or not
blogRouter.get("/like/:id", isUserAuthenticated, blogCheckLike)

// api or route to get all the blogs liked by this user
blogRouter.get("/like", isUserAuthenticated, getLikedBlogs)

// api or route to bookmark a blog
blogRouter.post("/bookmark/:id", isUserAuthenticated, blogBookmark)

// api or route to remove a bookmarked blog
blogRouter.delete("/bookmark/:id", isUserAuthenticated, blogBookmarkRemove)

// api or route to check liked by me or not
blogRouter.get("/bookmark/:id", isUserAuthenticated, blogCheckBookmark)

// api or route to get all the blogs bookmarked by this user
blogRouter.get("/bookmark", isUserAuthenticated, getBookmarkedBlogs)


export default blogRouter;