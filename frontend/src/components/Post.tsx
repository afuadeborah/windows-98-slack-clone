import React, { useState } from "react";
import { PostType } from "../types";
import msnIcon from "../styles/images/msn-icon.png";

const Post = ({
	post,
	setSelectedPost,
	deletedPost,
	updatedPostState,
}: {
	post: PostType;
	setSelectedPost: (post: PostType | null) => void;
	deletedPost: (post: PostType | null) => void;
	updatedPostState: (post: PostType) => void;
}) => {
	const [loading, setLoading] = useState(false);
	const [showTimestamp, setShowTimestamp] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState<PostType["title"]>(post.title);
	const [editContent, setEditContent] = useState<PostType["content"]>(
		post.content
	);

	// Edit post
	const handleUpdateSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);

		try {
			// make api call
			const response = await fetch(`/api/posts/${post.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: editTitle,
					content: editContent,
				}),
			});
			// check if the response is okay, if not throw error
			if (!response.ok)
				throw new Error(`Error updating post: ${response.statusText}`);
			// resolve response and inform the parent component that we've updated the post
			const updatedPost = await response.json();
			updatedPostState(updatedPost);
			// clear inputs
			setEditTitle("");
			setEditContent("");
			setLoading(false);
			setIsEditing(false);
		} catch (error) {
			console.error("Post could not be updated:", error);
		}
	};

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
		<div>
			{isEditing ? (
				<form
					onSubmit={handleUpdateSubmit}
					className='d-flex flex-column my-2'
				>
					<strong>Edit Post</strong>
					<label htmlFor='title'>Title</label>
					<input
						type='text'
						required
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
					/>
					<label htmlFor='content'>Content</label>
					<textarea
						name='content'
						id='content'
						required
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
					>
						Content
					</textarea>
					<div className='d-flex '>
						<button
							className='update-form__button'
							onClick={() => setIsEditing(false)}
						>
							Cancel
						</button>
						<button type='submit'>Update</button>
					</div>
				</form>
			) : (
				<div
					className='post__container p-1 d-flex justify-content-between align-content-center'
					title={`View ${post.title}`}
				>
					<div
						className='flex-grow-1'
						onClick={() => setSelectedPost(post)}
					>
						<div className='d-flex mb-1 align-items-center'>
							<div className='post__icon'>
								<img src={msnIcon} alt='MSN Icon' />
							</div>
							<p
								className='post__information post-information__timestamp-parent'
								onMouseEnter={() => setShowTimestamp(true)}
								onMouseLeave={() => setShowTimestamp(false)}
							>
								{post.author}
								{showTimestamp && (
									<span className='post__timestamp'>
										{new Date(
											post.createdAt
										).toLocaleString()}
									</span>
								)}
							</p>
						</div>
						<p className='post__information'>{post.title}</p>
						<p>{post.content}</p>
					</div>

					<div className='d-flex flex-column align-items-end justify-content-center'>
						<button onClick={() => setIsEditing(true)}>Edit</button>
						<button
							disabled={loading}
							onClick={(e) => {
								setIsDeleting(true);
								window.confirm(
									"Are you sure you want to delete this post?"
								)
									? handleDeletePost(e)
									: setIsDeleting(false);
							}}
						>
							Delete
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Post;
