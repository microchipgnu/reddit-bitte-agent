import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const subreddit = searchParams.get('subreddit');

    if (!subreddit) {
        return NextResponse.json({ error: 'Subreddit is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/new.json?limit=25`);
        if (!response.ok) {
            throw new Error(`Failed to fetch posts from r/${subreddit}`);
        }
        const data: RedditResponse = await response.json();
        
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
        console.error(`Error fetching posts from r/${subreddit}:`, error);
        return NextResponse.json({ error: `Failed to fetch posts from r/${subreddit}` }, { status: 500 });
    }
}

