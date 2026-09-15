import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import Reveal from "../components/Reveal";
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
      <section className="relative overflow-hidden bg-ink-900 py-16 text-center">
        <div className="bg-grid-white absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
        <Reveal direction="up" className="relative">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Team Kami
          </h1>
          <p className="mx-auto mt-3 max-w-xl px-4 text-ink-300">
            Tim yang siap melayani penjadwalan, pertanyaan, dan keluhan Anda.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal direction="up">
          <SectionHeading eyebrow="Team" title="Kenali Tim Profesional Kami" />
        </Reveal>
        <div className="mt-10">
          {loading ? (
            <Loader />
          ) : team.length === 0 ? (
            <EmptyState message="Belum ada data team." />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m, i) => (
                <Reveal key={m._id} direction="up" delay={(i % 4) * 90}>
                  <TeamCard member={m} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
