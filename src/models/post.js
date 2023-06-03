class Post {
    constructor (id, title, text, user_id) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.user_id = user_id;
        this.created = new Date();
    }
}

module.exports = Post;