import Image from "next/image";
import { stories } from "@/data/home";

export default function Gallery() {
  return (
    <section id="community" className="section-space bg-background">
      <div className="page-container">
        <div className="section-heading">
          <p className="eyebrow">Stories from our streets</p>
          <h2>Community looks good on us.</h2>
          <p className="section-description max-lg:hidden">Scenes of neighbors making everyday kindness visible.</p>
        </div>
        <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 max-sm:gap-4">
          {stories.map((story, index) => (
            <figure key={story.title} className={index > 3 ? "hidden lg:block" : ""}>
              <Image src={story.image} alt={story.alt} width={373} height={238} sizes="(max-width: 1023px) 50vw, 33vw" className="aspect-[1.55] w-full rounded-2xl object-cover max-sm:aspect-square" />
              <figcaption className="px-4 pt-4 max-sm:hidden">
                <p className="eyebrow">{story.category}</p>
                <h3 className="mt-2 text-xl">{story.title}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
