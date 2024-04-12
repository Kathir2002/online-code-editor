import { Code, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { apiUrlDB } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const CodeItem = ({
  data,
  setIsDeleted,
  isDeleted,
  isDeleteBtnVisible,
}: any) => {
  const [isloading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteCode = async () => {
    setIsLoading(true);
    await axios
      .delete(`${apiUrlDB}/api/compiler/delete/${data._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res?.data?.status) {
          setIsDeleted(!isDeleted);
          setIsOpen(false);
          toast(res?.data?.message);
        }
      })
      .catch((err) => {
        toast(err?.response?.data?.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="p-3 rounded cursor-pointer bg-slate-900 flex justify-start items-center flex-col gap-3">
      <div className="__top flex justify-start items-start gap-3 w-full">
        <Code />
        <p className="font-mono font-bold text-lg">{data.title}</p>
      </div>
      <Separator />
      <div className="__btn_container flex gap-3">
        <Link target="_blank" to={`/compiler/${data._id}`}>
          <Button variant="secondary">Open Code</Button>
        </Link>
        {isDeleteBtnVisible && (
          <Dialog open={isOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsOpen(true)}
                variant="destructive"
                loading={false}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex gap-1 justify-center items-center">
                  <Trash2 />
                  Delete Code confirmation!
                </DialogTitle>
                <div className="__url flex justify-center items-center flex-col gap-1">
                  <p>
                    Are you sure, that you want to delete this code, this action
                    is not reversible.
                  </p>
                  <Button
                    variant="destructive"
                    className="h-full"
                    onClick={handleDeleteCode}
                    loading={isloading}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CodeItem;
