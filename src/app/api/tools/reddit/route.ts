import { NextResponse } from 'next/server';
import axios from 'axios';

interface RedditPost {
	title: string;
	url: string;
	subreddit: string;
	score: number;
}

interface RedditChild {
	data: {
		title: string;
		url: string;
		subreddit: string;
		score: number;
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
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.9',
				'Accept-Encoding': 'gzip, deflate, br',
				'Connection': 'keep-alive',
				'Upgrade-Insecure-Requests': '1',
				'DNT': '1',
				'Cache-Control': 'no-cache',
				'Pragma': 'no-cache',
			}
		});
		const data: RedditResponse = response.data;
		
		// Extract relevant information from the Reddit response
		const posts: RedditPost[] = data.data.children.map((child: RedditChild) => ({
			title: child.data.title,
			url: child.data.url,
			subreddit: child.data.subreddit,
			score: child.data.score,
		}));

		return NextResponse.json({ posts });
	} catch (error) {
		console.error('Error fetching Reddit front page JSON:', error);
		return NextResponse.json({ error: 'Failed to fetch Reddit frontpage' }, { status: 500 });
	}
}
