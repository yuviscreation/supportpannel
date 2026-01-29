"use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";

export function HelpCenterBanner() {
  return (
    <div className="relative bg-background text-foreground py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#1379F0] to-[#0D4B94] bg-clip-text text-transparent w-full"
        >
          Welcome to the Shipskart Help Center
        </motion.h1>
        
        {/* search input removed per request */}
        
        {/* <p className="mt-4 text-muted-foreground text-sm">
          Search functionality coming soon
        </p> */}
      </div>
    </div>
  );
}
