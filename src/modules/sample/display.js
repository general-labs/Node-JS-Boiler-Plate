
/**
 * Example of In - Memory cache for super fast response.
 * An alternative solution of REDIS.
 */
import storage from "node-persist";

export default async (req, res) => {
  let sampleData = await storage.getItem('didarul');
  console.log("Requested Data", JSON.stringify(sampleData));
  res.json(sampleData);
}