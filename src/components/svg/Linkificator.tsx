import * as React from "react"
import { SVGProps } from "react"
const Linkificator = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={6}
    height={9}
    fill="none"
    {...props}
  >
    <path
      stroke="#056FFA"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m1.5.833 3.438 3.438L1.5 7.708"
    />
  </svg>
)
export default Linkificator

