import * as React from "react"
import { SVGProps } from "react"
const User = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#F3F3F3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M18.98 19.846A8.736 8.736 0 0 0 12 16.375a8.736 8.736 0 0 0-6.979 3.47m13.958 0a10.498 10.498 0 0 0 2.835-11.578A10.5 10.5 0 1 0 5.02 19.846m13.958 0A10.463 10.463 0 0 1 12 22.5a10.46 10.46 0 0 1-6.979-2.654m10.48-10.471a3.5 3.5 0 1 1-7.002 0 3.5 3.5 0 0 1 7.001 0Z"
    />
  </svg>
)
export default User

