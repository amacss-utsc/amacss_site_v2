import { Trophy } from "lucide-react"

type LeaderboardEntry = {
  id: string
  name: string
  points: number
}

type CurrentMember = LeaderboardEntry & {
  rank: number
}

type LeaderboardPageProps = {
  topAttendees: LeaderboardEntry[]
  currentMember: CurrentMember | null
}

export const LeaderboardPage = ({
  topAttendees,
  currentMember,
}: LeaderboardPageProps) => (
  <main className="min-h-full overflow-y-auto bg-gray-90 px-4 pb-12 pt-20 text-gray-02 lg:rounded-tl-[32px] lg:px-11 lg:pb-16 lg:pt-11">
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold text-white lg:text-4xl">
        Events Leaderboard
      </h1>

      {currentMember ? (
        <section className="mb-8" aria-labelledby="your-ranking-heading">
          <h2
            id="your-ranking-heading"
            className="mb-3 text-xl font-bold text-white lg:text-2xl"
          >
            Your Ranking
          </h2>
          <div className="grid grid-cols-[64px_minmax(0,1fr)_76px] items-center overflow-hidden rounded-xl border border-blue-30 bg-gray-80 lg:grid-cols-[84px_minmax(0,1fr)_104px]">
            <p className="flex min-h-16 items-center justify-center border-r border-blue-30 text-lg font-bold text-white lg:min-h-20 lg:text-xl">
              {currentMember.rank}
            </p>
            <p className="truncate px-5 text-base font-semibold text-gray-02 lg:px-7 lg:text-xl">
              {currentMember.name}
            </p>
            <p className="flex min-h-16 items-center justify-center border-l border-blue-30 bg-gray-70 text-base font-bold text-white lg:min-h-20 lg:text-xl">
              <span className="sr-only">Points: </span>
              {currentMember.points}
            </p>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="top-attendees-heading">
        <div className="rounded-t-2xl bg-gray-80 px-6 py-5">
          <h2
            id="top-attendees-heading"
            className="text-xl font-bold text-white lg:text-2xl"
          >
            Top 10 Attendees
          </h2>
        </div>

        {topAttendees.length === 0 ? (
          <p className="mt-4 rounded-xl border border-gray-50 bg-gray-80 px-6 py-8 text-gray-10">
            No member points have been recorded yet.
          </p>
        ) : (
          <ol className="mt-4 space-y-3">
            {topAttendees.map((attendee, index) => {
              const rank = index + 1
              const isPodium = rank <= 3

              return (
                <li
                  key={attendee.id}
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
        )}
      </section>
    </div>
  </main>
)
