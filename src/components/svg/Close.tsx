import * as React from "react"
import { SVGProps } from "react"
const Close = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path
      stroke="#818488"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1 21 21 1M1 1l20 20"
    />
  </svg>
)
export default Close

