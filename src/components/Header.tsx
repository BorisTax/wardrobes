import User from "./User"
import { Link } from "react-router-dom"
export default function Header() {
  return <div className="header">
      <Link to="">Главная</Link>
    <User />
  </div>
}