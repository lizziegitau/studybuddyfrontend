import { Button } from "@mui/material";

function NotFoundPage () {

const NotFoundPuns = [
  "Oops! Looks like this page pulled an all-nighter and didn’t make it.",
  "This page didn’t study hard enough and failed to load.",
  "Page not found. Maybe it’s in the lost and found?",
  "You’ve reached a page that doesn’t exist. Unlike your never-ending to-do list.",
  "Memory Error: This page forgot to exist. Maybe try revising?",
  "Looks like this page missed the deadline. Just like my last assignment.",
  "This page must have taken a wrong turn at the library.",
  "Motivation not found… oh wait, I mean page not found.",
  "Well, this is awkward... kind of like group projects.",
  "The page is missing, like my will to study.",
  "Page disappeared like my weekend plans.",
  "This page is still in draft mode. Maybe we should have reviewed our notes?",
  "The page was due yesterday, but it’s still not here.",
  "The page you’re looking for is playing hide and seek... and winning.",
  "This page dropped out. Guess it wasn't ready for finals.",
  "Looks like this page skipped class today. Maybe try again later?",
  "The page you’re looking for took an extended study break."
]

const randomPun = NotFoundPuns[Math.floor(Math.random() * NotFoundPuns.length)];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-[#FFF4EE]">
      <div className="flex-[2] flex justify-center">
        <img
          src="/images/404pic.png"
          alt="Tired Student at Desk"
          className="w-[90%] md:w-[90%]"
        />
      </div>

      <div className="flex-1 text-center md:text-left px-6 md:px-12">
        <h1 className="text-[110px] font-bold text-[#9381FF] leading-none">404</h1>
        <h2 className="text-[40px] font-semibold text-[#9381FF]">Page not found</h2>
        <p className="text-gray-600 mt-2 text-[24px]">{randomPun}</p>

        <Button
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: "#9381FF",
            color: "white",
            "&:hover": { backgroundColor: "B8B8FF", color: "black" },
            textTransform: "none",
            fontSize: "16px",
            padding: "8px 20px",
            borderRadius: "8px",
          }}
          onClick={() => (window.location.href = "/dashboard")}
        >
          Back To Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
