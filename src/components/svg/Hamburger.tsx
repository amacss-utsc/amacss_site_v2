import * as React from "react"
import { SVGProps } from "react"

const Hamburger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 46 40"
    fill="none"
    {...props}
  >
    <path
      stroke="#F3F3F3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={7}
      d="M4.438 4.188h37.124M4.438 20.5h37.124M4.438 36.25h37.124"
    />
  </svg>
)

export default Hamburger

