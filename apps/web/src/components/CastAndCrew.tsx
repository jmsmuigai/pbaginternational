import Image from "next/image";

interface CastMember {
  name: string;
  role: string;
  imageUrl?: string;
}

export function CastAndCrew({ castAndCrew }: { castAndCrew: CastMember[] }) {
  if (!castAndCrew || castAndCrew.length === 0) return null;

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="font-display text-2xl font-bold text-cream">Cast & Crew</h3>
      <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {castAndCrew.map((member, i) => (
          <div key={i} className="group flex flex-col items-center text-center">
            <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-2 border-gold/20 shadow-lg transition duration-300 group-hover:border-gold group-hover:shadow-gold/20">
              {member.imageUrl ? (
                <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface text-xl font-bold text-cream/30">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <p className="font-display text-sm font-bold text-cream">{member.name}</p>
            <p className="mt-0.5 text-xs text-gold/80">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
