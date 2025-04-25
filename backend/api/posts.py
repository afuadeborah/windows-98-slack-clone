from flask import Blueprint, jsonify, Response, request
from models import Post, Comment, User, db

posts = Blueprint("posts", __name__)


@posts.route("/posts", methods=["GET"])
def get_posts() -> Response:
    posts: list[Post] = Post.query.all()

    comment_counts: list[tuple[int, int]] = (
        db.session.query(Comment.post_id, db.func.count(Comment.id))
        .group_by(Comment.post_id)
        .all()
    )

    comment_counts_dict = {post_id: count for post_id, count in comment_counts}

    return jsonify(
        [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "author": post.author.username,
                "createdAt": post.created_at,
                "commentCount": comment_counts_dict.get(post.id, 0),
            }
            for post in posts
        ]
    )


@posts.route("/posts/<int:id>/comments", methods=["GET"])
def get_comments(id: int) -> Response:
    page_number: int = int(request.args.get("page", default=1))
    per_page: int = int(request.args.get("per-page", default=1))

    comments = (
        Comment.query.filter_by(post_id=id)
        .limit(per_page)
        .offset((page_number - 1) * per_page)
        .all()
    )

    return jsonify(
        [
            {
                "id": comment.id,
                "content": comment.content,
                "author": comment.author.username,
                "createdAt": comment.created_at,
            }
            for comment in comments
        ]
    )

# POST a new post
# set up route, path, and define function
@posts.route("/posts", methods=["POST"])
def add_post() -> Response:
# set up request data
    data = request.get_json()

# verify the user creating the comment exists
    user = User.query.get(data["user_id"])
    if not user: 
        return jsonify({"error": "User not found."}), 404 

# validate required fields
    if not data or "title" not in data or "content" not in data or "user_id" not in data:
        return jsonify({"error": "Title, content, and user id are required."}), 400
    
# create new post
    new_post = Post(
        title=data["title"],
        content=data["content"],
        user_id=data["user_id"],
    )

# save and commit
    db.session.add(new_post)
    db.session.commit()

# return json response
    return jsonify({
        "message": "Post created successfully.", 
        "post": {
            "id": new_post.id,
            "title": new_post.title,
            "content": new_post.content,
            "createdAt": new_post.created_at,
            "author": user.username,
        }}), 201


# UPDATE a post
# set up path, route, define function and pass in id arg
@posts.route("/posts/<int:id>", methods=["PUT"])
def update_post(id: int) -> Response:
# set up request data
    data = request.get_json(); 

# validate post exists at that id
    post = Post.query.get(id);
    if not post or post.id != id:
        return jsonify({"error": "Post was not found"}), 404
    
# validate required fields
    if not data or "title" not in data or "content" not in data:
        return jsonify({"error": "Title and content is required"}), 400
    
# update fields
    title = data["title"]
    content = data["content"]

# commit
    db.session.commit()

# return json response
    return jsonify({"message": "Post successfully updated.", "post": {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "createdAt": post.created_at,
        "author": post.author.username,
    }})

# DELETE a post
@posts.route("/posts/<int:id>", methods=["DELETE"])
def delete_post(id: int) -> Response:
# set up path, route, define function and pass in id
# validate post exists with same id
    post = Post.query.get(id)
    if not post or post.id != id:
        return jsonify({"error": "Post not found."}), 404
    
# delete and commit
    db.session.delete(post)
    db.session.commit()

# return json response
    return jsonify({"message": "Post successfully deleted."}), 200


# POST a new comment
@posts.route("/posts/<int:id>/comments", methods=["POST"])
# define function, access Response obj
def create_comment(id: int) -> Response: 
# set up request data
    data = request.get_json()

# verify the post and user exist at an id
    post = Post.query.get(id)
    if not post:
        return jsonify({"error": "Post not found."}), 404
    
    user = User.query.get(data["user_id"])
    if not user:
        return jsonify({"error": "User not found."}), 404
    
# validate required fields
    if not data or "content" not in data or "user_id" not in data or "post_id" not in data:
        return jsonify({"error": "Content, user id, and post id are required."}), 400
    
# create new comment
    new_comment = Comment(
        content=data["content"],
        user_id=data["user_id"],
        post_id=id
    )

# add and commit
    db.session.add(new_comment)
    db.session.commit()

# return json response
    return jsonify({
        "message": "Comment created successfully.",
        "comment": {
            "id": new_comment.id,
            "content": new_comment.content,
            "userId": new_comment.user_id,
            "postId": new_comment.post_id,
            "createdAt": new_comment.created_at,
            "author": user.username,
        }
    }), 201


# UPDATE a comment 
@posts.route("/posts/<int:postId>/comments/<int:commentId>", methods=["PUT"])
# define function and access request
def update_comment(postId: int, commentId: int) -> Response:
# set up data
    data = request.get_json()

# validate required fields
    if not data or "content" not in data:
        return jsonify({"error": "Content is required."}), 400
    
# validate post and comment exists at the specific ids
    post = Post.query.get(postId)
    if not post:
        return jsonify({"error": "Post not found."}), 404
    
    comment = Comment.query.get(commentId)
    if not comment or comment.post.id != postId:
        return jsonify({"error": "Comment not found for this post."}), 404
    
# update field
    comment.content = data["content"]

# commit
    db.session.commit()

# return json response
    return jsonify({
        "message": "Comment successfully updated.", 
        "comment": {
            "id": comment.id,
            "content": comment.content,
            "userId": comment.user_id,
            "createdAt": comment.created_at,
            "author": comment.author.username
        }
    }), 200


# DELETE a comment
@posts.route("/posts/<int:postId>/comments/<int:commentsId>", methods=["DELETE"])
# define function and access request
def delete_comment(postId: int, commentId: int) -> Response:

# validate the post and comment exist at the specific ids
    comment = Comment.query.get(commentId)
    if not comment:
        return jsonify({"error": "Comment not found."}), 404
    # does the comment belong to the right post?
    post = Post.query.get(postId)
    if not post or postId != post.id:
        return jsonify({"error": "Post not found."}), 404
    
# pass in comment, add and commit
    db.session.delete(comment)
    db.session.commit()
    
# return json message
    return jsonify({"message: Comment successfully deleted."}), 200