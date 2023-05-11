import { readFileSync } from "fs";
import { ZodError, z } from "zod";

const RoomSchema = z.object({
  number: z.number(),
  area: z.number(),
  capacity: z.number(),
});

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

type Hotel = z.infer<typeof HotelSchema>;

console.log("[Running with zod]");
const requestBody = JSON.parse(readFileSync(process.argv[2], "utf-8"));
console.log("[requestBody]", requestBody);

try {
  const hotel: Hotel = HotelSchema.parse(requestBody);
  console.log("[hotel]", hotel);
} catch (error) {
  (error as ZodError).errors.forEach((error) =>
    console.error(`Error found: "${error.message}". Code "${error.code}"`)
  );
}
