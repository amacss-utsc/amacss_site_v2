import * as React from "react"
import { SVGProps } from "react"
const ChevronRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={17}
    fill="none"
    {...props}
  >
    <path
      stroke="#A6A8AB"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="m2 2 6.25 6.25L2 14.5"
    />
  </svg>
)
export default ChevronRight

