"use client";

import AboutCard from "@/components/AboutCard";
import { Droplet, Leaf, Users, Award, Globe, TrendingUp } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden bg-black">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-black to-red-950 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(220,38,38,0.3),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.2),transparent_50%)]" />
                </div>

                <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-32 text-center">
                    {/* Title */}
                    <h1 className="text-7xl md:text-9xl font-black mb-8 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-pulse">
                        Coca-Cola
                    </h1>

                    {/* Decorative Line */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent to-red-500 rounded-full" />
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                        <div className="h-1 w-24 bg-gradient-to-l from-transparent to-red-500 rounded-full" />
                    </div>

                    {/* Tagline */}
                    <p className="text-2xl md:text-4xl text-white/90 font-semibold mb-8 max-w-4xl mx-auto">
                        Refreshing the World, Making a Difference
                    </p>

                    <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                        Since 1886, we've been bringing people together with the simple pleasure of a refreshing beverage.
                    </p>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
            </section>

            {/* Our Story Section */}
            <section className="relative bg-black py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Title */}
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                                Our Story
                            </h2>
                            <div className="h-1 w-24 bg-red-500 mx-auto rounded-full" />
                        </div>

                        {/* Story Content */}
                        <div className="text-white/80 text-lg md:text-xl leading-relaxed space-y-8">
                            <p>
                                On <span className="text-red-500 font-semibold">May 8, 1886</span>, Dr. John Pemberton brought his perfected syrup to Jacobs' Pharmacy in downtown Atlanta where the first glass of Coca‑Cola was poured. From that one iconic drink, we've evolved into a total beverage company. More than <span className="text-red-500 font-semibold">2.2 billion servings</span> of our drinks are enjoyed in more than <span className="text-red-500 font-semibold">200 countries and territories</span> each day.
                            </p>
                            <p>
                                We are constantly transforming our portfolio, from reducing added sugar in our drinks to bringing innovative new products to market. We seek to positively impact people's lives, communities and the planet through water replenishment, packaging recycling, sustainable sourcing practices and carbon emissions reductions across our value chain.
                            </p>
                            <p>
                                Together with our bottling partners, we employ more than <span className="text-red-500 font-semibold">700,000 people</span>, helping bring economic opportunity to local communities worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="relative bg-gradient-to-br from-red-950 via-black to-neutral-950 py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            Our Core Values
                        </h2>
                        <div className="h-1 w-24 bg-red-500 mx-auto rounded-full" />
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <div className="transform transition-all duration-500 hover:-translate-y-2">
                            <AboutCard
                                title="Our Purpose"
                                description="To refresh the world and make a difference. We are committed to offering people more of the drinks they want across a range of categories and sizes while driving sustainable solutions that build resilience into our business and create positive change for the planet."
                                variant="glass"
                            />
                        </div>
                        <div className="transform transition-all duration-500 hover:-translate-y-2">
                            <AboutCard
                                title="Innovation & Quality"
                                description="We continuously innovate to bring you the best beverages, from zero sugar options to new flavors. Our commitment to quality ensures every sip delivers the refreshment you expect from Coca-Cola."
                                variant="glass"
                            />
                        </div>
                        <div className="transform transition-all duration-500 hover:-translate-y-2">
                            <AboutCard
                                title="Sustainability"
                                description="Building a more sustainable future through water stewardship, packaging innovation, and carbon reduction. Together with our partners, we're creating positive environmental impact in communities worldwide."
                                variant="glass"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative bg-black py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            By The Numbers
                        </h2>
                        <div className="h-1 w-24 bg-red-500 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        <div className="text-center group">
                            <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4 transform transition-transform group-hover:scale-110">
                                2.2B
                            </div>
                            <div className="text-white/60 text-base md:text-lg font-medium">Daily Servings</div>
                            <p className="text-white/40 text-sm mt-2">Enjoyed worldwide every day</p>
                        </div>
                        <div className="text-center group">
                            <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4 transform transition-transform group-hover:scale-110">
                                200+
                            </div>
                            <div className="text-white/60 text-base md:text-lg font-medium">Countries</div>
                            <p className="text-white/40 text-sm mt-2">Global presence</p>
                        </div>
                        <div className="text-center group">
                            <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4 transform transition-transform group-hover:scale-110">
                                700K+
                            </div>
                            <div className="text-white/60 text-base md:text-lg font-medium">Employees</div>
                            <p className="text-white/40 text-sm mt-2">Dedicated team members</p>
                        </div>
                        <div className="text-center group">
                            <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-4 transform transition-transform group-hover:scale-110">
                                1886
                            </div>
                            <div className="text-white/60 text-base md:text-lg font-medium">Since</div>
                            <p className="text-white/40 text-sm mt-2">Years of heritage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sustainability Initiatives Section */}
            <section className="relative bg-gradient-to-br from-neutral-950 via-black to-green-950 py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            Sustainability Initiatives
                        </h2>
                        <div className="h-1 w-24 bg-green-500 mx-auto rounded-full" />
                        <p className="text-white/70 text-lg mt-6 max-w-3xl mx-auto">
                            We're committed to making a positive difference in the world through sustainable practices
                        </p>
                    </div>

                    {/* Initiatives Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Water Stewardship */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Droplet className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Water Stewardship</h3>
                            <p className="text-white/70 leading-relaxed">
                                Replenishing 100% of the water we use in our beverages and their production, protecting water sources for communities worldwide.
                            </p>
                        </div>

                        {/* Sustainable Packaging */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Leaf className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Sustainable Packaging</h3>
                            <p className="text-white/70 leading-relaxed">
                                Making 100% of our packaging recyclable globally and using 50% recycled material in our bottles and cans by 2030.
                            </p>
                        </div>

                        {/* Carbon Reduction */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Carbon Reduction</h3>
                            <p className="text-white/70 leading-relaxed">
                                Reducing carbon emissions across our entire value chain, working towards net-zero emissions by 2050.
                            </p>
                        </div>

                        {/* Community Support */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Community Support</h3>
                            <p className="text-white/70 leading-relaxed">
                                Empowering communities through economic opportunities, education programs, and local partnerships worldwide.
                            </p>
                        </div>

                        {/* Global Impact */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Global Impact</h3>
                            <p className="text-white/70 leading-relaxed">
                                Creating positive change in over 200 countries through sustainable business practices and community initiatives.
                            </p>
                        </div>

                        {/* Quality Excellence */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Award className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Quality Excellence</h3>
                            <p className="text-white/70 leading-relaxed">
                                Maintaining the highest standards of quality and safety in every beverage we produce, ensuring consistent excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="relative bg-black py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    {/* Section Title */}
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                            Our Journey
                        </h2>
                        <div className="h-1 w-24 bg-red-500 mx-auto rounded-full" />
                    </div>

                    {/* Timeline */}
                    <div className="max-w-4xl mx-auto space-y-12">
                        {/* Timeline Item 1 */}
                        <div className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                    1886
                                </div>
                                <div className="w-1 h-full bg-gradient-to-b from-red-500 to-transparent mt-4" />
                            </div>
                            <div className="flex-1 pb-12">
                                <h3 className="text-2xl font-bold text-white mb-3">The Beginning</h3>
                                <p className="text-white/70 leading-relaxed">
                                    Dr. John Pemberton creates the original Coca-Cola formula in Atlanta, Georgia. The first glass is served at Jacobs' Pharmacy.
                                </p>
                            </div>
                        </div>

                        {/* Timeline Item 2 */}
                        <div className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                    1915
                                </div>
                                <div className="w-1 h-full bg-gradient-to-b from-red-500 to-transparent mt-4" />
                            </div>
                            <div className="flex-1 pb-12">
                                <h3 className="text-2xl font-bold text-white mb-3">Iconic Bottle</h3>
                                <p className="text-white/70 leading-relaxed">
                                    The distinctive contour bottle is introduced, becoming one of the most recognized packages in the world.
                                </p>
                            </div>
                        </div>

                        {/* Timeline Item 3 */}
                        <div className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                    1982
                                </div>
                                <div className="w-1 h-full bg-gradient-to-b from-red-500 to-transparent mt-4" />
                            </div>
                            <div className="flex-1 pb-12">
                                <h3 className="text-2xl font-bold text-white mb-3">Diet Coca-Cola</h3>
                                <p className="text-white/70 leading-relaxed">
                                    Launch of Diet Coca-Cola, offering consumers a sugar-free alternative with the same great taste.
                                </p>
                            </div>
                        </div>

                        {/* Timeline Item 4 */}
                        <div className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                    2005
                                </div>
                                <div className="w-1 h-full bg-gradient-to-b from-red-500 to-transparent mt-4" />
                            </div>
                            <div className="flex-1 pb-12">
                                <h3 className="text-2xl font-bold text-white mb-3">Coca-Cola Zero</h3>
                                <p className="text-white/70 leading-relaxed">
                                    Introduction of Coca-Cola Zero, providing zero sugar and zero calories while maintaining authentic Coca-Cola taste.
                                </p>
                            </div>
                        </div>

                        {/* Timeline Item 5 */}
                        <div className="flex gap-8 group">
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                                    Today
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white mb-3">Global Leader</h3>
                                <p className="text-white/70 leading-relaxed">
                                    A total beverage company offering over 500 brands in more than 200 countries, committed to sustainability and innovation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative bg-gradient-to-br from-red-950 via-red-900 to-red-950 py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                        Join Our Journey
                    </h2>
                    <p className="text-white/80 text-xl max-w-3xl mx-auto mb-12">
                        Be part of the Coca-Cola story. Explore our products, learn about our initiatives, and discover how we're making a difference.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button className="bg-white text-red-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all transform hover:scale-105 shadow-2xl">
                            Explore Products
                        </button>
                        <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-900 transition-all transform hover:scale-105">
                            Learn More
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
