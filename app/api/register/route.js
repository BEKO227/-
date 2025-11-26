import { NextResponse } from "next/server";
import { addUser, findDuplicate } from "@/data/users";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(7), // basic phone validation
  age: z.number().int().min(1).max(120),
  gender: z.enum(["male", "female"]),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone, age, gender } = parsed.data;

    if (findDuplicate({ name, email, phone })) {
      return NextResponse.json(
        { error: "An account with the same username, email, or phone already exists" },
        { status: 400 }
      );
    }

    addUser({ name, email, password, phone, age, gender });

    return NextResponse.json({ message: "Account created" });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
