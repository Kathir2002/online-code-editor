import { handleLoginWithGithub } from "@/lib/utils";
// import GoogleLogo from "../assets/google.svg";
import GithubLogo from "../assets/github.svg";
import { Button } from "./ui/button";

const LoginWithGoogle = () => {
  return (
    <Button
      type="button"
      onClick={() => handleLoginWithGithub()}
      className="w-full"
    >
      <img src={GithubLogo} alt="Google Logo" className="w-6 h-6 mr-2" />
      <span>Continue with Github</span>
    </Button>
  );
};

export default LoginWithGoogle;
