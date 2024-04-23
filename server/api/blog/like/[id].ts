import { defineEventHandler } from 'h3';
import { CosmosClient } from '@azure/cosmos';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const client = new CosmosClient({
        endpoint: config.private.cosmosEndpoint,
        key: config.private.cosmosKey,
    });

    const blogId = event.context.params.id;
    const body = await readBody(event);

    const database = client.database(config.private.cosmosDatabaseId);
    const container = database.container(config.private.cosmosContainerId);
    
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const itemResponse = await container.item(blogId).read();
            const item = itemResponse.resource;

            if (!item) {
                event.res.statusCode = 404;
                return {error: "Item not found"};
            }
            
            if (body.action === 'increment') {
                item.likes += 1;
            } else if (body.action === 'decrement') {
                item.likes = Math.max(0, item.likes - 1);
            }
            
            const {resource: updatedItem} = await container.item(blogId).replace(item, {
                accessCondition: {
                    type: "IfMatch",
                    condition: item._etag
                }
            });

            return updatedItem;
        } catch (error) {
            if (error.code === 412 && attempt < maxRetries) {
                console.log(`Attempt ${attempt} failed due to concurrent modification. Retrying...`);
                continue;
            } else {
                console.error('Error updating likes:', error);
                event.res.statusCode = error.code || 500;
                return { error: "Failed to update likes", statusCode: error.code || 500 };
            }
        }
    }
    return { error: "Failed to update after several attempts due to high contention", statusCode: 500 };
});