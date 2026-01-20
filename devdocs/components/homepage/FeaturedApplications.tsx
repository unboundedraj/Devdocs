import { Application } from '@/types/application';

interface FeaturedApplicationsProps {
  applications: Application[];
}

export default function FeaturedApplications({ applications }: FeaturedApplicationsProps) {
  if (!applications || applications.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Featured Applications
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {applications.map(app => (
            <a
              key={app.uid}
              href={`/applications/${app.uid}`}
              className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{app.title}</h3>
              <p className="text-gray-600">{app.app_description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
