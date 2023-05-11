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

type Hotel = {
  name: string;
  address?: string;
  rooms: Room[];
  country: string | null;
};

const HotelSchema = z.object({
  name: z.string({
    required_error: "The name is mandatory",
    invalid_type_error: "The name must be a string",
  }),
  address: z
    .string({
      invalid_type_error: "The address must be a string",
    })
    .optional(),
  rooms: z.array(RoomSchema),
  country: z.string().nullable(),
});
z.util.assertEqual<Hotel, z.infer<typeof HotelSchema>>(true);

console.log("[Running adding zod]");
const requestBody = JSON.parse(readFileSync(process.argv[2], "utf-8"));
console.log("[requestBody]", requestBody);

/**
 * Input validation: Hotel and Room.
 */
// if (!requestBody.name) throw new Error("The name is mandatory");
// if (typeof requestBody.name !== "string")
//   throw new Error("The name must be a string");
// if (typeof requestBody.address !== "number")
//   throw new Error("The address must be a number");
// if (requestBody.country === undefined)
//   throw new Error(
//     "The country must be defined, please use null if the hotel has no country"
//   );

// requestBody.rooms?.forEach((room) => {
//   if (!room.number) throw new Error("The number is mandatory in the rooms");
//   if (!room.area) throw new Error("The area is mandatory in the rooms");
//   if (!room.capacity) throw new Error("The capacity is mandatory in the rooms");
// });

// const hotel: Hotel = requestBody;

try {
  const hotel: Hotel = HotelSchema.parse(requestBody);
  console.log("[hotel]", hotel);
} catch (error) {
  (error as ZodError).errors.forEach((error) =>
    console.error(`Error found: "${error.message}". Code "${error.code}"`)
  );
}
