import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Logo from './Logo';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
];

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Terms & Conditions', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Admin', href: '/admin' },
];

const popularCategories = [
  { name: 'Cars & Vehicles', href: '/listings?category=vehicles' },
  { name: 'Real Estate', href: '/listings?category=property' },
  { name: 'Mobile Phones', href: '/listings?category=electronics' },
  { name: 'Jobs', href: '/listings?category=jobs' },
];

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(135deg,_#591942_0%,_#764ba2_100%)] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Logo variant="dark" />
            </Link>
            <p className="text-gray-200">Your trusted online marketplace in Nigeria.</p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} className="text-gray-200 hover:text-white">
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-200 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Popular Categories</h4>
            <ul className="space-y-2">
              {popularCategories.map((category) => (
                <li key={category.name}>
                  <Link href={category.href} className="text-gray-200 hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Stay updated</h4>
            <p className="text-gray-200 mb-2">Subscribe to our newsletter for the latest deals.</p>
            {/* Newsletter form can be added here */}
          </div>
        </div>
      </div>
      <div className="bg-black/20 py-4">
        <div className="container mx-auto px-4 text-center text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} Ahia. All rights reserved. | Nigeria | English
        </div>
      </div>
    </footer>
  );
}
