import React, { useState } from "react";
import { PostType } from "../types";

const Post = ({
	post,
	setSelectedPost,
	deletedPost,
}: {
	post: PostType;
	setSelectedPost: (post: PostType | null) => void;
	deletedPost: (post: PostType | null) => void;
}) => {
	console.log("calamari", post);
	const [loading, setLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDeletePost = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		try {
			// set isDeleting to true and set up response
			setIsDeleting(true);
			// we need the post id here
			const response = await fetch(`/api/posts/${post.id}`, {
				method: "DELETE",
			});
			// check that response is ok
			if (!response.ok)
				throw new Error(
					`Response error deleting post: ${response.status}`
				);
			// resolve response and inform the parent component that a child has been deleted
			const deletePost = await response.json();
			deletedPost(deletePost);
			// clear inputs
			setLoading(false);
			setIsDeleting(false);
		} catch (error) {}
	};

	return (
		<div
			style={{
				border: "1px solid #ccc",
				borderRadius: "5px",
				padding: "0px 20px",
				cursor: "pointer",
				userSelect: "none",
			}}
		>
			<div onClick={() => setSelectedPost(post)}>
				<h2
					style={{
						fontSize: "1.5em",
						fontWeight: "700",
						marginBottom: "10px",
					}}
				>
					{post.title}
				</h2>
				<p style={{ marginBottom: "10px" }}>{post.content}</p>
				<p>
					<strong>Author:</strong> {post.author}
				</p>
				<p>
					<strong>Posted on:</strong>{" "}
					{new Date(post.createdAt).toLocaleDateString()}
				</p>
			</div>
			<button
				disabled={loading}
				onClick={(e) => {
					setIsDeleting(true);
					window.confirm("Are you sure you want to delete this post?")
						? handleDeletePost(e)
						: setIsDeleting(false);
				}}
			>
				Delete
			</button>
		</div>
	);
};

export default Post;
