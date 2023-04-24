import { readFileSync } from "fs";
import { ZodError, z } from "zod";

/**
 * Type definition.
 */
type Room = {
  number: number;
  area: number;
  capacity: number;
};

const RoomSchema = z.object({
  number: z.number(),
  area: z.number(),
  capacity: z.number(),
});
z.util.assertEqual<Room, z.infer<typeof RoomSchema>>(true);

type Boat = {
  name: string;
  length?: number;
  width?: number;
  rooms: Room[];
  country: string | null;
};

const BoatSchema = z.object({
  name: z.string({
    required_error: "The name is mandatory",
    invalid_type_error: "The name must be a string",
  }),
  length: z
    .number({
      invalid_type_error: "The length must be a number",
    })
    .optional(),
  width: z.number().optional(),
  rooms: z.array(RoomSchema),
  country: z.string().nullable(),
});
z.util.assertEqual<Boat, z.infer<typeof BoatSchema>>(true);

console.log("[Running adding zod]");
const requestBody = JSON.parse(readFileSync(process.argv[2], "utf-8"));
console.log("[requestBody]", requestBody);

/**
 * Input validation: Boat and Room.
 */
// if (!requestBody.name) throw new Error("The name is mandatory");
// if (typeof requestBody.name !== "string")
//   throw new Error("The name must be a string");
// if (typeof requestBody.length !== "number")
//   throw new Error("The length must be a number");
// if (typeof requestBody.width !== "number")
//   throw new Error("The width must be a number");
// if (requestBody.country === undefined)
//   throw new Error(
//     "The country must be defined, please use null if the boat has no country"
//   );

// requestBody.rooms?.forEach((room) => {
//   if (!room.number) throw new Error("The number is mandatory in the rooms");
//   if (!room.area) throw new Error("The area is mandatory in the rooms");
//   if (!room.capacity) throw new Error("The capacity is mandatory in the rooms");
// });

// const boat: Boat = requestBody;

try {
  const boat: Boat = BoatSchema.parse(requestBody);
  console.log("[boat]", boat);
} catch (error) {
  (error as ZodError).errors.forEach((error) =>
    console.error(`Error found: "${error.message}". Code "${error.code}"`)
  );
}
