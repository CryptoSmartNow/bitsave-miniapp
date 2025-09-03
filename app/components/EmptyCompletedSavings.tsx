import { motion } from "framer-motion";

const EmptyCompletedSavings = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm p-8 text-center"
  >
    <div className="mx-auto w-24 h-24 bg-green-100/50 rounded-full flex items-center justify-center mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-12 h-12 text-green-500/70"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No Completed Plans Yet</h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Your completed savings plans will appear here. Keep saving to reach your goals!
    </p>
    <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl border border-gray-200/50 transition-all duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2 text-gray-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 00-1 1v3a1 1 0 002 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
          clipRule="evenodd"
        />
      </svg>
      Keep Saving
    </div>
  </motion.div>
);

export default EmptyCompletedSavings;
