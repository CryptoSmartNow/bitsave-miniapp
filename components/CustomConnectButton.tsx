'use client'

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import sdk from '@farcaster/miniapp-sdk';
import farcasterMiniApp from '@farcaster/miniapp-wagmi-connector';
import { useConnect } from 'wagmi';

interface UnsupportedWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function UnsupportedWalletModal({ isOpen, onClose }: UnsupportedWalletModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#81D7B4] to-[#66C4A3] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Wallet Not Supported
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  BitSave currently supports the following wallets for the best experience:
                </p>
                
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: 'MetaMask', icon: '🦊' },
                    { name: 'Coinbase Wallet', icon: '🔵' },
                    { name: 'Rabby Wallet', icon: '🐰' },
                    { name: 'Trust Wallet', icon: '🛡️' },
                    { name: 'Zerion', icon: '⚡' }
                  ].map((wallet) => (
                    <div key={wallet.name} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-xl">{wallet.icon}</span>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{wallet.name}</span>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Please install one of these wallets to connect to BitSave and start your savings journey.
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#81D7B4] to-[#66C4A3] text-white rounded-lg font-medium hover:from-[#66C4A3] hover:to-[#4FB08C] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Got it
                </button>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  Get MetaMask
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CustomConnectButton() {
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);
  const { connect } = useConnect();

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={async () => {
                        if (await sdk.isInMiniApp()) {
                          connect({ connector: farcasterMiniApp() });
                          return;
                        }

                        // Check if user has any of the supported wallets
                        const hasMetaMask = typeof window !== 'undefined' && window.ethereum?.isMetaMask;
                        const hasCoinbase = typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet;
                        const hasRabby = typeof window !== 'undefined' && window.ethereum?.isRabby;
                        const hasTrust = typeof window !== 'undefined' && window.ethereum?.isTrust;
                        const hasZerion = typeof window !== 'undefined' && window.ethereum?.isZerion;
                        
                        const hasSupportedWallet = hasMetaMask || hasCoinbase || hasRabby || hasTrust || hasZerion;
                        
                        if (hasSupportedWallet || !window.ethereum) {
                          openConnectModal();
                        } else {
                          setShowUnsupportedModal(true);
                        }
                      }}
                      type="button"
                      className="bg-gradient-to-r from-[#81D7B4] to-[#66C4A3] text-white px-6 py-2 rounded-lg font-medium hover:from-[#66C4A3] hover:to-[#4FB08C] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span>Connect Wallet</span>
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={openChainModal}
                      className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 20,
                            height: 20,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 20, height: 20 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-medium">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-gradient-to-r from-[#81D7B4] to-[#66C4A3] text-white px-4 py-2 rounded-lg font-medium hover:from-[#66C4A3] hover:to-[#4FB08C] transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
      
      <UnsupportedWalletModal 
        isOpen={showUnsupportedModal} 
        onClose={() => setShowUnsupportedModal(false)} 
      />
    </>
  );
}