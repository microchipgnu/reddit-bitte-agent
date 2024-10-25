import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const response = await axios.get(`https://api.reddit.com/user/${username}/about.json`);
        const userData = response.data.data;

        const userProfile = {
            username: userData.name,
            totalKarma: userData.total_karma,
            linkKarma: userData.link_karma,
            commentKarma: userData.comment_karma,
            createdAt: new Date(userData.created_utc * 1000).toISOString(),
            isGold: userData.is_gold,
            isModerator: userData.is_mod,
            verified: userData.verified,
        };

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error('Error fetching Reddit user profile:', error);
        return NextResponse.json({ error: 'Failed to fetch Reddit user profile' }, { status: 500 });
    }
}
