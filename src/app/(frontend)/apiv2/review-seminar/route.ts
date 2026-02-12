import { NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { GitHubClient } from "@/utilities/github"

type ParsedForm = {
  department: string
  courseCode: string
  year: string
  semester: string
  description: string
  files: File[]
}

async function parseAndValidate(
  req: Request,
): Promise<
  { success: true; data: ParsedForm } | { success: false; error: NextResponse }
> {
  const contentType = req.headers.get("content-type")
  if (!contentType?.includes("multipart/form-data")) {
    return {
      success: false,
      error: NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 },
      ),
    }
  }

  const formData = await req.formData()

  const department = formData.get("department")?.toString().toLowerCase()
  const courseCode = formData.get("courseCode")?.toString().toLowerCase()
  const year = formData.get("year")?.toString()
  const semester = formData.get("semester")?.toString().toLowerCase()
  const description = formData.get("description")?.toString() ?? ""

  if (!department || !courseCode || !year || !semester) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error:
            "Missing required fields: department, courseCode, year, or semester",
        },
        { status: 400 },
      ),
    }
  }

  const files: File[] = []
  for (const [key, value] of formData.entries()) {
    if (key === "files" && value instanceof File) {
      files.push(value)
    }
  }

  if (files.length === 0) {
    return {
      success: false,
      error: NextResponse.json(
        { error: "At least one file is required" },
        { status: 400 },
      ),
    }
  }

  return {
    success: true,
    data: { department, courseCode, year, semester, description, files },
  }
}

export async function POST(req: Request) {
  // TODO: Auth — verify logged-in Payload admin user

  // 2. Parse & validate
  const parsed = await parseAndValidate(req)
  if (!parsed.success) return parsed.error
  const { department, courseCode, year, semester, description, files } =
    parsed.data

  // 3. GitHub operations
  const folder = `resources/${department}/${courseCode}/${year}/${semester}`
  const branchName = `upload/${department}-${courseCode}-${semester}-${year}-${Date.now()}`

  try {
    const gh = new GitHubClient(
      process.env.RS_GITHUB_TOKEN!,
      process.env.GITHUB_REPO_OWNER!,
      process.env.GITHUB_REPO_NAME!,
    )

    const commitSha = await gh.createBranch(branchName)
    await gh.commitFiles(branchName, commitSha, folder, files)
    const prUrl = await gh.openPR(
      branchName,
      `[Upload] ${department.toUpperCase()} ${courseCode.toUpperCase()} — ${semester.charAt(0).toUpperCase() + semester.slice(1)} ${year}`,
      `Uploaded ${files.length} file(s) to \`${folder}/\`\n\n${description}`,
    )

    return NextResponse.json({ success: true, prUrl }, { status: 201 })
  } catch (error: any) {
    console.error("Review seminar upload error:", error)
    return NextResponse.json(
      { error: "Failed to create PR", detail: error?.message ?? String(error) },
      { status: 500 },
    )
  }
}
