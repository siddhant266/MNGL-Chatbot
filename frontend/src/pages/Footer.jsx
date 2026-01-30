import { Facebook, Twitter, Linkedin, Youtube, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#0054A6] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">MNGL</span>
                            </div>
                            <span className="font-bold text-lg">Maharashtra Natural Gas</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                            Providing clean, safe, and affordable natural gas to households and industries across Maharashtra since 2006.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#0054A6] transition-colors">
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#0054A6] transition-colors">
                                <Twitter className="h-4 w-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#0054A6] transition-colors">
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#0054A6] transition-colors">
                                <Youtube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    New Connection
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Tariff Plans
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Coverage Area
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Media Center
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Customer Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Pay Bill Online
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Register Complaint
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Track Complaint
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Safety Guidelines
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    FAQs
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Download App
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-white">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-[#0054A6] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-sm">24x7 Helpline</p>
                                    <p className="text-white font-medium">1800-123-4567</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-sm">Emergency</p>
                                    <p className="text-white font-medium">1800-222-4567</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="h-4 w-4 text-[#0054A6] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-white font-medium">support@mngl.in</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-[#0054A6] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-gray-400 text-sm">Head Office</p>
                                    <p className="text-white font-medium text-sm">MNGL House, Baner Road, Pune - 411045</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-400">
                            &copy; 2025 Maharashtra Natural Gas Limited. All Rights Reserved.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Privacy Policy
                            </a>
                            <span className="text-gray-600">|</span>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Terms of Service
                            </a>
                            <span className="text-gray-600">|</span>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                Disclaimer
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
