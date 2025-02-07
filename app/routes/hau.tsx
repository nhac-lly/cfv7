import type { Route } from "./+types/home";
import hau from "../assets/hau.png";

export function meta({}: Route.MetaArgs) {
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
    )
}