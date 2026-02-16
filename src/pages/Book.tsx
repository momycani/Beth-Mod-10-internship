import { useParams } from "react-router-dom";

export default function Book() {
  const { id } = useParams();
  return <div>Book page: {id}</div>;
}
