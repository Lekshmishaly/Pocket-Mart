import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Slash } from "lucide-react";
import SizeGuideModal from "./SizeGuideModal";
import axiosInstance from "@/Utils/AxiosConfig";
import { useNavigate } from "react-router-dom";

export default function SizeSelector({
  selectedSize,
  setSelectedSize,
  productId,
  error,
  setError,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [sizes, setsizes] = useState([]);

  async function fetchSizes() {
    try {
      const response = await axiosInstance.get(`/user/fetchSize/${productId}`);
      setsizes(response.data.sizeData);

      return;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (productId) {
      fetchSizes();
    }
  }, [productId]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full bg-[#e5ddd0]  rounded px-8 py-3 flex items-center justify-between">
        <span className="text-[#312f2d] text-xs   leading-relaxed font-Futura-Light, sans-serif">
          Choose size
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-[#e5ddd0] px-6 pb-6">
        <div className="w-full flex justify-center">
          <div className="flex justify-evenly mb-6 w-full">
            {Array.isArray(sizes) &&
              sizes.map((s) =>
                s.stock > 0 ? (
                  <button
                    onClick={() => {
                      setSelectedSize(s.size);
                      setError({});
                    }}
                    key={s.size}
                    className={`w-9 aspect-square rounded-full ${
                      selectedSize === s.size ? "bg-[#dfc5aa]" : "bg-white"
                    } hover:bg-[#dfc5aa] flex items-center justify-center text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light, sans-serif`}>
                    {s.size}
                  </button>
                ) : (
                  <div key={s.size} className="relative">
                    <button
                      disabled
                      className="w-9 aspect-square rounded-full bg-white flex items-center justify-center text-sm text-[#312f2d] font-thin leading-relaxed font-Futura-Light, sans-serif opacity-50 cursor-not-allowed">
                      {s.size}
                    </button>
                    <Slash className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#733519]" />
                  </div>
                )
              )}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm ">
          <SizeGuideModal />

          <span
            onClick={() => navigate("https://wa.me/")}
            target="_blank"
            rel="noopener noreferrer"
            className=" text-[#8b5d4b] text-sm font-thin  leading-relaxed font-Futura-Light, sans-serif">
            Ask us on WhatsApp
          </span>
        </div>
      </CollapsibleContent>
      {error.size && (
        <span className=" text-[#5e2b13] text-sm font-thin mt-4 mx-1 leading-relaxed font-[Satisfy]">
          {error.size}
        </span>
      )}
    </Collapsible>
  );
}
