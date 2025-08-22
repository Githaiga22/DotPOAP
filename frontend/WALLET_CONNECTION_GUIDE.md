# Wallet Connection Testing Guide

This guide will help you test and troubleshoot the Polkadot.js wallet connection feature in DotPOAP.

## Prerequisites

1. **Browser Requirements**: Use a modern browser (Chrome, Firefox, Edge) with extension support
2. **Wallet Extension**: Install at least one of the supported wallet extensions
3. **Test Environment**: Make sure you're running the frontend locally

## Supported Wallets

- **Polkadot.js Extension** (Recommended for beginners)
- **Talisman** (Feature-rich wallet)
- **SubWallet** (Comprehensive wallet)
- **Nova Wallet** (Next-gen wallet)

## Installation Steps

### 1. Install Polkadot.js Extension (Recommended)

1. Go to [https://polkadot.js.org/extension/](https://polkadot.js.org/extension/)
2. Click "Install for Chrome/Firefox/Edge"
3. Follow the browser extension installation process
4. Create a new account or import an existing one
5. Make sure the account is unlocked

### 2. Install Alternative Wallets

- **Talisman**: [https://talisman.xyz/](https://talisman.xyz/)
- **SubWallet**: [https://subwallet.app/](https://subwallet.app/)
- **Nova Wallet**: [https://novawallet.io/](https://novawallet.io/)

## Testing the Connection

### Step 1: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 2: Navigate to Wallet Demo

1. Open your browser and go to `http://localhost:5173/wallet-demo`
2. This page provides a comprehensive testing environment

### Step 3: Check Network Connection

1. Look for the "Network Status" card
2. It should show "Connected to Asset Hub Paseo" with a green checkmark
3. If it shows "Connecting..." or an error, there's a network issue

### Step 4: Test Wallet Detection

1. Look for the "Wallet Status" card
2. It should show "Not Connected" initially
3. The "Wallet Setup" section should detect your installed wallet

### Step 5: Connect Wallet

1. Click the "Connect Wallet" button
2. Select your wallet from the modal
3. Approve the connection in your wallet extension
4. Check that the status changes to "Wallet Connected"

## Troubleshooting

### Common Issues and Solutions

#### 1. "No wallet extensions detected"

**Symptoms**: Error message when trying to connect
**Solutions**:
- Make sure you have a wallet extension installed
- Refresh the page after installing the extension
- Check that the extension is enabled in your browser
- Try a different wallet extension

#### 2. "No accounts found in your wallet"

**Symptoms**: Wallet detected but no accounts available
**Solutions**:
- Create a new account in your wallet extension
- Import an existing account
- Make sure the wallet is unlocked
- Check that you're on the correct network

#### 3. "Failed to retrieve accounts from wallet"

**Symptoms**: Connection fails during account retrieval
**Solutions**:
- Make sure your wallet is unlocked
- Check that you have granted permission to the website
- Try disconnecting and reconnecting
- Check browser console for detailed error messages

#### 4. Network Connection Issues

**Symptoms**: "Network connection failed" or "Connecting..." status
**Solutions**:
- Check your internet connection
- The app will automatically try multiple RPC endpoints
- Wait for the connection to establish (can take up to 20 seconds)
- Check browser console for connection details

### Debug Information

#### Browser Console Logs

Open the browser console (F12) and look for logs starting with:
- 🔵 [INFO] - General information
- 🟡 [WARN] - Warnings
- 🔴 [ERROR] - Errors
- 🟢 [SUCCESS] - Successful operations
- 🔍 [DEBUG] - Detailed debugging information

#### Debug Panel

In the Wallet Demo page, expand the "🔍 Debug Information" section to see:
- Browser environment status
- Available wallet extensions
- Direct wallet object detection
- Real-time connection status

### Testing Checklist

- [ ] Frontend starts without errors
- [ ] Network connects to Asset Hub Paseo
- [ ] Wallet extension is detected
- [ ] Wallet connection modal opens
- [ ] Wallet extension prompts for permission
- [ ] Accounts are retrieved successfully
- [ ] Account selection works
- [ ] Disconnect functionality works
- [ ] Account switching works (if multiple accounts)

## Advanced Testing

### Multiple Wallet Testing

1. Install multiple wallet extensions
2. Test switching between different wallets
3. Verify that account information is preserved
4. Test concurrent wallet connections

### Error Handling Testing

1. Test with locked wallet
2. Test with no accounts
3. Test network disconnection
4. Test invalid account formats

### Performance Testing

1. Monitor connection time
2. Check memory usage
3. Test with large numbers of accounts
4. Verify reconnection logic

## Getting Help

If you encounter issues:

1. **Check the browser console** for detailed error messages
2. **Review the debug information** in the Wallet Demo page
3. **Verify wallet extension status** in your browser
4. **Check network connectivity** to the RPC endpoints
5. **Try a different wallet extension** to isolate the issue

## Technical Details

### Wallet Detection Logic

The app uses multiple detection methods:
- `window.injectedWeb3` - Standard injection pattern
- Direct object detection (`window.polkadot`, `window.talisman`, etc.)
- Fallback detection for different wallet implementations

### Connection Flow

1. **Detection**: Check for available wallet extensions
2. **Enable**: Use `web3Enable()` to activate extensions
3. **Accounts**: Retrieve accounts with `web3Accounts()`
4. **Validation**: Filter and validate account formats
5. **Connection**: Establish connection and select account

### Network Configuration

- **Primary**: `wss://paseo-asset-hub-rpc.polkadot.io`
- **Fallbacks**: Multiple RPC endpoints for reliability
- **Timeout**: 20 seconds for initial connection
- **Retry**: Automatic retry with exponential backoff

## Support

For additional support:
- Check the browser console logs
- Review the debug information
- Test with different wallet extensions
- Verify network connectivity
- Check wallet extension documentation 