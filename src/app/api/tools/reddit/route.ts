import { NextResponse } from 'next/server';
import axios from 'axios';

interface RedditPost {
	title: string;
	url: string;
	subreddit: string;
	score: number;
	author: string;
	num_comments: number;
}

interface RedditChild {
	data: {
		title: string;
		url: string;
		subreddit: string;
		score: number;
		author: string;
		num_comments: number;
	};
}

interface RedditResponse {
	data: {
		children: RedditChild[];
	};
}

export async function GET() {
	try {
		const response = await axios.get('https://oauth.reddit.com/hot', {
			headers: {
				'Authorization': `Bearer ${process.env.REDDIT_ACCESS_TOKEN}`,
				'User-Agent': 'MyApp/1.0.0'
			}
		});
		const data: RedditResponse = response.data;
		
		// Extract relevant information from the Reddit response
		const posts: RedditPost[] = data.data.children.map((child: RedditChild) => ({
			title: child.data.title,
			url: child.data.url,
			subreddit: child.data.subreddit,
			score: child.data.score,
			author: child.data.author,
			num_comments: child.data.num_comments
		}));

		return NextResponse.json({ posts });
	} catch (error) {
		console.error('Error fetching Reddit front page:', error);
		return NextResponse.json({ error: 'Failed to fetch Reddit frontpage' }, { status: 500 });
	}
}
