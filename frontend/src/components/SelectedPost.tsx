import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { CommentType, PostType } from "../types";

const PAGE_SIZE = 2;

const fetchCommentsForPost = async (
	postId: number,
	pageNumber: number = 1
): Promise<CommentType[]> => {
	const params = new URLSearchParams({
		"per-page": PAGE_SIZE.toString(),
		page: pageNumber.toString(),
	});

	const response = await fetch(`/api/posts/${postId}/comments?${params}`);

	if (!response.ok) {
		throw new Error("Failed to fetch comments");
	}

	return response.json();
};

const SelectedPost = ({
	post,
	setSelectedPost,
}: {
	post: PostType;
	setSelectedPost: (post: PostType | null) => void;
}) => {
	const [comments, setComments] = useState<CommentType[]>([]);

	const hasNextPage =
		comments.length > 0 && comments.length < post.commentCount;

	const fetchMoreComments = () => {
		if (hasNextPage) {
			const pagesFetched = comments.length / PAGE_SIZE;
			const nextPage = pagesFetched + 1;
			fetchCommentsForPost(post.id, nextPage).then((comments) => {
				setComments((prevComments) => [...prevComments, ...comments]);
			});
		}
	};

	// Fetch the first page of comments on mount
	useEffect(() => {
		fetchCommentsForPost(post.id).then((comments) => {
			setComments(comments);
		});
	}, [post.id]);

	return (
		<div className='m-4'>
			<button onClick={() => setSelectedPost(null)}>Back</button>

			<div className='window mt-4'>
				<div className='title-bar'>
					<h2 className='title-bar-text'> {post.title}</h2>
					<div className='title-bar-controls'>
						<button aria-label='Minimize'></button>
						<button aria-label='Maximize' disabled></button>
						<button aria-label='Close'></button>
					</div>
				</div>

				<div className='d-flex flex-column bg-white'>
					<div className='d-flex mt-2'>
						<p className='selected-post__author'>{post.author}</p>
						<p className='text-secondary'>
							{new Date(post.createdAt).toLocaleDateString()}
						</p>
					</div>
					<p className='my-2'>{post.content}</p>

					<div className='d-flex flex-column mt-3'>
						{comments.map((comment, index) => (
							<Comment
								key={comment.id}
								comment={comment}
								firstComment={index === 0}
							/>
						))}
					</div>

					{hasNextPage && (
						<button onClick={fetchMoreComments}>
							Fetch more comments
						</button>
					)}
				</div>

				<div className='status-bar'>
					<p className='status-bar-field'>Press F1 for help</p>
					<p className='status-bar-field'>Slide 2</p>
					<p className='status-bar-field'>CPU Usage: 22%</p>
				</div>
			</div>
		</div>
	);
};

export default SelectedPost;
