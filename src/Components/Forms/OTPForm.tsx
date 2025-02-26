/* eslint-disable @typescript-eslint/no-explicit-any */
import OTPInput, { ResendOTP } from "otp-input-react";
import otp_clipArt from "../../assets/Images/OTP_clipArt.png";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../contexts/UserContext";
import axios from "axios";
import { baseURL } from "../../const/const";
import { useNavigate } from "react-router";
const OTPForm = () => {
  axios.defaults.withCredentials = true;
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const phone = user.phone;
  useEffect(() => {
    axios.post(baseURL + "/user/sendOTP", { phone_number: phone });
  }, []);
  const fsubmit = async () => {
    try {
      const result = await axios.post(baseURL + "/user/verifyOTP", {
        phone_number: phone,
        otp: OTP,
      });
      if (result.status === 200) {
        setError("");
        if (user.type === "admin") {
          navigate("/admin");
        } else if (user.type === "student") {
          navigate("/student");
        } else if (user.type === "teacher") {
          navigate("/teacher");
        }
      } else {
        setError(result.data.message);
      }
    } catch (err: any) {
      setError(err.response.data);
    }
  };
  return (
    <form
      action=""
      className=" max-w-[80%] p-6 min-w-[340px] w-[486px] min-h-[576px] bg-second-alt rounded-[10px] flex flex-col justify-start pt-12 items-center gap-y-4"
    >
      <img src={otp_clipArt} alt="" />
      <h1 className=" font-[700] font-montserrat text-[30px] text-prime text-center">
        OTP Verification
      </h1>
      <p className="font-[500] font-montserrat text-[15px] text-prime-alt max-w-[100%] w-[330px] text-center">
        Enter the OTP sent to <span className="font-[700]">{phone}</span>
      </p>
      <p className="font-[500] font-montserrat text-[12px] text-tertiary-alt text-center">
        {error}
      </p>
      <OTPInput
        value={OTP}
        onChange={setOTP}
        autoFocus
        OTPLength={6}
        otpType="number"
        disabled={false}
        inputClassName="text-[32px]  min-w-[65px] min-h-[65px]  bg-[#f2f6ff] rounded-[5px] border-[1px] border-[#DCE3F0] focus:border-[#a7a7a7] focus:outline-none "
        secure
      />
      <p className="font-[500] font-montserrat text-[15px] text-prime-alt max-w-[100%] w-[330px] text-center">
        Didn't Recieve OTP ?
        <ResendOTP
          className="font-[700] font-montserrat text-[13px] text-tertiary-alt"
          onResendClick={() => console.log("Resend clicked")}
        />
      </p>

      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          if (OTP.length == 6) {
            fsubmit();
          } else {
            setError("Please Enter Correct OTP");
          }
        }}
        className=" mt-4 rounded-[5px] bg-tertiary-alt text-second-alt font-montserrat text-[12px] max-w-[100%] font-[700] w-[396px] h-[50px]"
      >
        VERIFY & PROCEED
      </button>
    </form>
  );
};
export default OTPForm;
