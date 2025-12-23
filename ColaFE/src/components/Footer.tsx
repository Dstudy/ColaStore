"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Send,
    Heart,
} from "lucide-react";
import Logo from "../../public/logo/logo.png";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const footerLinks = {
        shop: [
            { name: "All Products", href: "/shop" },
            { name: "Beverages", href: "/shop?productType=can" },
            { name: "Merchandise", href: "/shop?productType=goods" },
            { name: "Gift Sets", href: "/shop?productType=gift" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Our Story", href: "/about" },
            { name: "Sustainability", href: "/about" },
            { name: "Careers", href: "/about" },
        ],
        support: [
            { name: "Contact Us", href: "/about" },
            { name: "FAQs", href: "/about" },
            { name: "Shipping Info", href: "/about" },
            { name: "Returns", href: "/about" },
        ],
        legal: [
            { name: "Privacy Policy", href: "/about" },
            { name: "Terms of Service", href: "/about" },
            { name: "Cookie Policy", href: "/about" },
            { name: "Accessibility", href: "/about" },
        ],
    };

    const socialLinks = [
        { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-500" },
        { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
        { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
        { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" },
    ];

    return (
        <footer className="relative bg-gradient-to-br from-black via-neutral-950 to-red-950 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.4),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(220,38,38,0.3),transparent_50%)]" />
            </div>

            <div className="relative z-10">
                {/* Newsletter Section */}
                <div className="border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                                    Stay Refreshed
                                </h3>
                                <p className="text-white/70 text-lg">
                                    Subscribe to get special offers, free giveaways, and exclusive deals.
                                </p>
                            </div>
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 flex items-center justify-center gap-2 group"
                                >
                                    {subscribed ? (
                                        <>
                                            <Heart className="w-5 h-5 fill-current" />
                                            Subscribed!
                                        </>
                                    ) : (
                                        <>
                                            Subscribe
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <Link href="/" className="inline-block mb-6 hover:opacity-80 transition-opacity">
                                <Image
                                    src={Logo.src}
                                    alt="Coca-Cola Logo"
                                    width={180}
                                    height={52}
                                    priority
                                />
                            </Link>
                            <p className="text-white/70 mb-6 leading-relaxed">
                                Refreshing the world, one story at a time. Experience the iconic taste
                                that has brought people together for over a century.
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                                    <Phone className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">1-800-GET-COKE</span>
                                </div>
                                <div className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                                    <Mail className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-sm">support@colastore.com</span>
                                </div>
                                <div className="flex items-start gap-3 text-white/60 hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm">One Coca-Cola Plaza<br />Atlanta, GA 30313</span>
                                </div>
                            </div>
                        </div>

                        {/* Shop Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">Shop</h4>
                            <ul className="space-y-3">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/60 hover:text-red-500 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">Company</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/60 hover:text-red-500 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">Support</h4>
                            <ul className="space-y-3">
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/60 hover:text-red-500 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h4 className="text-lg font-bold mb-4 text-white">Legal</h4>
                            <ul className="space-y-3">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-white/60 hover:text-red-500 transition-colors duration-200 text-sm flex items-center gap-2 group"
                                        >
                                            <span className="w-0 h-0.5 bg-red-500 group-hover:w-4 transition-all duration-300" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Social Media & Payment Methods */}
                    <div className="border-t border-white/10 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            {/* Social Links */}
                            <div className="flex items-center gap-4">
                                <span className="text-white/60 text-sm font-medium">Follow Us:</span>
                                <div className="flex gap-3">
                                    {socialLinks.map((social) => {
                                        const Icon = social.icon;
                                        return (
                                            <a
                                                key={social.label}
                                                href={social.href}
                                                aria-label={social.label}
                                                className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20 hover:border-white/40`}
                                            >
                                                <Icon className="w-5 h-5" />
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="flex items-center gap-4">
                                <span className="text-white/60 text-sm font-medium">We Accept:</span>
                                <div className="flex gap-2">
                                    {["💳", "💵", "🏦", "📱"].map((emoji, index) => (
                                        <div
                                            key={index}
                                            className="w-12 h-8 rounded bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg hover:bg-white/20 transition-all duration-300"
                                        >
                                            {emoji}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
                            <p>
                                © {new Date().getFullYear()} ColaStore. All rights reserved.
                            </p>
                            <p className="flex items-center gap-1">
                                Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by ColaStore Team
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
