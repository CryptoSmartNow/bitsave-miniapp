"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Space_Grotesk } from "next/font/google";
import { UserInteraction } from "@/lib/interactionTracker";
import {
  AlertTriangle,
  Activity,
  Users,
  Wallet,
  TrendingUp,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ChevronDown,
  Clock,
  BarChart3,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Settings,
  Database,
  Server,
  Globe,
  Unlock,
  Calendar,
  DollarSign,
  Home,
  Wifi,
  Code,
  Layers,
  Wrench,
} from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

// Enhanced Dynamic Error Analysis Component
const ErrorAnalysisCard = ({
  errors,
  onDismiss,
  markErrorAsFixed,
  analyzeError,
}: {
  errors: UserInteraction[];
  onDismiss: () => void;
  markErrorAsFixed: (errorId: string) => void;
  analyzeError: (errorData: UserInteraction) => void;
}) => {
  const [expandedError, setExpandedError] = useState<string | null>(null);

  const errorCategories = errors.reduce(
    (acc, error) => {
      const errorData = error.data as Record<string, unknown>;
      const errorType = (errorData.error as string) || "Unknown Error";
      const category = categorizeError(errorType);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Generate fixing suggestions for each error
  const generateFixingSuggestions = (errorMessage: string) => {
    const suggestions = [];
    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes("gas")) {
      suggestions.push("Increase gas limit or gas price");
      suggestions.push("Check network congestion and retry later");
      suggestions.push("Use gas estimation tools before transaction");
    }

    if (lowerError.includes("insufficient")) {
      suggestions.push("Check wallet balance");
      suggestions.push("Ensure sufficient token allowance");
      suggestions.push("Verify network fees are covered");
    }

    if (lowerError.includes("network") || lowerError.includes("rpc")) {
      suggestions.push("Switch to a different RPC endpoint");
      suggestions.push("Check internet connection");
      suggestions.push("Try again after network stabilizes");
    }

    if (lowerError.includes("contract") || lowerError.includes("revert")) {
      suggestions.push("Verify contract parameters");
      suggestions.push("Check contract state and conditions");
      suggestions.push("Review transaction data and inputs");
    }

    if (lowerError.includes("wallet") || lowerError.includes("metamask")) {
      suggestions.push("Reconnect wallet");
      suggestions.push("Update wallet extension");
      suggestions.push("Clear wallet cache and retry");
    }

    if (suggestions.length === 0) {
      suggestions.push("Review error details and context");
      suggestions.push("Check application logs for more information");
      suggestions.push("Contact support if issue persists");
    }

    return suggestions;
  };

  const recentCriticalErrors = errors
    .filter((e) => {
      const errorData = e.data as Record<string, unknown>;
      return isCriticalError((errorData.error as string) || "");
    })
    .slice(0, 5);

  // Dynamic error insights based on actual error patterns
  const getErrorInsights = () => {
    const insights = [];
    const totalErrors = errors.length;

    // Base savings specific analysis
    const baseSavingsErrors = errors.filter((e) => {
      const errorData = e.data as Record<string, unknown>;
      const context = errorData.context as Record<string, unknown> | undefined;
      return context?.chain === "base" && errorData.action === "create_savings";
    });

    if (baseSavingsErrors.length > 0) {
      insights.push({
        type: "warning",
        title: "Base Savings Issues Detected",
        description: `${baseSavingsErrors.length} errors in Base chain savings creation`,
        recommendations: [
          "Check USDC balance and allowances",
          "Verify gas estimation parameters",
          "Review contract interaction flow",
        ],
      });
    }

    // Gas-related errors
    const gasErrors = errors.filter((e) => {
      const errorData = e.data as Record<string, unknown>;
      return ((errorData.error as string) || "").toLowerCase().includes("gas");
    });

    if (gasErrors.length > totalErrors * 0.3) {
      insights.push({
        type: "critical",
        title: "High Gas Error Rate",
        description: `${Math.round((gasErrors.length / totalErrors) * 100)}% of errors are gas-related`,
        recommendations: [
          "Implement dynamic gas estimation",
          "Add gas price optimization",
          "Provide better user guidance on gas fees",
        ],
      });
    }

    // Network errors
    const networkErrors = errors.filter((e) => {
      const errorData = e.data as Record<string, unknown>;
      return categorizeError((errorData.error as string) || "") === "Network";
    });

    if (networkErrors.length > 0) {
      insights.push({
        type: "info",
        title: "Network Connectivity Issues",
        description: `${networkErrors.length} network-related errors detected`,
        recommendations: [
          "Implement retry mechanisms",
          "Add network status indicators",
          "Provide offline mode capabilities",
        ],
      });
    }

    return insights;
  };

  const insights = getErrorInsights();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Smart Contract":
        return <Shield className="w-5 h-5" />;
      case "Network":
        return <Globe className="w-5 h-5" />;
      case "Wallet":
        return <Wallet className="w-5 h-5" />;
      case "Gas/Fee":
        return <Zap className="w-5 h-5" />;
      case "Validation":
        return <CheckCircle className="w-5 h-5" />;
      case "API/Server":
        return <Server className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  // Show beautiful "No Errors" state when there are no errors
  if (errors.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 backdrop-blur-xl rounded-3xl p-12 border border-green-200 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-green-800 mb-4">🎉 All Clear!</h3>
          <p className="text-lg text-green-700 mb-6">No errors detected in your application</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">System Stable</h4>
              <p className="text-sm text-gray-600">All components running smoothly</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Performance Optimal</h4>
              <p className="text-sm text-gray-600">All metrics within normal range</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Ready to Go</h4>
              <p className="text-sm text-gray-600">System ready for transactions</p>
            </div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center justify-center">
              <Info className="w-5 h-5 mr-2 text-blue-500" />
              💡 Pro Tips for Error Prevention
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>🔍 Monitor gas prices before transactions</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>🌐 Ensure stable network connection</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>💰 Verify sufficient wallet balance</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>🔗 Keep wallet connection active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">🚨 Error Analysis Center</h3>
            <p className="text-sm text-gray-600">Real-time error monitoring & insights</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-red-400 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
            {errors.length} Total
          </span>
          <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
            {recentCriticalErrors.length} Critical
          </span>
          <button
            onClick={onDismiss}
            className="p-2 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-xl transition-all duration-200 hover:scale-105"
            title="Dismiss error analytics"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Enhanced Error Categories Grid */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-red-500" />
          📊 Error Categories Overview
        </h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(errorCategories).map(([category, count], index) => {
            const percentage = Math.round((count / errors.length) * 100);
            const getCategoryEmoji = (category: string) => {
              switch (category) {
                case "Smart Contract":
                  return "📋";
                case "Network":
                  return "🌐";
                case "Wallet":
                  return "👛";
                case "Gas/Fee":
                  return "⛽";
                case "Validation":
                  return "✅";
                case "API/Server":
                  return "🖥️";
                default:
                  return "⚠️";
              }
            };
            const getCategoryGradient = (category: string) => {
              switch (category) {
                case "Smart Contract":
                  return "from-purple-400 to-purple-600";
                case "Network":
                  return "from-blue-400 to-blue-600";
                case "Wallet":
                  return "from-green-400 to-green-600";
                case "Gas/Fee":
                  return "from-yellow-400 to-orange-500";
                case "Validation":
                  return "from-emerald-400 to-emerald-600";
                case "API/Server":
                  return "from-gray-400 to-gray-600";
                default:
                  return "from-red-400 to-red-600";
              }
            };
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden bg-white backdrop-blur-sm rounded-2xl p-5 border border-gray-200 hover:border-red-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-3 bg-gradient-to-br ${getCategoryGradient(category)} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getCategoryIcon(category)}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-800">{count}</span>
                    <div className="text-xs text-gray-500">errors</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getCategoryEmoji(category)}</span>
                  <div className="text-sm font-semibold text-gray-800">{category}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-600">{percentage}% of total</div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      percentage > 50
                        ? "bg-red-100 text-red-700"
                        : percentage > 25
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {percentage > 50 ? "High" : percentage > 25 ? "Medium" : "Low"}
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getCategoryGradient(category)} h-2 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Dynamic Insights */}
      {insights.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            🧠 Smart Analytics & Insights
          </h4>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const getInsightEmoji = (type: string) => {
                switch (type) {
                  case "critical":
                    return "🚨";
                  case "warning":
                    return "⚠️";
                  case "info":
                    return "ℹ️";
                  default:
                    return "💡";
                }
              };
              const getInsightGradient = (type: string) => {
                switch (type) {
                  case "critical":
                    return "from-red-500 to-red-600";
                  case "warning":
                    return "from-yellow-500 to-orange-500";
                  case "info":
                    return "from-blue-500 to-blue-600";
                  default:
                    return "from-gray-500 to-gray-600";
                }
              };
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className={`relative overflow-hidden rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
                    insight.type === "critical"
                      ? "bg-gradient-to-br from-red-50 to-red-100 border-red-300"
                      : insight.type === "warning"
                        ? "bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-300"
                        : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 bg-gradient-to-br ${getInsightGradient(insight.type)} rounded-xl text-white shadow-lg flex-shrink-0`}
                      >
                        <span className="text-xl">{getInsightEmoji(insight.type)}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-800 mb-2 text-lg flex items-center">
                          {insight.title}
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              insight.type === "critical"
                                ? "bg-red-200 text-red-800"
                                : insight.type === "warning"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {insight.type.toUpperCase()}
                          </span>
                        </h5>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          {insight.description}
                        </p>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                          <div className="flex items-center space-x-2 mb-3">
                            <Settings className="w-4 h-4 text-gray-600" />
                            <strong className="text-sm text-gray-800">
                              🎯 Recommended Actions:
                            </strong>
                          </div>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec, i) => {
                              const getRecEmoji = (rec: string) => {
                                if (rec.toLowerCase().includes("gas")) return "⛽";
                                if (rec.toLowerCase().includes("network")) return "🌐";
                                if (rec.toLowerCase().includes("retry")) return "🔄";
                                if (rec.toLowerCase().includes("implement")) return "🔧";
                                if (rec.toLowerCase().includes("check")) return "🔍";
                                return "✅";
                              };
                              return (
                                <li
                                  key={i}
                                  className="flex items-start space-x-3 text-sm text-gray-700"
                                >
                                  <span className="flex-shrink-0 mt-0.5">{getRecEmoji(rec)}</span>
                                  <span className="font-medium">{rec}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Recent Critical Errors */}
      {recentCriticalErrors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              🔥 Recent Critical Errors
            </h4>
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                {recentCriticalErrors.length} Critical
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                Needs Attention
              </span>
            </div>
          </div>
          {recentCriticalErrors.map((error, index) => {
            const errorData = error.data as Record<string, unknown>;
            const isExpanded = expandedError === error.id;
            const suggestions = generateFixingSuggestions(String(errorData.error || ""));

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="text-sm font-semibold text-red-700">
                        {parseErrorMessage(String(errorData.error || "Unknown Error"))}
                      </div>
                    </div>
                    <div className="text-xs text-red-600 mb-2 flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(error.timestamp).toLocaleString()}</span>
                      </span>
                      {(errorData.context as Record<string, unknown>)?.chain ? (
                        <span className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span className="capitalize">
                            {String((errorData.context as Record<string, unknown>).chain)}
                          </span>
                        </span>
                      ) : null}
                    </div>

                    {/* Error Context */}
                    {errorData.context ? (
                      <div className="bg-white rounded-lg p-3 mb-3 border border-red-100">
                        <div className="text-xs font-medium text-red-700 mb-1">Context:</div>
                        <div className="text-xs text-red-600 font-mono">
                          {String(JSON.stringify(errorData.context, null, 2))}
                        </div>
                      </div>
                    ) : null}

                    {/* Fixing Suggestions */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-green-50 rounded-lg p-3 border border-green-200 mt-3"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <Wrench className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">
                            🔧 Suggested Fixes:
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {suggestions.map((suggestion, i) => {
                            const getEmoji = (suggestion: string) => {
                              if (suggestion.toLowerCase().includes("gas")) return "⛽";
                              if (suggestion.toLowerCase().includes("balance")) return "💰";
                              if (suggestion.toLowerCase().includes("network")) return "🌐";
                              if (suggestion.toLowerCase().includes("wallet")) return "👛";
                              if (suggestion.toLowerCase().includes("contract")) return "📋";
                              if (suggestion.toLowerCase().includes("retry")) return "🔄";
                              return "💡";
                            };
                            return (
                              <li
                                key={i}
                                className="text-xs text-green-700 flex items-start space-x-3 bg-green-50 rounded-lg p-2 border border-green-200"
                              >
                                <span className="text-sm flex-shrink-0">
                                  {getEmoji(suggestion)}
                                </span>
                                <span className="font-medium">{suggestion}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => setExpandedError(isExpanded ? null : error.id)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      <Wrench className="w-3 h-3" />
                      <span>{isExpanded ? "Hide" : "Fix"}</span>
                    </button>
                    <button
                      onClick={() => analyzeError(error)}
                      className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      <Search className="w-3 h-3" />
                      <span>Analyze</span>
                    </button>
                    <button
                      onClick={() => markErrorAsFixed(error.id)}
                      className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
                      title="Mark as Fixed"
                    >
                      <CheckCircle className="w-3 h-3" />
                      <span>Fixed</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Chart component for analytics
const SimpleChart = ({
  data,
  title,
}: {
  data: Array<{ label: string; value: number }>;
  title: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-black min-w-[120px]">{item.label}</span>
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex-1 bg-gray-200 rounded-full h-3 mx-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="h-3 rounded-full bg-gradient-to-r from-[#81D7B4] to-blue-500 shadow-lg"
                />
              </div>
              <span className="text-sm font-bold text-gray-800 min-w-[2rem] text-right">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line Chart Component for 7-Day Activity Trend
const BarChart = ({
  data,
  title,
  icon: IconComponent,
}: {
  data: Array<{ label: string; value: number }>;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}) => {
  const maxCount = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg h-full">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-[#81D7B4] to-blue-400 rounded-xl flex items-center justify-center">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="flex items-end justify-between h-48 space-x-2 bg-gray-50 rounded-xl p-4">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: maxCount > 0 ? `${(item.value / maxCount) * 100}%` : "2px" }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-gradient-to-t from-[#81D7B4] to-blue-400 rounded-t-lg min-h-[2px] flex-1 relative group shadow-lg"
          >
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 text-gray-800 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-10">
              <div className="font-semibold">{item.label}</div>
              <div className="text-black">{item.value} events</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-black mt-3 px-4">
        {data.map((item, index) => (
          <span key={index} className="text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// Time-based activity chart
const ActivityChart = ({ interactions }: { interactions: UserInteraction[] }) => {
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const count = interactions.filter((i) => {
      const interactionHour = new Date(i.timestamp).getHours();
      return interactionHour === hour;
    }).length;
    return { hour, count };
  });

  const maxCount = Math.max(...hourlyData.map((d) => d.count));

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">24-Hour Activity Pattern</h3>
      </div>
      <div className="flex items-end justify-between h-40 space-x-1 bg-gray-50 rounded-xl p-4">
        {hourlyData.map((data, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: maxCount > 0 ? `${(data.count / maxCount) * 100}%` : "2px" }}
            transition={{ delay: index * 0.02, duration: 0.6 }}
            className="bg-gradient-to-t from-[#81D7B4] to-blue-400 rounded-t-lg min-h-[2px] flex-1 relative group shadow-lg"
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
              <div className="font-semibold">{data.hour}:00</div>
              <div className="text-black">{data.count} events</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-black mt-3 px-4">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
};

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// Error analysis helper functions
const categorizeError = (errorMessage: string): string => {
  const message = errorMessage.toLowerCase();
  if (message.includes("revert") || message.includes("transaction")) return "Smart Contract";
  if (message.includes("network") || message.includes("connection")) return "Network";
  if (message.includes("wallet") || message.includes("metamask")) return "Wallet";
  if (message.includes("gas") || message.includes("fee")) return "Gas/Fee";
  if (message.includes("validation") || message.includes("invalid")) return "Validation";
  if (message.includes("api") || message.includes("server")) return "API/Server";
  return "Other";
};

const isCriticalError = (errorMessage: string): boolean => {
  const criticalKeywords = ["revert", "failed", "rejected", "insufficient", "invalid", "timeout"];
  return criticalKeywords.some((keyword) => errorMessage.toLowerCase().includes(keyword));
};

const parseErrorMessage = (errorMessage: string): string => {
  // Extract meaningful error message from complex error strings
  if (errorMessage.includes("revert")) {
    const revertMatch = errorMessage.match(/revert\s+(.+?)(?:\s*\(|$)/);
    if (revertMatch) return `Contract Revert: ${revertMatch[1]}`;
  }

  if (errorMessage.includes("estimateGas")) {
    return "Transaction Simulation Failed - Likely to Revert";
  }

  if (errorMessage.includes("insufficient funds")) {
    return "Insufficient Funds for Transaction";
  }

  if (errorMessage.includes("user rejected")) {
    return "User Rejected Transaction";
  }

  // Truncate very long error messages
  return errorMessage.length > 100 ? errorMessage.substring(0, 100) + "..." : errorMessage;
};

const getErrorRecommendations = (error: string) => {
  if (error?.includes("estimateGas")) {
    return [
      "Check wallet balance for sufficient funds",
      "Ensure network connection is stable",
      "Verify contract parameters are correct",
      "Try increasing gas limit manually",
    ];
  }
  if (error?.includes("user rejected")) {
    return [
      "User cancelled the transaction",
      "No action required from system side",
      "Consider improving UX flow",
    ];
  }
  return [
    "Review error logs for more details",
    "Check network connectivity",
    "Verify user permissions",
  ];
};

export default function UserInteractionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [interactions, setInteractions] = useState<UserInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"timestamp" | "type">("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedErrorCategory, setSelectedErrorCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [fixedErrors, setFixedErrors] = useState<Set<string>>(new Set());
  const [showErrorAnalysis, setShowErrorAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState<Record<string, unknown> | null>(null);
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "disconnected" | "error">(
    "checking",
  );
  const [dbLatency, setDbLatency] = useState<number | null>(null);

  // Session management functions
  const checkSession = () => {
    if (typeof window !== "undefined") {
      const sessionData = localStorage.getItem("adminSession");
      if (sessionData) {
        const { timestamp, authenticated } = JSON.parse(sessionData);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (authenticated && now - timestamp < twentyFourHours) {
          return true;
        } else {
          // Session expired, clear it
          localStorage.removeItem("adminSession");
        }
      }
    }
    return false;
  };

  const setSession = () => {
    if (typeof window !== "undefined") {
      const sessionData = {
        authenticated: true,
        timestamp: Date.now(),
      };
      localStorage.setItem("adminSession", JSON.stringify(sessionData));
    }
  };

  const clearSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminSession");
    }
  };

  // Check for existing session on component mount
  useEffect(() => {
    if (checkSession()) {
      setIsAuthenticated(true);
      fetchInteractions();
    }
  }, []);

  // Check database connection status
  const checkDatabaseStatus = async () => {
    try {
      const startTime = Date.now();
      const response = await fetch("/api/user-interactions?health=true", {
        method: "HEAD",
        cache: "no-cache",
      });
      const endTime = Date.now();

      if (response.ok) {
        setDbStatus("connected");
        setDbLatency(endTime - startTime);
      } else {
        setDbStatus("error");
        setDbLatency(null);
      }
    } catch {
      setDbStatus("disconnected");
      setDbLatency(null);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
    const interval = setInterval(checkDatabaseStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setSession(); // Save session to localStorage
      setError("");
      fetchInteractions();
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    clearSession(); // Clear session from localStorage
    setPassword("");
  };

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user-interactions?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();

        // Handle both array and object responses
        const interactions = Array.isArray(data) ? data : data.interactions || [];
        setInteractions(interactions);

        // Check for database warning
        if (data.warning) {
          setError(`Warning: ${data.warning}`);
        } else {
          setError(null);
        }

        // Check for database warning header
        const warning = response.headers.get("X-Warning");
        if (warning) {
          setError(`Warning: ${warning}. Showing cached data.`);
        }
      } else {
        setError("Failed to fetch interactions. Please try again later.");
        setInteractions([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Database connection issue. Please check your connection and try again.");
      setInteractions([]);
    } finally {
      setLoading(false);
    }
  };

  const allFilteredInteractions = interactions
    .filter((interaction) => {
      if (filter === "all") return true;
      return interaction.type === filter;
    })
    .filter((interaction) => {
      if (!searchTerm) return true;

      // Special handling for missing transaction hash filter
      if (searchTerm === "null" && filter === "savings_created") {
        return !(interaction.data as Record<string, unknown>)?.txHash;
      }

      return (
        interaction.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(interaction.data).toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = sortBy === "timestamp" ? new Date(a.timestamp).getTime() : a.type;
      const bValue = sortBy === "timestamp" ? new Date(b.timestamp).getTime() : b.type;

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(allFilteredInteractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredInteractions = allFilteredInteractions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Update pagination when filter or search changes
  useEffect(() => {
    resetPagination();
  }, [filter, searchTerm, sortBy, sortOrder]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "wallet_connect":
        return <Wallet className="w-5 h-5" />;
      case "wallet_disconnect":
        return <Unlock className="w-5 h-5" />;
      case "savings_created":
        return <DollarSign className="w-5 h-5" />;
      case "page_visit":
        return <Eye className="w-5 h-5" />;
      case "transaction":
        return <TrendingUp className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "wallet_connect":
        return "bg-green-100 text-green-800 border-green-200";
      case "wallet_disconnect":
        return "bg-red-100 text-red-800 border-red-200";
      case "savings_created":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "page_visit":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "transaction":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Enhanced statistics with trends and insights
  const calculateTrend = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? "+" : "";
    return `${sign}${Math.round(change)}%`;
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisWeekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  const todayInteractions = interactions.filter((i) => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= today;
  });

  const yesterdayInteractions = interactions.filter((i) => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= yesterday && interactionDate < today;
  });

  const thisWeekInteractions = interactions.filter((i) => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= thisWeekStart && interactionDate < today;
  });
  const lastWeekInteractions = interactions.filter((i) => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= lastWeekStart && interactionDate < thisWeekStart;
  });

  // Error-specific analytics
  const errorInteractions = interactions.filter(
    (i) => i.type === "error" && !fixedErrors.has(i.id),
  );

  const analyzeError = (errorData: Record<string, unknown>) => {
    const analysis = {
      error: errorData.error,
      category: categorizeError((errorData.error as string) || ""),
      severity: isCriticalError((errorData.error as string) || "") ? "Critical" : "Warning",
      context: errorData.context,
      stack: errorData.stack,
      recommendations: getErrorRecommendations((errorData.error as string) || ""),
      affectedUsers: 1,
      frequency: errorInteractions.filter(
        (e: UserInteraction) => (e.data as Record<string, unknown>)?.error === errorData.error,
      ).length,
      timestamp: new Date().toISOString(),
    };

    setAnalysisData(analysis);
    setShowErrorAnalysis(true);
  };

  const markErrorAsFixed = (errorId: string) => {
    setFixedErrors((prev) => new Set([...prev, errorId]));
  };

  const unmarkErrorAsFixed = (errorId: string) => {
    setFixedErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(errorId);
      return newSet;
    });
  };
  const todayErrors = errorInteractions.filter((i) => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= today;
  });
  const yesterdayErrors = errorInteractions.filter((i) => {
    const interactionDate = new Date(i.timestamp);
    return interactionDate >= yesterday && interactionDate < today;
  });
  const criticalErrors = errorInteractions.filter((e) => {
    const errorData = e.data as Record<string, unknown>;
    return isCriticalError((errorData.error as string) || "");
  });

  // Enhanced error rate calculation
  const totalTransactions = interactions.filter(
    (i) => i.type === "transaction" || i.type === "savings_created",
  ).length;
  const errorRate =
    totalTransactions > 0 ? ((errorInteractions.length / totalTransactions) * 100).toFixed(1) : "0";

  // Transaction hash completion tracking
  const savingsCreatedInteractions = interactions.filter((i) => i.type === "savings_created");
  const savingsWithTxHash = savingsCreatedInteractions.filter(
    (i) => (i.data as Record<string, unknown>)?.txHash,
  );
  const savingsWithoutTxHash = savingsCreatedInteractions.filter(
    (i) => !(i.data as Record<string, unknown>)?.txHash,
  );
  const txHashCompletionRate =
    savingsCreatedInteractions.length > 0
      ? ((savingsWithTxHash.length / savingsCreatedInteractions.length) * 100).toFixed(1)
      : "0";

  // Base chain specific tracking
  const baseSavingsAttempts = savingsCreatedInteractions.filter(
    (i) => (i.data as Record<string, unknown>)?.chain === "base",
  );
  const baseSavingsSuccess = baseSavingsAttempts.filter(
    (i) => (i.data as Record<string, unknown>)?.txHash,
  );
  const baseSuccessRate =
    baseSavingsAttempts.length > 0
      ? ((baseSavingsSuccess.length / baseSavingsAttempts.length) * 100).toFixed(1)
      : "0";

  const stats = {
    total: interactions.length,
    walletConnects: interactions.filter((i) => i.type === "wallet_connect").length,
    savingsCreated: interactions.filter((i) => i.type === "savings_created").length,
    transactions: interactions.filter((i) => i.type === "transaction").length,
    uniqueWallets: new Set(interactions.filter((i) => i.walletAddress).map((i) => i.walletAddress))
      .size,
    pageVisits: interactions.filter((i) => i.type === "page_visit").length,
    errors: errorInteractions.length,
    todayInteractions: todayInteractions.length,
    thisWeekInteractions: thisWeekInteractions.length,
    // Previous period data for trend calculation
    yesterdayInteractions: yesterdayInteractions.length,
    lastWeekInteractions: lastWeekInteractions.length,
    previousWalletConnects: lastWeekInteractions.filter((i) => i.type === "wallet_connect").length,
    previousSavingsCreated: lastWeekInteractions.filter((i) => i.type === "savings_created").length,
    previousUniqueWallets: new Set(
      lastWeekInteractions.filter((i) => i.walletAddress).map((i) => i.walletAddress),
    ).size,
    // Enhanced error metrics
    errorMetrics: {
      total: errorInteractions.length,
      today: todayErrors.length,
      yesterday: yesterdayErrors.length,
      critical: criticalErrors.length,
      rate: errorRate,
    },
    // Transaction hash completion tracking
    transactionMetrics: {
      totalSavingsCreated: savingsCreatedInteractions.length,
      withTxHash: savingsWithTxHash.length,
      withoutTxHash: savingsWithoutTxHash.length,
      completionRate: txHashCompletionRate,
      baseSavingsAttempts: baseSavingsAttempts.length,
      baseSavingsSuccess: baseSavingsSuccess.length,
      baseSuccessRate: baseSuccessRate,
    },
    // Base savings specific error tracking (excluding fixed errors)
    baseSavingsErrors: errorInteractions.filter((e) => {
      const errorData = e.data as Record<string, unknown>;
      const context = errorData.context as Record<string, unknown> | undefined;
      return (
        context?.planName === "house rent" ||
        context?.chain === "base" ||
        (errorData.error && (errorData.error as string).includes("estimateGas"))
      );
    }).length,
  };

  // Data for charts
  const typeDistribution = [
    { label: "Wallet Connects", value: stats.walletConnects },
    { label: "Savings Created", value: stats.savingsCreated },
    { label: "Transactions", value: stats.transactions },
    { label: "Page Visits", value: stats.pageVisits },
    { label: "Errors", value: stats.errors },
  ].filter((item) => item.value > 0);

  const dailyActivity = (() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysFromSunday = currentDay; // Days since last Sunday

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - daysFromSunday + i); // Start from last Sunday
      const dayInteractions = interactions.filter((interaction) => {
        const interactionDate = new Date(interaction.timestamp);
        return interactionDate.toDateString() === date.toDateString();
      }).length;
      return {
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        value: dayInteractions,
      };
    });
  })();

  const monthlyActivity = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2025, i, 1); // Start from January 2025
    const monthInteractions = interactions.filter((interaction) => {
      const interactionDate = new Date(interaction.timestamp);
      return (
        interactionDate.getMonth() === date.getMonth() &&
        interactionDate.getFullYear() === date.getFullYear()
      );
    }).length;
    return {
      label: `${date.toLocaleDateString("en-US", { month: "short" })} '25`,
      value: monthInteractions,
    };
  });

  if (!isAuthenticated) {
    return (
      <div
        className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4`}
      >
        <div className="absolute inset-0 bg-[url('/noise.jpg')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#81D7B4] to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Access</h1>
            <p className="text-black">Enter password to view user interactions</p>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-[#81D7B4] to-blue-400 text-white font-semibold rounded-xl hover:from-[#6bc4a1] hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Access Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`${spaceGrotesk.className} min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50`}
    >
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#81D7B4] to-blue-500 bg-clip-text text-transparent">
                  Admin Control Center
                </h1>
                <div className="text-black font-medium flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Real-time system monitoring • BitSave Platform</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-[#81D7B4] to-blue-500 text-white rounded-xl hover:from-[#6BC49A] hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          {[
            {
              label: "Total Events",
              value: stats.total,
              icon: BarChart3,
              color: "from-[#81D7B4] to-blue-500",
              trend: calculateTrend(stats.thisWeekInteractions, stats.lastWeekInteractions),
            },
            {
              label: "Today",
              value: stats.todayInteractions,
              icon: Calendar,
              color: "from-[#81D7B4] to-blue-500",
              trend: calculateTrend(stats.todayInteractions, stats.yesterdayInteractions),
            },
            {
              label: "Wallet Connects",
              value: stats.walletConnects,
              icon: Wallet,
              color: "from-[#81D7B4] to-blue-500",
              trend: calculateTrend(
                thisWeekInteractions.filter((i) => i.type === "wallet_connect").length,
                stats.previousWalletConnects,
              ),
            },
            {
              label: "Savings Created",
              value: stats.savingsCreated,
              icon: DollarSign,
              color: "from-[#81D7B4] to-blue-500",
              trend: calculateTrend(
                thisWeekInteractions.filter((i) => i.type === "savings_created").length,
                stats.previousSavingsCreated,
              ),
            },
            {
              label: "Unique Wallets",
              value: stats.uniqueWallets,
              icon: Users,
              color: "from-[#81D7B4] to-blue-500",
              trend: calculateTrend(
                new Set(
                  thisWeekInteractions.filter((i) => i.walletAddress).map((i) => i.walletAddress),
                ).size,
                stats.previousUniqueWallets,
              ),
            },
            {
              label: "Errors",
              value: stats.errorMetrics.total,
              icon: AlertTriangle,
              color: "from-[#81D7B4] to-blue-500",
              trend: calculateTrend(stats.errorMetrics.today, stats.errorMetrics.yesterday),
              subtitle: `${stats.errorMetrics.rate}% error rate`,
            },
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group hover:border-blue-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.trend.includes("+")
                        ? "text-green-700 bg-green-100 border border-green-200"
                        : stat.trend.includes("-")
                          ? "text-red-700 bg-red-100 border border-red-200"
                          : "text-black bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {stat.trend}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-black">{stat.label}</div>
                {stat.subtitle && <div className="text-xs text-black mt-1">{stat.subtitle}</div>}
              </motion.div>
            );
          })}
        </div>

        {/* Error Analysis Section */}
        {errorInteractions.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-800">Active Errors Detected</h3>
                      <p className="text-red-600">
                        {errorInteractions.length} errors require attention
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowErrorAnalysis(!showErrorAnalysis)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{showErrorAnalysis ? "Hide" : "Show"} Error Analysis</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${showErrorAnalysis ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Collapsible Error Analysis Content */}
              <AnimatePresence>
                {showErrorAnalysis && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-red-200 bg-white"
                  >
                    <div className="p-6 space-y-6">
                      {/* Error Category Filter */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Filter by Category
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                              value={selectedErrorCategory}
                              onChange={(e) => setSelectedErrorCategory(e.target.value)}
                              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            >
                              <option value="all">All Categories</option>
                              <option value="network">Network Errors</option>
                              <option value="gas">Gas Estimation</option>
                              <option value="contract">Smart Contract</option>
                              <option value="wallet">Wallet Connection</option>
                              <option value="validation">Validation</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Comprehensive Error Analysis */}
                      <ErrorAnalysisCard
                        errors={errorInteractions.filter((error) => {
                          if (selectedErrorCategory === "all") return true;
                          const errorData = error.data as Record<string, unknown>;
                          const errorMessage = ((errorData.error as string) || "").toLowerCase();
                          switch (selectedErrorCategory) {
                            case "network":
                              return (
                                errorMessage.includes("network") ||
                                errorMessage.includes("rpc") ||
                                errorMessage.includes("connection")
                              );
                            case "gas":
                              return (
                                errorMessage.includes("gas") || errorMessage.includes("estimation")
                              );
                            case "contract":
                              return (
                                errorMessage.includes("contract") ||
                                errorMessage.includes("revert") ||
                                errorMessage.includes("execution")
                              );
                            case "wallet":
                              return (
                                errorMessage.includes("wallet") ||
                                errorMessage.includes("metamask") ||
                                errorMessage.includes("coinbase")
                              );
                            case "validation":
                              return (
                                errorMessage.includes("validation") ||
                                errorMessage.includes("invalid") ||
                                errorMessage.includes("required")
                              );
                            default:
                              return true;
                          }
                        })}
                        onDismiss={() => {}}
                        markErrorAsFixed={markErrorAsFixed}
                        analyzeError={(errorData: UserInteraction) =>
                          analyzeError(errorData.data as Record<string, unknown>)
                        }
                      />

                      {/* Base Savings Specific Analysis */}
                      {stats.baseSavingsErrors > 0 && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-center space-x-4 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                              <Home className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-blue-800">
                                Base Savings Error Analysis
                              </h4>
                              <p className="text-blue-600">
                                {stats.baseSavingsErrors} Base chain related errors detected
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Common Issues */}
                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                              <div className="flex items-center space-x-2 mb-3">
                                <Search className="w-4 h-4 text-orange-600" />
                                <h5 className="font-semibold text-orange-700">Common Issues</h5>
                              </div>
                              <div className="space-y-2">
                                {[
                                  {
                                    icon: Zap,
                                    title: "Gas Estimation Failed",
                                    color: "text-yellow-500",
                                  },
                                  {
                                    icon: Wifi,
                                    title: "Base Network Issues",
                                    color: "text-blue-500",
                                  },
                                  {
                                    icon: Code,
                                    title: "Smart Contract Errors",
                                    color: "text-purple-500",
                                  },
                                  {
                                    icon: Wallet,
                                    title: "Wallet Connection",
                                    color: "text-green-500",
                                  },
                                ].map((issue, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <issue.icon className={`w-4 h-4 ${issue.color}`} />
                                    <span className="text-gray-700">{issue.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recommended Solutions */}
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center space-x-2 mb-3">
                                <Settings className="w-4 h-4 text-green-600" />
                                <h5 className="font-semibold text-green-700">
                                  Recommended Solutions
                                </h5>
                              </div>
                              <div className="space-y-2">
                                {[
                                  {
                                    icon: CheckCircle,
                                    title: "Check Base RPC Status",
                                    color: "text-green-500",
                                  },
                                  {
                                    icon: RefreshCw,
                                    title: "Implement Retry Logic",
                                    color: "text-blue-500",
                                  },
                                  {
                                    icon: Shield,
                                    title: "Better Error Handling",
                                    color: "text-purple-500",
                                  },
                                  {
                                    icon: TrendingUp,
                                    title: "Balance Validation",
                                    color: "text-yellow-500",
                                  },
                                ].map((solution, index) => (
                                  <div key={index} className="flex items-center space-x-2 text-sm">
                                    <solution.icon className={`w-4 h-4 ${solution.color}`} />
                                    <span className="text-gray-700">{solution.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Detailed Error Analysis */}
                      {analysisData && (
                        <div className="bg-white rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                              <AlertCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                Detailed Error Analysis
                              </h4>
                              <p className="text-gray-600">In-depth analysis of selected error</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <h5 className="font-semibold text-red-800">Severity</h5>
                              </div>
                              <p
                                className={`text-lg font-bold ${
                                  String(analysisData.severity) === "Critical"
                                    ? "text-red-600"
                                    : "text-orange-600"
                                }`}
                              >
                                {String(analysisData.severity)}
                              </p>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                <h5 className="font-semibold text-blue-800">Frequency</h5>
                              </div>
                              <p className="text-lg font-bold text-blue-600">
                                {String(analysisData.frequency)} times
                              </p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <Users className="w-4 h-4 text-purple-600" />
                                <h5 className="font-semibold text-purple-800">Category</h5>
                              </div>
                              <p className="text-lg font-bold text-purple-600">
                                {String(analysisData.category)}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2">Error Message:</h5>
                            <code className="text-sm text-red-600 font-mono break-all">
                              {String(analysisData.error)}
                            </code>
                          </div>

                          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center space-x-2 mb-3">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <h5 className="font-semibold text-green-800">Recommended Actions</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {((analysisData.recommendations as string[]) || []).map(
                                (rec: string, index: number) => (
                                  <div key={index} className="flex items-start space-x-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span className="text-green-700">{rec}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Fixed Errors Section */}
        {fixedErrors.size > 0 && (
          <div className="mb-8">
            <div className="bg-white backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-[#81D7B4] to-blue-500 rounded-2xl shadow-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Fixed Errors</h3>
                    <p className="text-sm text-black">Errors marked as resolved</p>
                  </div>
                </div>
                <span className="bg-gradient-to-r from-[#81D7B4] to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                  {fixedErrors.size} Fixed
                </span>
              </div>
              <div className="space-y-3">
                {Array.from(fixedErrors).map((errorId) => {
                  const error = interactions.find((i) => i.id === errorId);
                  if (!error) return null;
                  const errorData = error.data as Record<string, unknown>;
                  return (
                    <div
                      key={errorId}
                      className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-green-700">
                            {parseErrorMessage((errorData.error as string) || "Unknown Error")}
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Fixed: {new Date(error.timestamp).toLocaleString()}
                          </div>
                          {errorData.context ? (
                            <div className="text-xs text-green-500 mt-2">
                              Context: {String(JSON.stringify(errorData.context))}
                            </div>
                          ) : null}
                        </div>
                        <button
                          onClick={() => unmarkErrorAsFixed(errorId)}
                          className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded text-xs font-medium transition-colors border border-orange-300 flex items-center space-x-1"
                          title="Mark as Unfixed"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Unfixed</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <ActivityChart interactions={interactions} />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <SimpleChart data={typeDistribution} title="Interaction Types Distribution" />
          </div>
        </div>

        {/* Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <BarChart data={dailyActivity} title="7-Day Activity Trend" icon={Clock} />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <BarChart data={monthlyActivity} title="12-Month Activity Overview" icon={Calendar} />
          </div>
        </div>

        {/* Enhanced Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filter & Search</h2>
            <div className="flex items-center space-x-2 text-sm text-black">
              <span>
                Showing {filteredInteractions.length} of {allFilteredInteractions.length}{" "}
                interactions (Page {currentPage} of {totalPages})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-black" />
                <label className="block text-sm font-semibold text-black">Filter by Type</label>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md text-black"
              >
                <option value="all">All Types</option>
                <option value="wallet_connect">Wallet Connect</option>
                <option value="wallet_disconnect">Wallet Disconnect</option>
                <option value="savings_created">Savings Created</option>
                <option value="page_visit">Page Visit</option>
                <option value="transaction">Transaction</option>
                <option value="error">Error</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-black" />
                <label className="block text-sm font-semibold text-black">Search</label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search wallet, type, or data..."
                  className="w-full px-4 py-3 pl-10 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md text-black placeholder-gray-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <ChevronDown className="w-4 h-4 text-black" />
                <label className="block text-sm font-semibold text-black">Sort By</label>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "timestamp" | "type")}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md text-black"
              >
                <option value="timestamp">Timestamp</option>
                <option value="type">Type</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-black">🔄 Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#81D7B4] focus:border-transparent transition-all duration-200 font-medium shadow-sm hover:shadow-md text-black"
              >
                <option value="desc">⬇️ Newest First</option>
                <option value="asc">⬆️ Oldest First</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <span className="text-sm font-semibold text-black">Quick Filters:</span>
            {[
              { label: "Today", action: () => setSearchTerm(new Date().toDateString()) },
              { label: "Errors Only", action: () => setFilter("error") },
              {
                label: "Missing Tx Hash",
                action: () => {
                  setFilter("savings_created");
                  setSearchTerm("null");
                },
              },
              { label: "Wallet Activity", action: () => setFilter("wallet_connect") },
              {
                label: "Clear All",
                action: () => {
                  setFilter("all");
                  setSearchTerm("");
                },
              },
            ].map((quickFilter, index) => (
              <button
                key={index}
                onClick={quickFilter.action}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-black rounded-xl hover:from-[#81D7B4] hover:to-blue-400 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              >
                {quickFilter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Interactions List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/30 bg-gradient-to-r from-[#81D7B4]/5 to-blue-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#81D7B4] to-blue-500 bg-clip-text text-transparent">
                    Recent Interactions
                  </h2>
                  <div className="text-black mt-1 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live activity feed • {filteredInteractions.length} events</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-200">
                  <Zap className="w-3 h-3" />
                  <span>Real-time</span>
                </div>
                <button
                  onClick={fetchInteractions}
                  className="px-4 py-2 bg-gradient-to-r from-[#81D7B4] to-blue-500 text-white rounded-xl hover:from-[#6bc4a1] hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#81D7B4] border-t-transparent mb-4"></div>
              <p className="text-black font-medium">Loading interactions...</p>
            </div>
          ) : (
            <div className="max-h-[800px] overflow-y-auto">
              <AnimatePresence>
                {filteredInteractions.map((interaction, index) => (
                  <motion.div
                    key={interaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="p-6 border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-[#81D7B4]/5 hover:to-blue-50/30 transition-all duration-300 group relative"
                  >
                    {/* Status indicator line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#81D7B4] to-blue-500 rounded-r-full"></div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                          {getTypeIcon(interaction.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${getTypeColor(interaction.type)} shadow-sm bg-white/80 backdrop-blur-sm`}
                            >
                              {interaction.type.replace("_", " ").toUpperCase()}
                            </span>
                            <div className="flex items-center space-x-2 text-sm text-black bg-gray-50/80 px-3 py-1.5 rounded-lg">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">
                                {new Date(interaction.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getTypeColor(interaction.type).includes("green") ? "bg-green-500" : getTypeColor(interaction.type).includes("red") ? "bg-red-500" : "bg-blue-500"} animate-pulse`}
                            ></div>
                            <span className="text-xs text-black font-medium">
                              #{interaction.id.slice(-6)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                          {interaction.walletAddress && (
                            <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-100/50 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-lg flex items-center justify-center">
                                  <Wallet className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-black">
                                  Wallet Address
                                </span>
                              </div>
                              <code className="text-xs font-mono bg-white/80 px-3 py-2 rounded-lg border border-blue-200/30 block truncate shadow-sm text-black">
                                {interaction.walletAddress}
                              </code>
                            </div>
                          )}

                          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-xl p-4 border border-purple-100/50 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-lg flex items-center justify-center">
                                <Database className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-semibold text-black">Session ID</span>
                            </div>
                            <code className="text-xs font-mono bg-white/80 px-3 py-2 rounded-lg border border-purple-200/30 block truncate shadow-sm text-black">
                              {interaction.sessionId}
                            </code>
                          </div>

                          {interaction.ip && (
                            <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 rounded-xl p-4 border border-green-100/50 hover:shadow-md transition-all duration-200">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-lg flex items-center justify-center">
                                  <Globe className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-black">IP Address</span>
                              </div>
                              <code className="text-xs font-mono bg-white/80 px-3 py-2 rounded-lg border border-green-200/30 block shadow-sm text-black">
                                {interaction.ip}
                              </code>
                            </div>
                          )}
                        </div>

                        {interaction.type === "error" && (
                          <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-medium text-red-800 flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Error Details</span>
                              </div>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isCriticalError(
                                    ((interaction.data as Record<string, unknown>)
                                      ?.error as string) || "",
                                  )
                                    ? "bg-red-200 text-red-800"
                                    : "bg-yellow-200 text-yellow-800"
                                }`}
                              >
                                {isCriticalError(
                                  ((interaction.data as Record<string, unknown>)
                                    ?.error as string) || "",
                                )
                                  ? "CRITICAL"
                                  : "WARNING"}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm text-red-700">
                                <strong>Message:</strong>{" "}
                                {parseErrorMessage(
                                  ((interaction.data as Record<string, unknown>)
                                    ?.error as string) || "Unknown error",
                                )}
                              </div>

                              {(interaction.data as Record<string, unknown>)?.context ? (
                                <div className="text-xs text-red-600">
                                  <strong>Context:</strong>
                                  {(
                                    (interaction.data as Record<string, unknown>).context as Record<
                                      string,
                                      unknown
                                    >
                                  ).planName ? (
                                    <span className="ml-1 px-2 py-1 bg-red-100 rounded">
                                      Plan:{" "}
                                      {String(
                                        (
                                          (interaction.data as Record<string, unknown>)
                                            .context as Record<string, unknown>
                                        ).planName,
                                      )}
                                    </span>
                                  ) : null}
                                  {(
                                    (interaction.data as Record<string, unknown>).context as Record<
                                      string,
                                      unknown
                                    >
                                  ).chain ? (
                                    <span className="ml-1 px-2 py-1 bg-red-100 rounded">
                                      Chain:{" "}
                                      {String(
                                        (
                                          (interaction.data as Record<string, unknown>)
                                            .context as Record<string, unknown>
                                        ).chain,
                                      )}
                                    </span>
                                  ) : null}
                                  {(
                                    (interaction.data as Record<string, unknown>).context as Record<
                                      string,
                                      unknown
                                    >
                                  ).amount ? (
                                    <span className="ml-1 px-2 py-1 bg-red-100 rounded">
                                      Amount:{" "}
                                      {String(
                                        (
                                          (interaction.data as Record<string, unknown>)
                                            .context as Record<string, unknown>
                                        ).amount,
                                      )}
                                    </span>
                                  ) : null}
                                </div>
                              ) : null}

                              {/* Base Savings Specific Error Help */}
                              {((
                                (interaction.data as Record<string, unknown>)?.context as
                                  | Record<string, unknown>
                                  | undefined
                              )?.planName === "house rent" ||
                                (
                                  (interaction.data as Record<string, unknown>)?.context as
                                    | Record<string, unknown>
                                    | undefined
                                )?.chain === "base" ||
                                (((interaction.data as Record<string, unknown>)?.error as string) &&
                                  (
                                    (interaction.data as Record<string, unknown>).error as string
                                  ).includes("estimateGas"))) && (
                                <div className="mt-2 p-2 bg-orange-100 border border-orange-200 rounded text-xs">
                                  <div className="font-medium text-orange-800 mb-1 flex items-center space-x-2">
                                    <Info className="w-4 h-4" />
                                    <span>Base Savings Issue Detected</span>
                                  </div>
                                  <div className="text-orange-700">
                                    This appears to be related to Base network savings. Common
                                    fixes:
                                    <ul className="mt-1 ml-4 list-disc">
                                      <li>Ensure wallet is connected to Base network</li>
                                      <li>Check ETH balance for gas fees</li>
                                      <li>Try refreshing and retrying the transaction</li>
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Transaction Hash Display for Savings Plans */}
                        {(interaction.type === "savings_created" ||
                          interaction.type === "transaction") && (
                          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-sm font-medium text-green-800 flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4" />
                                <span>Transaction Details</span>
                              </div>
                              <div className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                                {(interaction.data as Record<string, unknown>)?.txHash
                                  ? "CONFIRMED"
                                  : "PENDING"}
                              </div>
                            </div>

                            {(interaction.data as Record<string, unknown>)?.txHash ? (
                              <div className="space-y-2">
                                <div className="text-sm text-green-700">
                                  <strong>Transaction Hash:</strong>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-green-200">
                                  <code className="text-xs font-mono text-green-800 break-all">
                                    {String((interaction.data as Record<string, unknown>).txHash)}
                                  </code>
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(
                                        (interaction.data as Record<string, unknown>)
                                          .txHash as string,
                                      )
                                    }
                                    className="ml-2 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-xs transition-colors"
                                  >
                                    Copy
                                  </button>
                                </div>

                                {/* Savings Plan Details */}
                                {interaction.type === "savings_created" ? (
                                  <div className="grid grid-cols-2 gap-3 mt-3">
                                    {(interaction.data as Record<string, unknown>)?.planName ? (
                                      <div className="text-xs">
                                        <span className="font-medium text-green-800">Plan:</span>
                                        <span className="ml-1 text-green-700">
                                          {String(
                                            (interaction.data as Record<string, unknown>).planName,
                                          )}
                                        </span>
                                      </div>
                                    ) : null}
                                    {(interaction.data as Record<string, unknown>)?.amount ? (
                                      <div className="text-xs">
                                        <span className="font-medium text-green-800">Amount:</span>
                                        <span className="ml-1 text-green-700">
                                          {String(
                                            (interaction.data as Record<string, unknown>).amount,
                                          )}{" "}
                                          {String(
                                            (interaction.data as Record<string, unknown>)
                                              ?.currency || "USDC",
                                          )}
                                        </span>
                                      </div>
                                    ) : null}
                                    {(interaction.data as Record<string, unknown>)?.chain ? (
                                      <div className="text-xs">
                                        <span className="font-medium text-green-800">Chain:</span>
                                        <span className="ml-1 text-green-700 capitalize">
                                          {String(
                                            (interaction.data as Record<string, unknown>).chain,
                                          )}
                                        </span>
                                      </div>
                                    ) : null}
                                    {(interaction.data as Record<string, unknown>)?.penalty ? (
                                      <div className="text-xs">
                                        <span className="font-medium text-green-800">Penalty:</span>
                                        <span className="ml-1 text-green-700">
                                          {String(
                                            (interaction.data as Record<string, unknown>).penalty,
                                          )}
                                        </span>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}

                            {!(interaction.data as Record<string, unknown>)?.txHash && (
                              <div className="text-sm text-orange-700 bg-orange-100 p-3 rounded-lg">
                                ⚠️ <strong>No Transaction Hash:</strong> This transaction may have
                                failed or is still pending.
                              </div>
                            )}
                          </div>
                        )}

                        <details className="group/details">
                          <summary className="cursor-pointer flex items-center space-x-2 text-sm text-[#81D7B4] hover:text-[#6bc4a1] font-semibold transition-colors duration-200 p-3 bg-gradient-to-r from-[#81D7B4]/10 to-blue-400/10 rounded-xl hover:from-[#81D7B4]/20 hover:to-blue-400/20">
                            <svg
                              className="w-4 h-4 group-open/details:rotate-90 transition-transform duration-200"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                            <span>View Raw Data</span>
                          </summary>
                          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <pre className="text-xs text-black overflow-x-auto font-mono leading-relaxed">
                              {JSON.stringify(interaction.data, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200/30">
                  <div className="flex items-center space-x-2 text-sm text-black">
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <span>•</span>
                    <span>{allFilteredInteractions.length} total results</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 bg-gradient-to-r from-[#81D7B4] to-blue-500 text-white rounded-lg hover:from-[#6bc4a1] hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                      <span>Previous</span>
                    </button>

                    {/* Page numbers */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pageNum === currentPage
                                ? "bg-gradient-to-r from-[#81D7B4] to-blue-500 text-white"
                                : "bg-gray-100 text-black hover:bg-gray-200"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 bg-gradient-to-r from-[#81D7B4] to-blue-500 text-white rounded-lg hover:from-[#6bc4a1] hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>
                </div>
              )}

              {filteredInteractions.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-[#81D7B4] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No interactions found</h3>
                  <p className="text-black max-w-md mx-auto">
                    Try adjusting your filters or search terms to find the interactions you&apos;re
                    looking for.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {false && (
          <div className="space-y-8">
            {/* Modern Error Analysis Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Error Analysis Center</h1>
                    <p className="text-red-100">Comprehensive error monitoring and resolution</p>

                    {/* Database Status Indicator */}
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            dbStatus === "connected"
                              ? "bg-green-400 animate-pulse"
                              : dbStatus === "checking"
                                ? "bg-yellow-400 animate-pulse"
                                : dbStatus === "error"
                                  ? "bg-orange-400"
                                  : "bg-red-400"
                          }`}
                        ></div>
                        <span className="text-xs text-red-100">
                          Database:{" "}
                          {dbStatus === "connected"
                            ? "Connected"
                            : dbStatus === "checking"
                              ? "Checking..."
                              : dbStatus === "error"
                                ? "Error"
                                : "Disconnected"}
                        </span>
                      </div>
                      {dbLatency && (
                        <div className="text-xs text-red-100">Latency: {dbLatency}ms</div>
                      )}
                      <button
                        onClick={checkDatabaseStatus}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors"
                        title="Refresh database status"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{errorInteractions.length}</div>
                  <div className="text-red-100 text-sm">Active Errors</div>
                </div>
              </div>
            </div>

            {/* Error Category Filter */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedErrorCategory}
                    onChange={(e) => setSelectedErrorCategory(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="network">Network Errors</option>
                    <option value="gas">Gas Estimation</option>
                    <option value="contract">Smart Contract</option>
                    <option value="wallet">Wallet Connection</option>
                    <option value="validation">Validation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Comprehensive Error Analysis */}
            <ErrorAnalysisCard
              errors={errorInteractions.filter((error) => {
                if (selectedErrorCategory === "all") return true;
                const errorData = error.data as Record<string, unknown>;
                const errorMessage = ((errorData.error as string) || "").toLowerCase();
                switch (selectedErrorCategory) {
                  case "network":
                    return (
                      errorMessage.includes("network") ||
                      errorMessage.includes("rpc") ||
                      errorMessage.includes("connection")
                    );
                  case "gas":
                    return errorMessage.includes("gas") || errorMessage.includes("estimation");
                  case "contract":
                    return (
                      errorMessage.includes("contract") ||
                      errorMessage.includes("revert") ||
                      errorMessage.includes("execution")
                    );
                  case "wallet":
                    return (
                      errorMessage.includes("wallet") ||
                      errorMessage.includes("metamask") ||
                      errorMessage.includes("coinbase")
                    );
                  case "validation":
                    return (
                      errorMessage.includes("validation") ||
                      errorMessage.includes("invalid") ||
                      errorMessage.includes("required")
                    );
                  default:
                    return true;
                }
              })}
              onDismiss={() => {}}
              markErrorAsFixed={markErrorAsFixed}
              analyzeError={(errorData: UserInteraction) =>
                analyzeError(errorData.data as Record<string, unknown>)
              }
            />

            {/* Base Savings Specific Analysis */}
            {stats.baseSavingsErrors > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800">
                      Base Savings Error Analysis
                    </h3>
                    <p className="text-blue-600">
                      {stats.baseSavingsErrors} Base chain related errors detected
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Common Issues */}
                  <div className="bg-white rounded-xl p-6 border border-orange-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Search className="w-5 h-5 text-orange-600" />
                      <h4 className="text-lg font-semibold text-orange-700">Common Issues</h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          icon: Zap,
                          title: "Gas Estimation Failed",
                          desc: "Network congestion or insufficient funds",
                          color: "text-yellow-500",
                        },
                        {
                          icon: Wifi,
                          title: "Base Network Issues",
                          desc: "RPC endpoint problems or downtime",
                          color: "text-blue-500",
                        },
                        {
                          icon: Code,
                          title: "Smart Contract Errors",
                          desc: "Contract interaction failures",
                          color: "text-purple-500",
                        },
                        {
                          icon: Wallet,
                          title: "Wallet Connection",
                          desc: "Not connected to Base network",
                          color: "text-green-500",
                        },
                        {
                          icon: DollarSign,
                          title: "Insufficient Balance",
                          desc: "Not enough ETH for gas fees",
                          color: "text-red-500",
                        },
                      ].map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <issue.icon className={`w-5 h-5 ${issue.color} mt-0.5 flex-shrink-0`} />
                          <div>
                            <div className="font-medium text-gray-900">{issue.title}</div>
                            <div className="text-sm text-gray-600">{issue.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Solutions */}
                  <div className="bg-white rounded-xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Settings className="w-5 h-5 text-green-600" />
                      <h4 className="text-lg font-semibold text-green-700">
                        Recommended Solutions
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          icon: CheckCircle,
                          title: "Check Base RPC Status",
                          desc: "Verify network endpoint health",
                          color: "text-green-500",
                        },
                        {
                          icon: RefreshCw,
                          title: "Implement Retry Logic",
                          desc: "Add fallback for gas estimation",
                          color: "text-blue-500",
                        },
                        {
                          icon: Shield,
                          title: "Better Error Handling",
                          desc: "Improve network switch detection",
                          color: "text-purple-500",
                        },
                        {
                          icon: TrendingUp,
                          title: "Balance Validation",
                          desc: "Check user funds before transaction",
                          color: "text-yellow-500",
                        },
                        {
                          icon: Layers,
                          title: "Fallback Methods",
                          desc: "Multiple gas estimation strategies",
                          color: "text-indigo-500",
                        },
                      ].map((solution, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <solution.icon
                            className={`w-5 h-5 ${solution.color} mt-0.5 flex-shrink-0`}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{solution.title}</div>
                            <div className="text-sm text-gray-600">{solution.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Error Analysis */}
            {analysisData && (
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Detailed Error Analysis</h3>
                    <p className="text-gray-600">In-depth analysis of selected error</p>
                  </div>
                </div>

                {/* Error Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h4 className="font-semibold text-red-800">Severity Level</h4>
                    </div>
                    <p
                      className={`text-2xl font-bold ${
                        String(analysisData?.severity) === "Critical"
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {String(analysisData?.severity)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <BarChart3 className="w-6 h-6 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Occurrence Rate</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {String(analysisData?.frequency)} times
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <Users className="w-6 h-6 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">Error Category</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {String(analysisData?.category)}
                    </p>
                  </div>
                </div>

                {/* Error Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Details</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Error Message:</label>
                      <div className="mt-1 p-4 bg-white rounded-lg border border-gray-200">
                        <code className="text-sm text-red-600 font-mono break-all">
                          {String(analysisData?.error)}
                        </code>
                      </div>
                    </div>

                    {analysisData?.context ? (
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Context Information:
                        </label>
                        <div className="mt-1 p-4 bg-white rounded-lg border border-gray-200 overflow-x-auto">
                          <pre className="text-sm text-gray-800 font-mono">
                            {JSON.stringify(analysisData?.context, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <label className="text-sm font-medium text-gray-700">Timestamp:</label>
                      <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm text-gray-800">
                          {new Date(
                            typeof analysisData?.timestamp === "string" ||
                            typeof analysisData?.timestamp === "number"
                              ? (analysisData?.timestamp as string | number)
                              : Date.now(),
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Recommendations */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-semibold text-green-800">Recommended Actions</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((analysisData?.recommendations as string[]) || []).map(
                      (rec: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-green-200"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-green-700 text-sm">{rec}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
