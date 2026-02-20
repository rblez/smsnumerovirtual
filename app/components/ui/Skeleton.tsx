"use client";

import { motion } from "framer-motion";

// Skeleton for text lines
export const SkeletonText = ({ lines = 1, className = "" }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <motion.div
        key={i}
        className="h-4 bg-[#E8E1D4] rounded"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        style={{ width: i === lines - 1 ? "60%" : "100%" }}
      />
    ))}
  </div>
);

// Skeleton for cards
export const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <motion.div
    className={`p-6 bg-white border border-[#E5E5E5] rounded-2xl ${className}`}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-[#E8E1D4] rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-[#E8E1D4] rounded w-3/4" />
        <div className="h-4 bg-[#E8E1D4] rounded w-full" />
        <div className="h-4 bg-[#E8E1D4] rounded w-2/3" />
      </div>
    </div>
  </motion.div>
);

// Skeleton for table rows
export const SkeletonTableRow = ({ columns = 4 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <motion.div
          className="h-4 bg-[#E8E1D4] rounded"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
          style={{ width: i === 0 ? "80%" : i === columns - 1 ? "40%" : "60%" }}
        />
      </td>
    ))}
  </tr>
);

// Skeleton for table
export const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
    <table className="w-full">
      <thead className="bg-[#E8E1D4]/30">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-4">
              <div className="h-4 bg-[#E8E1D4] rounded w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E5E5E5]">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonTableRow key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// Skeleton for stats cards
export const SkeletonStats = ({ count = 4 }: { count?: number }) => (
  <div className={`grid grid-cols-1 ${count === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"} gap-6`}>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-xl p-6 border border-[#E5E5E5]"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 bg-[#E8E1D4] rounded w-24" />
            <div className="h-8 bg-[#E8E1D4] rounded w-16" />
          </div>
          <div className="w-10 h-10 bg-[#E8E1D4] rounded-lg" />
        </div>
      </motion.div>
    ))}
  </div>
);

// Skeleton for pricing cards
export const SkeletonPricing = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <motion.div
        key={i}
        className="bg-white rounded-2xl p-6 border border-[#E5E5E5]"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
      >
        <div className="text-center space-y-4">
          <div className="h-12 bg-[#E8E1D4] rounded w-24 mx-auto" />
          <div className="h-8 bg-[#E8E1D4] rounded w-32 mx-auto" />
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-[#E8E1D4] rounded w-full" />
            <div className="h-4 bg-[#E8E1D4] rounded w-full" />
            <div className="h-4 bg-[#E8E1D4] rounded w-2/3 mx-auto" />
          </div>
          <div className="h-12 bg-[#E8E1D4] rounded-xl w-full mt-4" />
        </div>
      </motion.div>
    ))}
  </div>
);

// Main page skeleton
export const SkeletonPage = () => (
  <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12">
    <div className="max-w-7xl mx-auto space-y-8">
      <SkeletonText lines={2} className="max-w-md" />
      <SkeletonStats count={4} />
      <SkeletonText lines={1} className="max-w-xs" />
      <SkeletonTable rows={5} columns={4} />
    </div>
  </div>
);
