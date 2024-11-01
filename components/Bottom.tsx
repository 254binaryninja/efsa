'use client'

import React from 'react';
import Contact from "@/components/Contact";
import { MessageCircle, ArrowRight } from 'lucide-react';

interface ContactProps {
    contactRef?: React.RefObject<HTMLElement | null>;
}

function Bottom({ contactRef }: ContactProps) {
    return (
        <section
            ref={contactRef}
            className="relative py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                 style={{
                     backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 }}
            />

            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 max-sm:gap-8">
                    {/* Left Content */}
                    <div className="lg:w-1/3">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 mb-6">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Get in Touch</span>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            Join Us Now
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed">
                            Have any questions? We{"'"}re here to help! Reach out to us and become part of our growing community.
                        </p>

                        <div className="mt-8 flex items-center text-blue-600 hover:text-blue-700 transition-colors group cursor-pointer">
                            <span className="font-medium">Learn more about membership</span>
                            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>

                    {/* Right Content - Contact Form */}
                    <div className="lg:w-7/12">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <Contact />
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl opacity-20 -z-10"></div>
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>
            </div>
        </section>
    );
}

export default Bottom;