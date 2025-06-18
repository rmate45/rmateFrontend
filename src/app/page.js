import { ROUTES } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function Home() {

  
  redirect(ROUTES.AUTH.LOGIN);

  return (
    <div className="items-center justify-items-center min-h-screen"></div>
  );
}
