import * as React from "react"
import { SVGProps } from "react"
const InfoI = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <path
      stroke="#2F8CFE"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="m6.563 6.563.023-.012a.437.437 0 0 1 .62.497l-.413 1.654a.438.438 0 0 0 .62.498l.024-.012M12.25 7A5.25 5.25 0 1 1 1.749 7 5.25 5.25 0 0 1 12.25 7ZM7 4.812h.005v.005H7v-.005Z"
    />
  </svg>
)
export default InfoI

