import "./pageStyles/grid.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import LoginWithGoogle from "@/components/loginWithGoogle";
import axios from "axios";
import { toast } from "sonner";
import { apiUrlDB } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().refine(
    (username) => {
      const regex = /^[a-zA-Z0-9_]+$/;
      return regex.test(username);
    },
    {
      message: "Username must not contain special characters",
    }
  ),
  password: z.custom((val) => {
    return typeof val === "string"
      ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(val)
      : false;
  }, "Use 8 or more characters with a mix of letters, numbers & symbols"),
  email: z.string().email("Please enter a valid email"),
});
const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  const navigate = useNavigate();

  const handleSignup = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    await axios
      .post(`${apiUrlDB}/api/auth/signup`, {
        username: values.username,
        email: values.email,
        password: values.password,
      })
      .then((res: any) => {
        setIsLoading(false);
        if (res?.data?.status) {
          toast(res?.data?.message);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        toast(err?.response?.data?.message);
      });
  };
  return (
    <div className="__login grid-bg w-full h-[100vh] flex justify-center items-center flex-col gap-2">
      <div className="__form_container bg-black border-[1px] py-8 px-4 flex flex-col gap-5 w-[300px]">
        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-4xl font-bold text-center">Signup</h1>
          <p className="font-mono text-xs text-center">
            Join the community of expert frontend developers🧑‍💻.
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" font-mono text-[rgba(255, 255, 255, 0.2)] text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" font-mono text-[rgba(255, 255, 255, 0.2)] text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className=" font-mono text-[rgba(255, 255, 255, 0.2)] text-xs" />
                </FormItem>
              )}
            />
            <LoginWithGoogle />{" "}
            <Button loading={isLoading} className="w-full" type="submit">
              Signup
            </Button>
          </form>
        </Form>
        <small className=" text-xs font-mono text-center">
          Already have an account?{" "}
          <Link className=" text-blue-400" to={"/login"}>
            Login
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Signup;
