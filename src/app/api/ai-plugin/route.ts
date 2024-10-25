import { NextResponse } from "next/server";
import { DEPLOYMENT_URL } from "vercel-url";


const key = JSON.parse(process.env.BITTE_KEY || "{}");
const config = JSON.parse(process.env.BITTE_CONFIG || "{}");

if (!key?.accountId) {
    console.error("no account");
}

export async function GET() {
    const pluginData = {
        openapi: "3.0.0",
        info: {
            title: "Reddit",
            description: "API for the Reddit",
            version: "1.0.0",
        },
        servers: [
            {
                url: config.url || DEPLOYMENT_URL,
            },
        ],
        "x-mb": {
            "account-id": key.accountId,
            assistant: {
                name: "Reddit Information Assistant",
                description: "An AI assistant that provides information from Reddit, including posts, user profiles, and subreddit details.",
                instructions: "You are a helpful assistant that provides information from Reddit. Use the available tools to fetch Reddit posts, user profiles, and subreddit information. Always strive to give accurate and up-to-date information. If asked about a specific subreddit or user, use the appropriate tool to fetch that information. For general queries, use the get-reddit-posts tool to provide relevant content from the frontpage.",
            },
        },
        paths: {
            "/api/tools/reddit": {
                get: {
                    summary: "get Reddit frontpage posts",
                    description: "Fetch and return a list of posts from the Reddit frontpage",
                    operationId: "get-reddit-posts",
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/reddit-user": {
                get: {
                    summary: "Get Reddit user profile",
                    description: "Fetch and return a Reddit user profile",
                    operationId: "get-reddit-user",
                    parameters: [
                        {
                            name: "username",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The Reddit username to fetch the profile for"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/api/tools/subreddit": {
                get: {
                    summary: "Get Reddit subreddit posts",
                    description: "Fetches the latest posts from a specified subreddit",
                    operationId: "get-subreddit-posts",
                    parameters: [
                        {
                            name: "subreddit",
                            in: "query",
                            required: true,
                            schema: {
                                type: "string"
                            },
                            description: "The name of the subreddit to fetch posts from"
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful response",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
    };

    return NextResponse.json(pluginData);
}