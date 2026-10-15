import { Trophy } from "lucide-react"

type LeaderboardEntry = {
  name: string
  points: number
}

const topAttendees: LeaderboardEntry[] = [
  { name: "User", points: 100 },
  { name: "User", points: 90 },
  { name: "User", points: 80 },
  { name: "User", points: 70 },
  { name: "User", points: 60 },
  { name: "User", points: 50 },
  { name: "User", points: 40 },
  { name: "User", points: 30 },
  { name: "User", points: 20 },
  { name: "User", points: 10 },
]

export const LeaderboardPage = () => (
  <main className="min-h-full overflow-y-auto bg-gray-90 px-4 pb-12 pt-20 text-gray-02 lg:rounded-tl-[32px] lg:px-11 lg:pb-16 lg:pt-11">
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-white lg:text-4xl">
        Events Leaderboard
      </h1>

      <section aria-labelledby="top-attendees-heading">
        <div className="rounded-t-2xl bg-gray-80 px-6 py-5">
          <h2
            id="top-attendees-heading"
            className="text-xl font-bold text-white lg:text-2xl"
          >
            Top 10 Attendees
          </h2>
        </div>

        <ol className="mt-4 space-y-3">
          {topAttendees.map((attendee, index) => {
            const rank = index + 1
            const isPodium = rank <= 3

            return (
              <li
                key={rank}
                className="grid grid-cols-[64px_minmax(0,1fr)_76px] items-center overflow-hidden rounded-xl border border-gray-50 bg-gray-80 lg:grid-cols-[84px_minmax(0,1fr)_104px]"
              >
                <div className="flex h-full min-h-16 items-center justify-center border-r border-gray-50 text-lg font-bold text-white lg:min-h-20 lg:text-xl">
                  {isPodium ? (
                    <Trophy
                      aria-hidden="true"
                      className="mr-1 h-4 w-4 text-blue-20 lg:h-5 lg:w-5"
                    />
                  ) : null}
                  {rank}
                </div>
                <p className="truncate px-5 text-base font-semibold text-gray-02 lg:px-7 lg:text-xl">
                  {attendee.name}
                </p>
                <p className="flex h-full min-h-16 items-center justify-center border-l border-gray-50 bg-gray-70 text-base font-bold text-white lg:min-h-20 lg:text-xl">
                  <span className="sr-only">Points: </span>
                  {attendee.points}
                </p>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  </main>
)
