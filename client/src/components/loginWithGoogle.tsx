import { handleLoginWithGoogle } from "@/lib/utils";
import GoogleLogo from "../assets/google.svg";
import { Button } from "./ui/button";

const LoginWithGoogle = () => {
  return (
    <Button
      type="button"
      onClick={() => handleLoginWithGoogle()}
      className="w-full"
    >
      <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6 mr-2" />
      <span>Continue with Google</span>
    </Button>
  );
};

export default LoginWithGoogle;
