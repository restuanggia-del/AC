import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import SectionHeading from "../components/SectionHeading";
import TeamCard from "../components/TeamCard";
import { fetchTeam } from "../services/resources";
import type { TeamMember } from "../types";

export default function Team() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam()
      .then(setTeam)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-ink-900 py-16 text-center">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Team Kami
        </h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
          Tim yang siap melayani penjadwalan, pertanyaan, dan keluhan Anda.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Team" title="Kenali Tim Profesional Kami" />
        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : team.length === 0 ? (
            <EmptyState message="Belum ada data team." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <TeamCard key={m._id} member={m} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
