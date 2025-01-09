import * as React from "react"
import { SVGProps } from "react"
const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={19}
    fill="none"
    {...props}
  >
    <path
      stroke="#A6A8AB"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M32 2 17 17 2 2"
    />
  </svg>
)
export default ChevronDown

