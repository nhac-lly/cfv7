import hau from "../assets/hau.png";
import type { Route } from "./+types/hau";

export function meta(_props: Route.MetaArgs) {
 return [
  { title: "New React Router App" },
  { name: "description", content: "Welcome to React Router!" },
 ];
}

export default function Hau() {
 return (
  <>
   <div className="h-screen w-screen flex items-center justify-center bg-conic/[in_oklch_longer_hue] from-[var(--color-max)] to-[var(--color-max)]">
    <img className="animate-wiggle" src={hau} alt="Hau" />
   </div>
  </>
 );
}
