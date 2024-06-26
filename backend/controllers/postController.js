import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import {v2 as cloudinary} from 'cloudinary';

export const createPost=async(req,res)=>{
    
    try {
        const {postedBy,text}=req.body;
        let {img}=req.body;

        if(!postedBy || !text){
        return res.status(400).json({error:"PostedBy and text fields are required"})
        }

        const user=await User.findById(postedBy);
        if(!user){
        return res.status(400).json({error:"User not found"})
        }

        if(user._id.toString()!==req.user._id.toString()){
        return res.status(400).json({error:"Unauthorized to create post"})
        }

        const maxLength=500;
        if(text.length>maxLength){
        return res.status(400).json({error:`Text must be less than ${maxLength} characters`})
        }

        if(img){
            
            const uploadedResponse=await cloudinary.uploader.upload(img);
            img=uploadedResponse.secure_url;             
        }

        const newPost=new Post({postedBy,text,img});
        await newPost.save();
        return res.status(201).json(newPost)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}

export const getPost=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        if(!post){
        return res.status(400).json({error:"Post Not found"})
        }
        return res.status(200).json(post)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}

export const deletePost=async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        
        if(!post){
        return res.status(400).json({error:"Post Not found"})
        }
        
        if(post.postedBy.toString()!==req.user._id.toString()){
        return res.status(401).json({error:"Unauthorized to delete post"})       //401 for unauthorized

        }
       
        if(post.img){
           const value= await cloudinary.uploader.destroy(post.img.split("/").pop().split(".")[0])       //for removing the old image from cloudinary
        }

        await Post.findByIdAndDelete(req.params.id);
        return res.status(200).json({message:"Post deleted successfully"})       //401 for unauthorized

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}

export const likeUnlikePost=async(req,res)=>{
    try {
        const {id:postId}=req.params
        const post=await Post.findById(postId)
        const userId=req.user._id;
        if(!post){
        return res.status(400).json({error:"Post Not found"})
        }
       const userLikedPost=post.likes.includes(userId);

       if(userLikedPost){
            //unlike post
            await Post.updateOne({_id:postId},{$pull:{likes:userId}})
            return res.status(200).json({message:"Post unliked successfully"})       //401 for unauthorized


       }else{
            //like post
            post.likes.push(userId)
            await post.save();
            // console.log(post);
            return res.status(200).json({message:"Post liked successfully"})       //401 for unauthorized

       }   

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}



export const replyToPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;
		const userProfilePic = req.user.profilePic;
		const username = req.user.username;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const reply = { userId, text, userProfilePic, username };

		post.replies.push(reply);
		await post.save();

		res.status(200).json(reply);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getFeedPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });        //-1 means sort in descending order

		res.status(200).json(feedPosts);
	} catch (err) {
        console.log("feed")
		res.status(500).json({ error: err.message });
	}
};

export const getUserPosts = async (req, res) => {
	const { username } = req.params;
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};