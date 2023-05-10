const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/User")
const authMiddleware = require('../midleware/authMiddleware')


// Create a post

router.post("/", authMiddleware, async (req,res) => {


    try {
        const currentUser = await User.findById(req.user._id);
        const newPost = new Post({profilePicture: currentUser.profilePicture, NameUser: currentUser.name, SurnameUser: currentUser.surname, userId: req.body.userId, description: req.body.description, img: req.body.image})



        if(req.body.userId === req.user._id) {
            const savedPost = await newPost.save();
            res.status(200).json('Post created')
        } else {
            res.status(403).json("You can create post only with your ID")
        }

    } catch (err) {
        res.status(500).json(err);
    }
})



// Update a post

router.put("/:id", authMiddleware, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.user.id) {
            await post.updateOne({$set: req.body})
            res.status(200).json("Post has been updated")
        } else {
            res.status(403).json("you cant update only your post")
        }
    } catch(err) {
        res.status(500).json(err)
    }



})



// Delete post


router.delete("/:id", authMiddleware, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.user.id) {
            await post.deleteOne()
            res.status(200).json("Post has been deleted")
        } else {
            res.status(403).json("you cant update only your post")
        }
    } catch(err) {
        res.status(500).json(err)
    }



})

// Like/Unlike post


router.put("/:id/like", authMiddleware, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.user._id)) {
            await post.updateOne({$push:{likes:req.user._id}});
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({$pull:{likes:req.user._id}});
            res.status(200).json("The post has been unliked")
        }

    } catch(err) {
        res.status(500).json(err)
    }



})


// Get a post

router.get("/:id", authMiddleware, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get a post

router.get("/:id/getlikes", authMiddleware, async (req,res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post.likes)
    } catch(err) {
        res.status(500).json(err);
    }
})


// Get followed posts

router.get("/following/all", authMiddleware, async (req,res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const userPosts = await Post.find({userId:currentUser._id}).sort({createdAt: -1})
        const friendPosts = await Promise.all(
            currentUser.following.map(friendId => {
                return Post.find({userId: friendId})
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch(err) {
        res.status(500).json(err);
    }
})

// Get user posts

router.post("/myposts/all", authMiddleware, async (req,res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId:currentUser._id}).sort({createdAt: -1})


        res.status(200).json(userPosts)
    } catch(err) {
        res.status(500).json(err);
    }
})


module.exports = router;