import React, { useEffect, useState } from "react";
import {
  Tag,
  IndianRupee,
  Calendar,
  Users,
  MoveDown,
  Copy,
  PackageX,
} from "lucide-react";
import { FetchCouponsApi } from "@/APIs/Shopping/Coupon";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function UserCouponDisplay() {
  const userData = useSelector((store) => store.user.userDetails);
  const [coupons, setCoupons] = useState([]);

  /////////////////////////////////////// fetch All Coupons ////////////////////////////////////

  async function fetchAllCoupons() {
    try {
      const response = await FetchCouponsApi();
      const coupons = response.data.Coupons;

      coupons.forEach((coupon) => {
        if (Array.isArray(coupon.users_applied)) {
          const userApplied = coupon.users_applied.find(
            (user_applied) => user_applied.user == userData._id
          );

          if (userApplied) {
            coupon.used = userApplied.used_count;
          }
        }
      });

      setCoupons(coupons);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch coupons");
    }
  }

  ////////////////////////////////////////////// Text copy ////////////////////////////////////////

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Coupon code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy coupon code");
      });
  };

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f4ede3] min-h-screen">
      {coupons.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center text-[#8b5d4b] font-Futura-Light text-lg">
          <PackageX
            className="w-12 h-12 mb-4 text-muted-foreground"
            aria-hidden="true"
          />
          Currently Coupon Not Available
        </div>
      )}
      <div className="max-w-3xl mx-auto lg:max-w-5xl xl:max-w-6xl">
        <h1 className="text-xl mb-8 font-light text-[#8b5d4b]  text-center">
          Available Coupons
        </h1>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-[#eae0d3] ${
                coupon.usage_limit == coupon.used ? "opacity-40" : ""
              } rounded-lg shadow-md p-6 relative hover:shadow-lg transition duration-300 border border-[#d4c9bc]`}>
              <div className="flex flex-col h-full">
                {coupon.used == coupon.usage_limit && (
                  <h1 className="text-red-700 font-bold  lg:text-5xl self-center absolute top-1/2">
                    USAGE LIMIT EXCEEDED
                  </h1>
                )}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#bb5932] underline underline-offset-4">
                      Coupon code: {coupon.code}
                    </h2>
                    {coupon.used != coupon.usage_limit && (
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-[#8b5d4b] hover:text-[#8b5d4b] transition duration-300"
                        aria-label="Copy coupon code">
                        <Copy size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-[#8b5d4b] mt-1">
                    Description: {coupon.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm flex-grow">
                  <div className="flex items-center">
                    <Tag className="mr-2 text-[#bb5932]" size={20} />
                    <span className="font-medium text-[#8b5d4b]">
                      Discount:
                    </span>
                    <span className="ml-1 text-[#744836]">
                      {coupon.discountValue}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-green-600" size={20} />
                    <span className="font-medium text-[#8b5d4b]">
                      Min Purchase:
                    </span>
                    <span className="ml-1 text-[#744836]">
                      ₹{coupon.min_purchase_amount}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-yellow-500" size={20} />
                    <span className="font-medium text-[#8b5d4b]">
                      Max Discount:
                    </span>
                    <span className="ml-1 text-[#744836]">
                      ₹{coupon.max_discount_amount || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-red-500" size={20} />
                    <span className="font-medium text-[#8b5d4b]">Expires:</span>
                    <span className="ml-1 text-[#744836]">
                      {new Date(coupon.expiration_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MoveDown className="mr-2 text-blue-500" size={20} />
                    <span className="font-medium text-[#8b5d4b]">
                      Coupon Used:
                    </span>
                    <span className="ml-1 text-[#744836]">
                      {coupon.used || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 text-gray-500" size={20} />
                    <span className="font-medium text-[#8b5d4b]">
                      Usage Limit:
                    </span>
                    <span className="ml-1 text-[#744836]">
                      {coupon.usage_limit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
