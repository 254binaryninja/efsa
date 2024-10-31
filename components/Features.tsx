import React from 'react';
import {
    BookOpen,
    Users,
    Briefcase,
    Globe,
    Lightbulb,
    TreePine,
    Network,
    Target,
    Award,
    Flower2
} from 'lucide-react';

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="flex items-center space-x-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
                {icon}
            </div>
            <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
    </div>
);

const Features: React.FC = () => {
    const features = [
        {
            title: "Workshops & Training",
            description: "Comprehensive programs covering job readiness, problem-solving, and innovation skills development.",
            icon: <BookOpen className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Networking & Mentorship",
            description: "Connect with industry professionals and gain guidance from experienced mentors in economics and business.",
            icon: <Network className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Entrepreneurship Incubation",
            description: "Support and resources for aspiring student entrepreneurs to develop their business ideas.",
            icon: <Briefcase className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Global Engagement",
            description: "Participate in international forums and bring insights to benefit local communities.",
            icon: <Globe className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Innovation Hub",
            description: "Platform for creative problem-solving and developing cutting-edge solutions.",
            icon: <Lightbulb className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Environmental Initiatives",
            description: "Programs focused on environmental conservation and sustainable development.",
            icon: <TreePine className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Team Building",
            description: "Activities designed to foster collaboration and build a supportive community.",
            icon: <Users className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Counter Policy Generation",
            description: "Empower students to analyze, critique, and propose policy improvements.",
            icon: <Target className="w-6 h-6 text-blue-600" />
        },
        {
            title: "Talent Development",
            description: "Identify and nurture members' unique skills and strengths through specialized programs.",
            icon: <Award className="w-6 h-6 text-blue-600" />
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        Our Key Programs & Initiatives
                    </h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Empowering students with comprehensive development opportunities
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.icon}
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center p-1 bg-blue-50 rounded-full">
                        <Flower2 className="w-5 h-5 text-blue-600 mr-2" />
                        <p className="text-blue-800 font-medium px-3">
              Spearheading Holistic Transformation
            </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;