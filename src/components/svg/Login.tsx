import * as React from "react"
import { SVGProps } from "react"
const Login = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#F3F3F3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M18.313 10.25V5.562c0-.745-.336-1.46-.934-1.988-.598-.528-1.409-.824-2.254-.824h-8.5c-.845 0-1.656.296-2.254.824-.598.527-.934 1.243-.934 1.989v16.875c0 .745.336 1.46.934 1.988.598.528 1.409.824 2.254.824h8.5c.845 0 1.656-.296 2.254-.824.598-.527.933-1.243.933-1.988V17.75M13 10.25 8.75 14m0 0L13 17.75M8.75 14h18.063"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h28v28H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default Login

