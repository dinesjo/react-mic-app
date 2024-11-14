import { CircularProgress } from "@mui/material";

// From https://github.com/mui/material-ui/issues/9496#issuecomment-959408221
export default function GradientCircularProgress() {
  return (
    <>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#70dda5" />
            <stop offset="100%" stopColor="#006390" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ "svg circle": { stroke: "url(#my_gradient)" } }} />
    </>
  );
}
