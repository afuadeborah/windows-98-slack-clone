import * as React from 'react';

export interface PostType {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    commentCount: number;
}

export interface CommentType {
    id: number;
    content: string;
    author: string;
    createdAt: string;
    postId: number;
}
