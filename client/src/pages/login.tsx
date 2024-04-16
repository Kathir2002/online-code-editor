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
import { useDispatch } from "react-redux";
import { updateCurrentUser, updateIsLoggedin } from "@/redux/slices/appSlice";
import { useState } from "react";

const formSchema = z.object({
  userId: z.string(),
  password: z.string(),
});
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    await axios
      .post(
        `${apiUrlDB}/api/auth/login`,
        {
          userId: values.userId,
          password: values.password,
        },
        { withCredentials: true }
      )
      .then((res: any) => {
        setLoading(false);
        if (res?.data?.status) {
          dispatch(updateCurrentUser(res?.data?.user));
          dispatch(updateIsLoggedin(true));
          navigate("/");
        }
      })
      .catch((err) => {
        setLoading(false);
        toast(err?.response?.data?.message);
      });
  };
  return (
    <div className="__login grid-bg w-full h-[calc(100dvh-60px)] flex justify-center items-center flex-col gap-2">
      <div className="__form_container bg-black border-[1px] py-8 px-4 flex flex-col gap-5 w-[300px]">
        <div className="flex flex-col gap-2">
          <h1 className="font-mono text-4xl font-bold text-center">Login</h1>
          <p className="font-mono text-xs text-center">
            Welcome back fellow coder 😁!
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      required
                      disabled={loading}
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                      required
                      disabled={loading}
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoginWithGoogle />
            <Button loading={loading} className="w-full" type="submit">
              Login
            </Button>
          </form>
        </Form>
        <small className=" text-xs font-mono text-center">
          Don't have an account?{" "}
          <Link className=" text-blue-400" to={"/signup"}>
            Signup
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Login;
