import { readFileSync } from "fs";

/**
 * Type definition.
 */
type Room = {
  number: number;
  area: number;
  capacity: number;
};

type Boat = {
  name: string;
  length?: number;
  width?: number;
  rooms: Room[];
  country: string | null;
};

console.log("[Running without zod]");
const requestBody = JSON.parse(readFileSync(process.argv[2], "utf-8"));
console.log("[requestBody]", requestBody);

try {
  /**
   * Input validation: Boat.
   */
  if (!requestBody.name) throw new Error("The name is mandatory");
  if (typeof requestBody.name !== "string")
    throw new Error("The name must be a string");
  if (typeof requestBody.length !== "number")
    throw new Error("The length must be a number");
  if (typeof requestBody.width !== "number")
    throw new Error("The width must be a number");
  if (requestBody.country === undefined)
    throw new Error(
      "The country must be defined, please use null if the boat has no country"
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

  const boat: Boat = requestBody;

  console.log("[boat]", boat);
} catch (error) {
  console.error("Error found:", (error as Error).message);
}
