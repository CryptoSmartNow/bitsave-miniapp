'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useSwitchChain } from 'wagmi';
import { useOptimizedDisconnect } from '../../lib/useOptimizedDisconnect';
import { trackWalletConnect, trackPageVisit } from '../../lib/interactionTracker';
import CustomConnectButton from '../../components/CustomConnectButton';
import sdk from "@farcaster/miniapp-sdk";
import { base } from 'viem/chains';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const { isConnected, address } = useAccount();
  const { disconnect, isDisconnecting } = useOptimizedDisconnect();
  const { switchChain } = useSwitchChain();

  // Set mounted state after component mounts to prevent hydration mismatch
  useEffect(() => {
    const readyMiniapp = async () => {
      await sdk.actions.ready();
      setMounted(true);
    }
    if (sdk && !mounted) {
      readyMiniapp();
    }
  }, [mounted]);

  // Function to switch to Base network
  const switchToBaseNetwork = async () => {
    if (!isConnected) return;
    
    try {
      // Try to switch to Base network
      switchChain({ chainId: base.id });
    } catch (error: unknown) { 
      
      // Type guard to check if error is an object with a code property
      if (error && typeof error === 'object' && 'code' in error && error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105', // Base chainId in hex
                chainName: 'Base',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              },
            ],
          });
          
          // Try switching again after adding
          switchChain({ chainId: base.id });
        } catch (addError) {
          console.error('Error adding Base network:', addError);
        }
      } else {
        console.error('Error switching to Base network:', error);
      }
    }
  };

  // Add effect to redirect when wallet is connected and switch to Base network
  useEffect(() => {
    if (mounted && isConnected && address) {
      // Track wallet connection
      trackWalletConnect(address, {
        networkSwitched: true,
        redirectedToDashboard: true,
      });
      
      // Switch to Base network first
      switchToBaseNetwork().then(() => {
        // Then redirect to dashboard
        router.push('/dashboard');
      });
    }
  }, [isConnected, mounted, router, address]);

  // Track page visits
  useEffect(() => {
    if (mounted) {
      trackPageVisit(window.location.pathname, address ? { walletAddress: address } : undefined);
    }
  }, [mounted, address]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleWalletAction = async () => {
    if (mounted && isConnected) {
      // If already connected, switch to Base and redirect to dashboard
      await switchToBaseNetwork();
      router.push('/dashboard');
    }
    // Connect wallet functionality is now handled by CustomConnectButton
  };

  // Render consistent UI during server-side rendering
  const renderWalletButton = () => {
    // During SSR or before mounting, always show "Connect Wallet"
    if (!mounted) {
      return (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Connect Wallet
        </>
      );
    }

    // After mounting, show the correct button based on connection state
    return mounted && isConnected ? (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Open App
      </>
    ) : (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Connect Wallet
      </>
    );
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 bg-white/30 backdrop-blur-md px-6 py-4 mx-auto max-w-6xl rounded-xl shadow-sm border border-[#81D7B4]/10">      
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#81D7B4] to-[#81D7B4]/80">BitSave</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-[#81D7B4] transition-colors">Home</Link>
          <Link href="/#how-it-works" className="text-gray-700 hover:text-[#81D7B4] transition-colors"  >How It Works</Link>
          <Link href="/#security" className="text-gray-700 hover:text-[#81D7B4] transition-colors">Security</Link>
          <Link href="/#features" className="text-gray-700 hover:text-[#81D7B4] transition-colors">Features</Link>
          <Link href="/#faq" className="text-gray-700 hover:text-[#81D7B4] transition-colors">FAQ</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {mounted && isConnected ? (
            <button 
              onClick={handleWalletAction}
              className="bg-[#81D7B4] text-white hidden md:flex items-center justify-center rounded-lg px-6 py-2.5 font-medium transition-all duration-300 hover:shadow-lg"
            >
              {renderWalletButton()}
            </button>
          ) : (
            <div className="hidden md:block">
              <CustomConnectButton />
            </div>
          )}
          <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden py-4 px-2 mt-4 bg-white/90 backdrop-blur-lg rounded-lg border border-[#81D7B4]/10 shadow-md">
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="px-4 py-2 text-gray-700 hover:bg-[#81D7B4]/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/#how-it-works" 
              className="px-4 py-2 text-gray-700 hover:bg-[#81D7B4]/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              href="/#security" 
              className="px-4 py-2 text-gray-700 hover:bg-[#81D7B4]/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Security
            </Link>
            <Link 
              href="/#features" 
              className="px-4 py-2 text-gray-700 hover:bg-[#81D7B4]/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/#faq" 
              className="px-4 py-2 text-gray-700 hover:bg-[#81D7B4]/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ


            </Link>
            {mounted && isConnected ? (
              <div className="flex flex-col space-y-2 px-4 pt-2">
                <button 
                  onClick={() => {
                    router.push('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-[#81D7B4] to-[#66C4A3] text-white flex items-center justify-center rounded-lg px-6 py-2.5 font-medium transition-all duration-300 hover:shadow-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Open App
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    disconnect();
                  }}
                  disabled={isDisconnecting}
                  className="flex items-center justify-center rounded-lg px-6 py-2.5 font-medium transition-all duration-300 hover:bg-gray-100 border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  {isDisconnecting ? (
                    <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              </div>
            ) : (
              <div className="mx-4">
                <CustomConnectButton />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}