import { useParams } from "react-router-dom";

export default function Player() {
  const { id } = useParams();
  return <div>Player page: {id}</div>;
}