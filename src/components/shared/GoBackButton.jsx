import { CircleArrowLeft } from "lucide-react";
import { handleBack } from "@/lib/utils.js";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function GoBackButton({ url }) {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => handleBack(navigate, url)}
      width="fit"
      variant="ghost"
      color={"gray"}
    >
      <CircleArrowLeft className="size-7 m-1" color="gray" />
    </Button>
  );
}
