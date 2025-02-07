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
  <div>
   <img src={hau} alt="Hau" />
  </div>
 );
}
