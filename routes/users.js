const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")
const authMiddleware = require('../midleware/authMiddleware')


// UPDATE USER
router.put('/update', authMiddleware, async (req, res) => {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.user._id, {
                    $set: req.body
                }, {new: true}
        )

            const {password, ...other} = await user._doc

            res.status(200).json({user: other})


        } catch (err) {
            return res.status(500).json(err);
        }


})


// DELETE USER


router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.id === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has deleted successfully")
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("User is not the same")
    }
})


// GET USER

router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
})

// GET USER BY USERNAME

router.get("/username/:id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.id})
        const {password, ...other} = await user._doc
        res.status(200).json(other)
    } catch (err) {
        res.status(500).json(err)
    }
})


// FOLLOW TO A USER
router.put("/:id/follow", authMiddleware, async (req, res) => {
    if(req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: {following: req.params.id}})
                res.status(200).json("User has been followed");

            } else {
                req.status(403).json("User is already followed")

            }
        } catch (err) {
            res.status(500).json(err)
        }

    } else {
        res.status(403).json("You cant follow yourself")
    }
})

// UNFOLLOW USER

router.put("/:id/unfollow", authMiddleware, async (req, res) => {
    if(req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({$pull: {following: req.params.id}})
                res.status(200).json("User has been unfollowed");

            } else {
                req.status(403).json("User is dont follow this")

            }
        } catch (err) {
            res.status(500).json(err)
        }

    } else {
        res.status(403).json("You cant follow yourself")
    }
})




module.exports = router
