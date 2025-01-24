import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export function OTPVerification({
  isOpen,
  onClose,
  onVerify,
  email,
  handleSignUp,
}) {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (isOpen) {
      setTimer(60); // Reset timer to 120 seconds when dialog opens
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input
      if (value !== "" && index < 4) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      // Move focus to the previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    onVerify(otp.join(""));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Verify OTP</DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="text-center mb-4">
          We've sent an email with an activation code to your email {email}
        </div>
        <div className="flex justify-center space-x-2 mb-4">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg"
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
        </div>
        <div className="text-center mb-4">
          {timer > 0 ? (
            <p>
              {" "}
              {Math.floor(timer / 60)
                .toString()
                .padStart(2, "0")}
              :{(timer % 60).toString().padStart(2, "0")}
            </p>
          ) : (
            <Button
              onClick={() => {
                handleSignUp();
                setTimer(60); // Reset timer to 120 seconds when Resend is clicked
              }}
              variant="link">
              Resend
            </Button>
          )}
        </div>
        <Button onClick={handleVerify} className="w-full">
          Verify
        </Button>
      </DialogContent>
    </Dialog>
  );
}
