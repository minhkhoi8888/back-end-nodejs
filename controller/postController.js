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
// @access Private
const createNewPost = async (req, res) => {
    const { title, description, type, spelling, image } = req.body;

    // Confirm data
    if (!title && !description && !type && !spelling) {
        return res.status(400).json({ message: "Field: title, description, type, spelling are requied" });
    }

    // Check duplicate title 
    const duplicate = await Posts.findOne({ title }).collation({ locate: "en", strength: 2 }).lean();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate post title" })
    }

    // Create and store new post
    let post = { title, description, type, spelling }
    if (image) {
        post["image"] = image;
    }
    
    const isCreate = await Posts.create(post)

    if (isCreate) {
        return res.status(201).json({ message: "New post created" });
    } else  {
        return res.status(400).json({ message: "Invalid post data received" });
    }
}

// @desc Update a post
// @route PATCH /posts
// @access Private
const updatePost = async (req, res) => {
    const {id, title, description, type, spelling, image} = req.body;

    // Confirm data
    if (!title && !description && !type && !spelling && !id) {
        return res.status(400).json({ message: "Field: title, description, type, spelling, id are requied" });
    }

    // Check post is exist
    const post = Posts.findById(id);

    if (!post) {
        return res.status(400).json({ message: "Post not found" });
    }

    // Check for duplicate title
    const duplicate = await Posts.findOne({ title }).collation({ locate: "en", strength: 2 }).lean();

    if (duplicate) {
        return res.status(409).json({ message: "Duplicate post title" })
    }

    post.title = title;
    post.description = description;
    post.type = type;
    post.spelling = spelling;
    if (image) {
        post.image = image;
    }

    const updatePost = await post.save();

    res.json(`"${updatePost.title}" updated`);
}

// @desc Delete a post
// @route DELETE /posts
// @access Private
const deletePost = async (res, req) => {
    const { id, userId } = req.body;
    
    if (!id) {
        return res.status(400).json({ message: "Post ID required" });
    }

    if (userId) {
        const user = User.findById(userId)

        if(!user || !user.role?.includes("admin")) {
            return res.status(400).json({ message: "Can not delete" });
        }
    }

    const post = await Posts.findById(id);
    
    if (!post) {
        return res.status(400),json({ message: "Post not found" });
    }

    const result = await post.deleteOne();

    const reply = `Post '${result.title}' with ID ${result._id} deleted`;

    res.json(reply);
}


module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost
};