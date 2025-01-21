import * as React from "react"
import { SVGProps } from "react"
const Check = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={8}
    fill="none"
    {...props}
  >
    <path
      stroke="#F3F3F3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1.25 4.313 3 2.5 4.5-5.625"
    />
  </svg>
)
export default Check

