'use client'

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/Auth"
import { Event, EventTag } from "@/payload-types"
import Image from "next/image"
import RichText from "../RichText"

type PageProps = {
  event: Event
}

const EventRegister: FC<PageProps> = ({ event }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<{ [key: string]: string | File }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const im = typeof event.image !== "number" ? event.image : null

  if (!im) return null

  const { url, alt, width, height } = im
  if (!url || !alt || width == null || height == null) return null

  const eTags = typeof event?.eventTag !== "number" ? event.eventTag : []

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      // Check if files exist in the input
      if (e.target.files && e.target.files.length > 0) {
        console.log("ADDING FILE", e)
        const file = e.target.files[0]; // Get the first file
        setFormData((prev) => ({
          ...prev,
          [name]: file, // Save the File object to formData
        }));
      } else {
        console.error(`No file selected for field: ${name}`);
      }
    } else {
      // For text and dropdown inputs
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const clearForm = () => {
    setFormData({})
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      alert("You must be logged in to register.");
      return;
    }

    if (!event.id) {
      alert("Invalid event.");
      return;
    }

    try {
      const submissionData = new FormData();

      // Append the event and user IDs
      submissionData.append("eventId", event.id.toString());
      submissionData.append("userId", user.id.toString());

      // Append form answers
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value instanceof File) {
          // Append file fields
          submissionData.append(key, value);
        } else if (typeof value === "string") {
          // Append text fields
          submissionData.append(key, value);
        }
      });

      // Perform the POST request
      const response = await fetch("/api/registrations", {
        method: "POST",
        body: submissionData,
      });

      if (response.ok) {
        alert("Registration successful!");
        clearForm();
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData);
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <main className="bg-gray-02 h-full lg:rounded-tl-[32px] overflow-y-scroll">
      {/* <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-[340px] object-cover"
      /> */}
      <div className="pt-6 px-8 lg:pt-11 lg:px-16">
        <hgroup className="flex items-center justify-between w-full">
          <h1 className="text-gray-90 font-bold uppercase text-4xl">{event.title}</h1>
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
          {eTags.map((i: EventTag, j) => (
            <div
              className="rounded-[8px] border-[2px] border-gray-05 p-1.5 bg-gray-02 text-black text-xs font-semibold text-opacity-40"
              key={j}
            >
              {i.eventTag}
            </div>
          ))}
        </div>
        <div className="overflow-y-auto flex-grow relative">
          <RichText content={event.description} className="w-full mx-0 px-0" />
        </div>
        <form className="space-y-6 py-11" onSubmit={handleSubmit}>
          {event.registrationForm?.map((field, i) => (
            <div key={i} className="flex flex-col">
              {field.type !== "image" && (
                <label
                  htmlFor={field.fieldid}
                  className="mb-1.5 text-xl font-bold text-gray-90 uppercase"
                >
                  {field.name}
                  {field.description && (
                    <p className="text-sm text-gray-50 mt-1 font-normal normal-case">
                      {field.description}
                    </p>
                  )}
                </label>
              )}
              {field.type === "short_short" && (
                <input
                  id={field.fieldid}
                  name={field.fieldid}
                  type="text"
                  placeholder={field.placeholder || ""}
                  // @ts-ignore
                  value={formData[field.fieldid] instanceof File ? "" : formData[field.fieldid] || ""}
                  onChange={handleChange}
                  className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                />
              )}
              {field.type === "short" && (
                <input
                  id={field.fieldid}
                  name={field.fieldid}
                  type="text"
                  placeholder={field.placeholder || ""}
                  // @ts-ignore
                  value={formData[field.fieldid] instanceof File ? "" : formData[field.fieldid] || ""}
                  onChange={handleChange}
                  className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                />
              )}
              {field.type === "multiline" && (
                <textarea
                  id={field.fieldid}
                  name={field.fieldid}
                  placeholder={field.placeholder || ""}
                  rows={4}
                  // @ts-ignore
                  value={formData[field.fieldid] instanceof File ? "" : formData[field.fieldid] || ""}
                  onChange={handleChange}
                  className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                />
              )}
              {field.type === "image" && (
                <div className="flex flex-col w-1/4">
                  <label
                    htmlFor={field.fieldid}
                    className="mb-1.5 text-xl font-bold text-gray-90 uppercase"
                  >
                    {field.name}
                  </label>
                  <input
                    id={field.fieldid}
                    name={field.fieldid}
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl"
                  />
                </div>
              )}
              {field.type === "dropdown" && (
                <select
                  id={field.fieldid}
                  name={field.fieldid}
                  onChange={handleChange}
                  // @ts-ignore
                  value={formData[field.fieldid] || ""}
                  className="border-2 border-gray-20 rounded-[16px] px-6 py-5 bg-gray-02 text-black font-bold placeholder:uppercase placeholder:text-gray-20 text-xl invalid:text-gray-20 invalid:uppercase"
                  defaultValue=""
                  required
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
              )}
            </div>
          ))}
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

