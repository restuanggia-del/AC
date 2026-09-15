import { Camera, ThumbsUp } from "lucide-react";
import type { TeamMember } from "../types";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-ink-100 bg-white text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-100 hover:shadow-xl hover:shadow-brand-600/10">
      <div className="aspect-square w-full bg-ink-100">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-ink-300">
            {member.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-bold text-ink-900">{member.name}</p>
        <p className="text-sm font-medium text-brand-600">{member.position}</p>
        {member.description && (
          <p className="mt-2 text-xs text-ink-400">{member.description}</p>
        )}
        <div className="mt-3 flex justify-center gap-2">
          {member.socialLinks?.instagram && (
            <a
              href={member.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full bg-ink-100 p-2 hover:bg-brand-100"
            >
              <Camera className="h-4 w-4 text-ink-600" />
            </a>
          )}
          {member.socialLinks?.facebook && (
            <a
              href={member.socialLinks.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full bg-ink-100 p-2 hover:bg-brand-100"
            >
              <ThumbsUp className="h-4 w-4 text-ink-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
