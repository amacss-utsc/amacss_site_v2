import { Octokit } from "octokit"

export class GitHubClient {
  private octokit: Octokit
  private owner: string
  private repo: string

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: token })
    this.owner = owner
    this.repo = repo
  }

  async createBranch(branchName: string): Promise<string> {
    const { data: ref } = await this.octokit.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: "heads/main",
    })
    const sha = ref.object.sha

    await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha,
    })

    return sha
  }

  async commitFiles(
    branch: string,
    commitSha: string,
    folder: string,
    files: File[],
  ): Promise<void> {
    // 1. Get tree SHA from the commit
    const { data: commit } = await this.octokit.rest.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: commitSha,
    })
    const treeSha = commit.tree.sha

    // 2. For each file: create a blob (base64 encoded)
    const blobs = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer()
        const content = Buffer.from(buffer).toString("base64")

        const { data: blob } = await this.octokit.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content,
          encoding: "base64",
        })

        return {
          path: `${folder}/${file.name}`,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blob.sha,
        }
      }),
    )

    // 3. Create a new tree with all the blobs, based on the existing tree
    const { data: newTree } = await this.octokit.rest.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: treeSha,
      tree: blobs,
    })

    // 4. Create a single commit pointing to the new tree
    const { data: newCommit } = await this.octokit.rest.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: `Add files to ${folder}`,
      tree: newTree.sha,
      parents: [commitSha],
    })

    // 5. Update the branch ref to point at the new commit
    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    })
  }

  async openPR(branch: string, title: string, body: string): Promise<string> {
    const { data: pr } = await this.octokit.rest.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      body,
      head: branch,
      base: "main",
    })

    return pr.html_url
  }
}
