import React, { useState } from "react";
import { PostType } from "../types";
import msnIcon from "../styles/images/msn-icon.png";

const Post = ({
	post,
	setSelectedPost,
	deletedPost,
}: {
	post: PostType;
	setSelectedPost: (post: PostType | null) => void;
	deletedPost: (post: PostType | null) => void;
}) => {
	const [loading, setLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showTimestamp, setShowTimestamp] = useState(false);

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
	console.log(showTimestamp);
	return (
		<div
			className='post__container p-1 d-flex justify-content-between align-content-center'
			title={`View ${post.title}`}
			onClick={() => setSelectedPost(post)}
		>
			<div className='flex-grow-1'>
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
								{new Date(post.createdAt).toLocaleString()}
							</span>
						)}
					</p>
				</div>
				<p className='post__information mb-0'>{post.title}</p>
				<p className='mb-0'>{post.content}</p>
			</div>
			<div>
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
	);
};

export default Post;
