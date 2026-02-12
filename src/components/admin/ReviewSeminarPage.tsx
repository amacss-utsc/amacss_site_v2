"use client"

import React, { useState } from "react"
import { SelectInput, TextInput } from "@payloadcms/ui"

const ReviewSeminarPage: React.FC = () => {
  const [department, setDepartment] = useState<string>("")
  const [courseCode, setCourseCode] = useState<string>("")
  const [year, setYear] = useState<string>("")
  const [semester, setSemester] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [status, setStatus] = useState<string>("")
  const [prUrl, setPrUrl] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("Submitting...")
    setPrUrl("")
    setSubmitting(true)

    const formData = new FormData()
    formData.append("department", department)
    formData.append("courseCode", courseCode)
    formData.append("year", year)
    formData.append("semester", semester)
    formData.append("description", description)

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })
    }

    try {
      const response = await fetch("/apiv2/review-seminar", {
        method: "POST",
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok && data.prUrl) {
        setStatus("PR created successfully!")
        setPrUrl(data.prUrl)
      } else {
        setStatus(`Error: ${data?.detail ?? data?.error ?? "Request failed"}`)
      }
    } catch (error) {
      setStatus("Error: network request failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
        Review Seminar Upload
      </h1>
      <p>Draft form for the upload portal.</p>
      <form
        style={{
          display: "grid",
          gap: "1rem",
          marginTop: "1.5rem",
          maxWidth: "520px",
        }}
        onSubmit={handleSubmit}
      >
        <SelectInput
          label="Department"
          name="department"
          options={[
            { label: "MAT", value: "MAT" },
            { label: "STA", value: "STA" },
            { label: "CSC", value: "CSC" },
          ]}
          path="department"
          required
          value={department}
          onChange={(selected: any) => {
            if (Array.isArray(selected)) {
              setDepartment(String(selected[0]?.value ?? ""))
            } else {
              setDepartment(String(selected?.value ?? ""))
            }
          }}
        />

        <TextInput
          label="Course code"
          path="courseCode"
          placeholder="a31"
          required
          value={courseCode}
          onChange={(event) => setCourseCode(event.target.value)}
        />

        <TextInput
          label="Year"
          path="year"
          placeholder="2025"
          required
          value={year}
          onChange={(event) => setYear(event.target.value)}
        />

        <SelectInput
          label="Semester"
          name="semester"
          options={[
            { label: "Fall", value: "fall" },
            { label: "Winter", value: "winter" },
            { label: "Summer", value: "summer" },
          ]}
          path="semester"
          required
          value={semester}
          onChange={(selected: any) => {
            if (Array.isArray(selected)) {
              setSemester(String(selected[0]?.value ?? ""))
            } else {
              setSemester(String(selected?.value ?? ""))
            }
          }}
        />

        <label style={{ display: "grid", gap: "0.5rem" }}>
          Description
          <textarea
            name="description"
            rows={6}
            placeholder="Add notes here..."
            style={{
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label style={{ display: "grid", gap: "0.5rem" }}>
          Upload files
          <input
            name="files"
            type="file"
            multiple
            onChange={(event) => setFiles(event.target.files)}
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Uploading..." : "Submit"}
        </button>
      </form>
      {status ? <p style={{ marginTop: "1rem" }}>{status}</p> : null}
      {prUrl ? (
        <a
          href={prUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: "0.5rem" }}
        >
          View PR on GitHub
        </a>
      ) : null}
    </div>
  )
}

export default ReviewSeminarPage
