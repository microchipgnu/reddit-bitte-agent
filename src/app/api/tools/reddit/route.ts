import { NextResponse } from 'next/server';
import axios from 'axios';

interface RedditPost {
	title: string;
	author: string;
	subreddit: string;
	score: number;
	num_comments: number;
	url: string;
}

interface RedditChild {
	data: {
		title: string;
		author: string;
		subreddit: string;
		score: number;
		num_comments: number;
		permalink: string;
	};
}

interface RedditResponse {
	data: {
		children: RedditChild[];
	};
}

export async function GET() {
	try {
		const response = await axios.get('https://www.reddit.com/.json', {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				'Accept': 'application/json',
				'Accept-Language': 'en-US,en;q=0.5',
				'Cache-Control': 'max-age=0'
			}
		});
		const data: RedditResponse = response.data;
		
		// Extract relevant information from the Reddit response
		const posts: RedditPost[] = data.data.children.map((child: RedditChild) => ({
			title: child.data.title,
			author: child.data.author,
			subreddit: child.data.subreddit,
			score: child.data.score,
			num_comments: child.data.num_comments,
			url: `https://www.reddit.com${child.data.permalink}`,
		}));

		return NextResponse.json({ posts });
	} catch (error) {
		console.error('Error fetching Reddit frontpage:', error);
		if (axios.isAxiosError(error) && error.response?.status === 403) {
			return NextResponse.json({ error: 'Access to Reddit API is blocked. Please try again later.' }, { status: 403 });
		}
		return NextResponse.json({ error: 'Failed to fetch Reddit frontpage' }, { status: 500 });
	}
}
