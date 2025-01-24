import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SizeGuideModal() {
  const sizeData = [
    {
      size: "XS",
      us: "00",
      uk: "0-2",
      bust: "32-33",
      waist: "25-26",
      hip: "34-35",
    },
    {
      size: "S",
      us: "0-2",
      uk: "4-6",
      bust: "34-35",
      waist: "27-28",
      hip: "36-37",
    },
    {
      size: "M",
      us: "4-6",
      uk: "8-10",
      bust: "36-37",
      waist: "29-30",
      hip: "38-39",
    },
    {
      size: "L",
      us: "8-10",
      uk: "12-14",
      bust: "38-39",
      waist: "31-32",
      hip: "40-41",
    },
    {
      size: "XL",
      us: "12-14",
      uk: "16-18",
      bust: "40-41",
      waist: "33-34",
      hip: "42-43",
    },
    {
      size: "XXL",
      us: "16-18",
      uk: "20-22",
      bust: "42-43",
      waist: "35-36",
      hip: "44-45",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger className="text-[#8b5d4b] text-sm font-thin  leading-relaxed font-Futura-Light, sans-serif">
        Size guide
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-[#f4ede3]">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-[#8b5d4b]">
            Size guide
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="tops" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent gap-4">
            {["Tops", "Bottom"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:underline decoration-1 underline-offset-8">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-8">
            <div className="flex gap-4 mb-2">
              <button className="text-sm font-normal text-[#8b5d4b]">
                Inches
              </button>
              <button className="text-sm font-normal text-[#8b5d4b]">
                Cms
              </button>
            </div>
            <p className="text-sm  mb-6 text-[#8b5d4b]">
              These are body measurements.
            </p>

            <div className="w-full">
              <div className="grid grid-cols-6 bg-[#e5ddd0] py-4 px-6 text-[#8b5d4b]">
                <div>Size</div>
                <div>US</div>
                <div>UK</div>
                <div>Bust</div>
                <div>Waist</div>
                <div>Hip</div>
              </div>
              <div className="divide-y divide-gray-200">
                {sizeData.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-6 py-4 px-6 text-[#8b5d4b]">
                    <div>{row.size}</div>
                    <div>{row.us}</div>
                    <div>{row.uk}</div>
                    <div>{row.bust}</div>
                    <div>{row.waist}</div>
                    <div>{row.hip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
