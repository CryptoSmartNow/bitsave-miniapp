import { motion } from "framer-motion";
import Link from "next/link";

const EmptyReadySavings = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-8 text-center"
  >
    <div className="mx-auto w-24 h-24 bg-[#81D7B4]/10 rounded-full flex items-center justify-center mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-12 h-12 text-[#81D7B4]"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-8-6h16" />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No Ready Savings Plans Yet</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Start your savings journey by creating your first savings plan.
    </p>
    <Link
      href="/dashboard/create-savings"
      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/90 text-white font-medium rounded-xl shadow-[0_4px_10px_rgba(129,215,180,0.3)] hover:shadow-[0_6px_15px_rgba(129,215,180,0.4)] transition-all duration-300 transform hover:translate-y-[-2px]"
    >
      Create Your First Plan
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 ml-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  </motion.div>
);

export default EmptyReadySavings;
