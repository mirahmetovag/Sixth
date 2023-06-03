const Io = require ('../utils/Io');
const Posts = new Io ('./database/posts.json')
const Users = new Io ('./database/users.json');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

const key = process.env.JWT_SECRET_KEY;

const create = async (req,res) => {
    const {title,text} = req.body;
    const posts = await Posts.read();
    const id = (posts[posts.length - 1]?.id || 0) + 1;
    const token = req.headers.authorization.split(" ")[1];
    const {id: user_id} = jwt.verify(token, key);
    const newPost = new Post (id,title, text,user_id)
    const data = posts.length ? [...posts, newPost] : [newPost];
    await Posts.write(data);
    res.status(201).json({message:"Created"});
}

const update = async (req,res) => {
    const posts = await Posts.read();
    const {id, title, text} = req.body;
    const {id: user_id} = jwt.verify(req.headers.authorization.split(" ")[1], key);
    const findPost = posts.find((post) => post.id === id);
    if (findPost && user_id === findPost.user_id){
        title ? findPost.title = title : findPost.title;
        text ? findPost.text = text : findPost.text;
    } else if (findPost && user_id != findPost.user_id) {
        res.status(400).json({message: "You are not allowed to update this post"});
    } else {
        res.status(404).json({message:"Post was not found"});
    }
    await Posts.write(posts);
    res.status(200).json({message: `${id} post was updated`})
}

const getAll = async (req, res) => {
    const posts = await Posts.read();
    const {id: user_id} = jwt.verify(req.headers.authorization.split(" ")[1], key);
    
    const myPosts = posts.filter((posts) => posts.user_id === user_id);
    const users = await Users.read();
    const findUser = users.find((user) => user.id == user_id);
    const allPosts = myPosts.map((post) => {
    post.user_id = findUser;
    return post;
});

    res.status(200).json({myPosts: allPosts});
}

module.exports= {
    create,
    getAll,
    update
}