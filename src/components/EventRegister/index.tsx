'use client'

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/Auth"
import { Event, EventTag } from "@/payload-types"
import Image from "next/image"
import RichText from "../RichText"
// Example toast library
import { toast } from "react-hot-toast"

type PageProps = {
  event: Event
}

const EventRegister: FC<PageProps> = ({ event }) => {
  const { user } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState<Record<string, string | File>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple check for image
  const im = typeof event.image !== "number" ? event.image : null
  if (!im) return null
  const { url, alt, width, height } = im
  if (!url || !alt || width == null || height == null) return null

  const eTags = typeof event?.eventTag !== "number" ? event.eventTag : []

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name } = e.target

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }))
      }
    } else {
      const { value } = e.target
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
    // Clear error once user changes input
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  // Local validation for required fields
  const validateForm = () => {
    const errors: Record<string, string> = {}

    event.registrationForm?.forEach((field) => {
      if (field.requiredField) {
        const value = formData[field.fieldid]
        // For files, if it’s not there, or for text fields if empty string
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors[field.fieldid] = "This field is required"
        }
      }
      
    })

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!user) {
      toast.error("You must be logged in to register.")
      setIsSubmitting(false)
      return
    }

    if (!event.id) {
      toast.error("Invalid event.")
      setIsSubmitting(false)
      return
    }

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error("Please fill out all required fields.")
      setIsSubmitting(false)
      return
    }

    for (const field of event.registrationForm || []) {
      if (field.type === "referral") {
        const code = formData[field.fieldid]
        if (code && typeof code === "string") {
          try {
            const encodedCode = encodeURIComponent(code)
            const encodedEventId = encodeURIComponent(event.id.toString())

            const res = await fetch(
              `/apiv2/registrations?referralCode=${encodedCode}&eventId=${encodedEventId}`
            )
            const data = await res.json()
            console.log(data)
  
            if (!data.docs || data.docs.length === 0) {
              setFormErrors((prev) => ({
                ...prev,
                [field.fieldid]: "Invalid referral code",
              }))
              toast.error("Invalid referral code.")
              setIsSubmitting(false)
              return
            }
          } catch (err) {
            console.error("Error checking referral code:", err)
            setFormErrors((prev) => ({
              ...prev,
              [field.fieldid]: "Error validating code. Please try again.",
            }))
            toast.error("Error validating code. Please try again.")
            setIsSubmitting(false)
            return
          }
        }
      }
    }
  

    const submissionData = new FormData()
    submissionData.append("eventId", event.id.toString())
    submissionData.append("userId", user.id.toString())

    // Add each field’s answer
    Object.keys(formData).forEach((key) => {
      const value = formData[key]
      if (value instanceof File) {
        submissionData.append(key, value)
      } else {
        submissionData.append(key, value)
      }
    })

    // 3) Submit via API
    try {
      const response = await fetch("/apiv2/registrations", {
        method: "POST",
        body: submissionData,
      })
      if (response.ok) {
        toast.success("Registration successful!")
        router.push(`/register/event/${event.id}/thanks`)
      } else {
        const errorData = await response.json()
        console.error("Error:", errorData)
        toast.error("Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-gray-02 h-full lg:rounded-tl-[32px] overflow-y-scroll overflow-x-hidden">
      {/* <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-[340px] object-cover"
      /> */}
      <div className="pt-6 px-8 lg:pt-11 lg:px-16">
        <hgroup className="flex items-center justify-between w-full">
          <h1 className="text-gray-90 font-bold uppercase text-4xl">
            {event.title}
          </h1>
        </hgroup>
        <div className="w-full h-[3px] bg-gray-90 my-2" />
        <h2 className="text-gray-90 font-bold uppercase mb-2">
          {new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          {" @ "}
          {event.startTime} - {event.endTime}
        </h2>
        <div className="w-full mb-4 flex flex-row gap-2">
          {eTags.map((tag: EventTag, j) => (
            <div
              className="rounded-[8px] border-[2px] border-gray-05 p-1.5 bg-gray-02 text-black text-xs font-semibold text-opacity-40"
              key={j}
            >
              {tag.eventTag}
            </div>
          ))}
        </div>
        <div className="overflow-y-auto flex-grow relative">
          <RichText content={event.description} className="w-full mx-0 px-0" />
        </div>
        <form className="space-y-6 py-11" onSubmit={handleSubmit}>
          {event.registrationForm?.map((field, i) => {
            const isRequired = Boolean(field.requiredField)

            return (
              <div key={i} className="flex flex-col">
                {/* Label */}
                {field.type !== "image" && (
                  <label
                    htmlFor={field.fieldid}
                    className="mb-1.5 text-xl font-bold text-gray-90 uppercase"
                  >
                    {field.name}
                    {isRequired && <span className="text-red-500 ml-1">*</span>}
                    {field.description && (
                      <p className="text-sm text-gray-50 mt-1 font-normal normal-case">
                        {field.description}
                      </p>
                    )}
                  </label>
                )}

                {/* Short Text */}
                {field.type === "short_short" && (
                  <>
                    <input
                      id={field.fieldid}
                      name={field.fieldid}
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={
                        formData[field.fieldid] instanceof File
                          ? ""
                          : (formData[field.fieldid] as string) || ""
                      }
                      onChange={handleChange}
                      className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                    />
                    {formErrors[field.fieldid] && (
                      <p className="text-red-500 mt-1">
                        {formErrors[field.fieldid]}
                      </p>
                    )}
                  </>
                )}

                {/* Single-Line Text */}
                {field.type === "short" && (
                  <>
                    <input
                      id={field.fieldid}
                      name={field.fieldid}
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={
                        formData[field.fieldid] instanceof File
                          ? ""
                          : (formData[field.fieldid] as string) || ""
                      }
                      onChange={handleChange}
                      className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                    />
                    {formErrors[field.fieldid] && (
                      <p className="text-red-500 mt-1">
                        {formErrors[field.fieldid]}
                      </p>
                    )}
                  </>
                )}

                {/* Multiline */}
                {field.type === "multiline" && (
                  <>
                    <textarea
                      id={field.fieldid}
                      name={field.fieldid}
                      placeholder={field.placeholder || ""}
                      rows={4}
                      value={
                        formData[field.fieldid] instanceof File
                          ? ""
                          : (formData[field.fieldid] as string) || ""
                      }
                      onChange={handleChange}
                      className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                    />
                    {formErrors[field.fieldid] && (
                      <p className="text-red-500 mt-1">
                        {formErrors[field.fieldid]}
                      </p>
                    )}
                  </>
                )}

                {/* Image */}
                {field.type === "image" && (
                  <div className="flex flex-col w-1/4">
                    <label
                      htmlFor={field.fieldid}
                      className="mb-1.5 text-xl font-bold text-gray-90 uppercase"
                    >
                      {field.name}
                      {isRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.description && (
                      <p className="text-sm text-gray-50 mt-1 font-normal normal-case">
                        {field.description}
                      </p>
                    )}
                    <input
                      id={field.fieldid}
                      name={field.fieldid}
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                    />
                    {formErrors[field.fieldid] && (
                      <p className="text-red-500 mt-1">
                        {formErrors[field.fieldid]}
                      </p>
                    )}
                  </div>
                )}

                {field.type === "referral" && (
                  <>
                    <input
                      id={field.fieldid}
                      name={field.fieldid}
                      type="text"
                      placeholder={field.placeholder || ""}
                      value={
                        formData[field.fieldid] instanceof File
                          ? ""
                          : (formData[field.fieldid] as string) || ""
                      }
                      onChange={handleChange}
                      className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold
                                placeholder:uppercase placeholder:text-gray-20 text-xl"
                    />
                    {formErrors[field.fieldid] && (
                      <p className="text-red-500 mt-1">
                        {formErrors[field.fieldid]}
                      </p>
                    )}
                  </>
                )}

                {/* Dropdown */}
                {field.type === "dropdown" && (
                  <>
                    <select
                      id={field.fieldid}
                      name={field.fieldid}
                      onChange={handleChange}
                      value={(formData[field.fieldid] as string) || ""}
                      className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl invalid:text-gray-20 invalid:uppercase"
                      required={isRequired}
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {field.dropdownOptions?.map((option, j) => (
                        <option key={j} value={option.option}>
                          {option.option}
                        </option>
                      ))}
                    </select>
                    {formErrors[field.fieldid] && (
                      <p className="text-red-500 mt-1">
                        {formErrors[field.fieldid]}
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
          <div className="w-full flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-30 text-gray-02 uppercase font-black text-2xl py-5 px-44 rounded-[16px]"
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default EventRegister
