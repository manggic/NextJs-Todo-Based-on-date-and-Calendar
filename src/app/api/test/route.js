import { connect } from "@/db/config";
import User from "@/models/UserModel";

export async function GET() {
  console.log("calling API >>>");

  await connect()

  const res = await User.findOne({ email: "manishmahto198@gmail.com" });
  return Response.json({ msg: "testing", data: res });
}
