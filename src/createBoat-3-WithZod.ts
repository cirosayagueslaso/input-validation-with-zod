import { readFileSync } from "fs";
import { ZodError, z } from "zod";

const RoomSchema = z.object({
  number: z.number(),
  area: z.number(),
  capacity: z.number(),
});

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

type Boat = z.infer<typeof BoatSchema>;

console.log("[Running with zod]");
const requestBody = JSON.parse(readFileSync(process.argv[2], "utf-8"));
console.log("[requestBody]", requestBody);

try {
  const boat: Boat = BoatSchema.parse(requestBody);
  console.log("[boat]", boat);
} catch (error) {
  (error as ZodError).errors.forEach((error) =>
    console.error(`Error found: "${error.message}". Code "${error.code}"`)
  );
}
