import { CosmosClient } from '@azure/cosmos';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const client = new CosmosClient({
        endpoint: config.private.cosmosEndpoint,
        key: config.private.cosmosKey,
    });
    
    const blogId = event.context.params.id;
    
    const database = client.database(config.private.cosmosDatabaseId);
    const container = database.container(config.private.cosmosContainerId);
    
    try {
        const { resource: blog } = await container.item(blogId).read();

        if (blog) {
            return blog;
        } else {
            event.res.statusCode = 404;
            return { error: "Item not found" };
        }
    } catch (error) {
        console.error('Error fetching item from Cosmos DB:', error);
        event.res.statusCode = 500;
        return { error: "Failed to fetch item from Cosmos DB." };
    }
});