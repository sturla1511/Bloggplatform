import { CosmosClient } from '@azure/cosmos';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const client = new CosmosClient({
        endpoint: config.private.cosmosEndpoint,
        key: config.private.cosmosKey,
    });
    
    const userId = event.context.params.id;
    
    const database = client.database(config.private.cosmosDatabaseId);
    const container = database.container('Users');
    
    try {
        const { resource: user } = await container.item(userId).read();

        if (user) {
            return user;
        } else {
            event.res.statusCode = 404;
            return { error: "User not found" };
        }
    } catch (error) {
        console.error('Error fetching User from Cosmos DB:', error);
        event.res.statusCode = 500;
        return { error: "Failed to fetch User from Cosmos DB." };
    }
});