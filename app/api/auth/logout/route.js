import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Uspesno se odjavivte" }, { status: 200 });

  response.cookies.delete("jwt");

  return response;
}