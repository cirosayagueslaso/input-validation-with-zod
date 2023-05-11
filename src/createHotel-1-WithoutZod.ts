import { readFileSync } from "fs";

/**
 * Type definition.
 */
type Room = {
  number: number;
  area: number;
  capacity: number;
};

type Hotel = {
  name: string;
  address?: string;
  rooms: Room[];
  country: string | null;
};

console.log("[Running without zod]");
const requestBody = JSON.parse(readFileSync(process.argv[2], "utf-8"));
console.log("[requestBody]", requestBody);

try {
  /**
   * Input validation: Hotel.
   */
  if (!requestBody.name) throw new Error("The name is mandatory");
  if (typeof requestBody.name !== "string")
    throw new Error("The name must be a string");
  if (typeof requestBody.address !== "string")
    throw new Error("The address must be a string");
  if (requestBody.country === undefined)
    throw new Error(
      "The country must be defined, please use null if the hotel has no country"
    );

  /**
   * Input validation: Room.
   */
  requestBody.rooms?.forEach((room: Record<string, unknown>) => {
    if (!room.number) throw new Error("The number is mandatory in the rooms");
    if (!room.area) throw new Error("The area is mandatory in the rooms");
    if (!room.capacity)
      throw new Error("The capacity is mandatory in the rooms");
  });

  const hotel: Hotel = requestBody;

  console.log("[hotel]", hotel);
} catch (error) {
  console.error("Error found:", (error as Error).message);
}
