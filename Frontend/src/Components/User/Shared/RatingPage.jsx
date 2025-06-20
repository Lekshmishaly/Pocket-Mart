import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/Utils/AxiosConfig";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

function RatingPage() {
  const userData = useSelector((store) => store.user.userDetails);
  const { id } = useParams();
  const productId = id;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reload, setReload] = useState(false);

  ///////////////////////////////////// handle Reviews ///////////////////////////////////

  async function handleReviews() {
    try {
      if (!rating && !review) {
        return toast.error(
          "Please provide a rating and a review before submitting!"
        );
      }
      if (!rating && review) {
        return toast.error("Please provide a rating before submitting!");
      }

      const response = await axiosInstance.post("/user/product/review", {
        userId: userData._id,
        productId: productId,
        rating,
        review: review,
      });
      setReload(true);
      //   toast.success(response.data);
      setShowThankYou(true);
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error checking for  adding Review:", error);
    }
  }

  ///////////////////////////////////// fetch Reviews ///////////////////////////////////

  async function fetchReviews() {
    try {
      const response = await axiosInstance.get(
        `/user/fetchreview/${productId}`
      );

      setReviews(response.data.reviewData);
    } catch (error) {
      console.error("Error checking for fetching Review:", error);
    }
  }

  useEffect(() => {
    fetchReviews();
    setReload(false);
  }, [reload]);
  return (
    <div className="mt-8 bg-[#f4ede3] px-4 py-6 sm:py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Reviews */}
        <div className="lg:w-[60%] w-full">
          <h3 className="text-2xl font-[Satisfy] text-[#8b5d4b] mb-4 sm:mb-6 text-center lg:text-left">
            Customer Reviews
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 sm:pr-4 scrollbar-hide">
            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#eae0d3] rounded-lg shadow-sm p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-light text-[#8d401d]">
                      {review.user
                        ? `${review.user.firstname} ${review.user.lastname}`
                        : "User"}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? "text-[#733519]"
                              : "text-[#ffffff]"
                          }`}
                          fill="currentColor"
                          stroke="#9e8277"
                          strokeWidth="0.5"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-Futura-Light text-[#8b5d4b]">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs font-light text-[#8d401d]">
                No reviews yet.
              </p>
            )}
          </div>
        </div>

        {/* Right side - Rating Form */}
        <div className="lg:w-[40%] w-full">
          <h3 className="text-2xl font-[Satisfy] text-[#8b5d4b] text-center mb-4 sm:mb-6">
            Rate Your Experience
          </h3>

          <div className="bg-[#eae0d3] rounded-lg border border-[#8b5d4b] shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-base sm:text-lg font-Futura-Light text-center text-[#8b5d4b] mb-4">
              How was your overall experience?
            </h2>

            <div className="flex justify-center mb-5 sm:mb-6">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <button
                    key={index}
                    className={`p-1 ${
                      ratingValue <= (hover || rating)
                        ? "text-[#733519]"
                        : "text-[#ffffff]"
                    } transition-colors duration-200`}
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`Rate ${ratingValue} stars`}>
                    <Star
                      className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10"
                      fill="currentColor"
                      stroke="#9e8277"
                      strokeWidth="0.7"
                    />
                  </button>
                );
              })}
            </div>

            <textarea
              className="w-full p-3 border border-[#d4c9bc] bg-[#ffedd6] rounded-md font-Futura-Light text-[#8b5d4b] focus:outline-none focus:ring-2 focus:ring-[#eeac92] resize-none text-sm"
              rows="4"
              placeholder="Share your thoughts about your experience (optional)"
              onChange={(e) => setReview(e.target.value)}
              value={review}></textarea>

            <div className="text-center mt-4">
              <button
                className="w-2/3 py-2 sm:py-3 px-4 bg-[#733519] hover:bg-[#713d28] text-white font-Futura-Light rounded-md transition-colors duration-200 text-sm sm:text-base"
                onClick={handleReviews}>
                Submit Rating
              </button>
            </div>
          </div>

          {showThankYou && (
            <div className="mt-4 p-4 bg-[#eae0d3] rounded-lg border border-[#cda493] shadow-sm">
              <p className="text-base font-Futura-Light text-center text-green-600">
                Thank you for your feedback!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RatingPage;
