import * as React from "react"
import { SVGProps } from "react"
const Filter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#A6A8AB"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M8 2c1.837 0 3.637.155 5.389.452.355.06.611.37.611.73v.697a1.5 1.5 0 0 1-.44 1.06L9.94 8.561a1.5 1.5 0 0 0-.44 1.06v1.952a1.5 1.5 0 0 1-.83 1.342L6.5 14V9.621a1.5 1.5 0 0 0-.44-1.06L2.44 4.939A1.5 1.5 0 0 1 2 3.88v-.696c0-.36.256-.671.611-.731A32.213 32.213 0 0 1 8 2Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default Filter

