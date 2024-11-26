import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <div>Not Found.</div>
      <Link to="/">Back Home</Link>
    </div>
  );
}
