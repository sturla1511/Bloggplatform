import { CosmosClient } from '@azure/cosmos';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const client = new CosmosClient({
        endpoint: config.private.cosmosEndpoint,
        key: config.private.cosmosKey,
    });

    const database = client.database(config.private.cosmosDatabaseId);
    const container = database.container(config.private.cosmosContainerId);

    const rawSearchTerm = decodeURIComponent(event.context.params.search || '');
    const searchTerms = rawSearchTerm.split(' ').filter(term => term.trim().length > 0);

    console.log(`Searching for terms: ${searchTerms.join(', ')}`);

    if (searchTerms.length === 0) {
        console.log('No valid search terms provided.');
        event.res.statusCode = 400;
        return { error: "No valid search terms provided." };
    }

    try {
        const querySpec = {
            query: `SELECT * FROM c WHERE ${searchTerms.map((term, index) => `CONTAINS(c.heading, @searchTerm${index}) OR CONTAINS(c.text, @searchTerm${index})`).join(' OR ')}`,
            parameters: searchTerms.map((term, index) => ({ name: `@searchTerm${index}`, value: term.trim() }))
        };

        const { resources: blogs } = await container.items.query(querySpec).fetchAll();

        const scoredBlogs = blogs.map(blog => {
            const score = searchTerms.reduce((acc, term) => {
                const countInHeading = (blog.heading.match(new RegExp(term, 'gi')) || []).length;
                const countInText = (blog.text.match(new RegExp(term, 'gi')) || []).length;
                return acc + countInHeading + countInText;
            }, 0);
            return { ...blog, score };
        });
        
        scoredBlogs.sort((a, b) => b.score - a.score);

        return scoredBlogs;
    } catch (error) {
        console.error('Error querying Cosmos DB:', error);
        event.res.statusCode = 500;
        return { error: "Failed to fetch data from Cosmos DB." };
    }
});