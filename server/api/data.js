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

    const querySpec = {
        query: "SELECT * FROM c"
    };

    try {
        const { resources: items } = await container.items.query("SELECT * FROM c").fetchAll();
        console.log(items)
        return items;
    } catch (error) {
        console.error('Error querying Cosmos DB:', error);
        event.res.statusCode = 500;
        return { error: "Failed to fetch data from Cosmos DB." };
    }
});