const Posts = require("../model/Posts");
const User = require("../model/User");

// @desc Get all posts
// @route GET /posts
// @access Private
const getAllPosts = async (req, res) => {
    // Get all post from MonggoDB
    const posts = await Posts.find().lean();
    
    // Check
    if(!posts?.length) {
        return res.status(400).json({ message: "No posts found" });
    }

    const postsWithUser = await Promise.all(posts.map(async()=>{
        const user = await User.findById(posts.user).lean().exec();
        return {... posts, username: user.username}
    }))

    res.json(postsWithUser)
}

// @desc Create new post
// @route POST /posts
// @access PRivate
